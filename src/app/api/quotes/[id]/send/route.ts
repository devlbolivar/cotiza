import { NextRequest, NextResponse } from "next/server";
import { QuoteStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getMailProvider } from "@/lib/mail";
import { generateWhatsappFollowUp } from "@/lib/openai";
import { getReminderSchedule } from "@/lib/utils";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: { client: true }
    });

    if (!quote) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    const sentAt = new Date();
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/q/${quote.publicSlug}`;

    const updated = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: QuoteStatus.SENT,
        sentAt,
        activities: {
          create: {
            type: "STATUS_CHANGE",
            description: "Cotización enviada al cliente"
          }
        }
      },
      include: { client: true }
    });

    await prisma.reminder.deleteMany({ where: { quoteId: params.id } });
    const reminders = getReminderSchedule(sentAt);
    await Promise.all(
      reminders.map((reminder) =>
        prisma.reminder.create({
          data: {
            quoteId: params.id,
            reminderType: "EMAIL",
            runAt: reminder.runAt
          }
        })
      )
    );

    const mailProvider = getMailProvider();
    await mailProvider.sendQuoteEmail({ quote: updated, client: updated.client, publicUrl });

    const whatsappMessage = await generateWhatsappFollowUp(updated.reference, Number(updated.total));

    return NextResponse.json({
      message: "Cotización enviada",
      whatsappMessage,
      publicUrl
    });
  } catch (error) {
    console.error("send quote error", error);
    return NextResponse.json({ error: "No se pudo enviar la cotización" }, { status: 500 });
  }
}
