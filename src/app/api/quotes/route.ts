import { NextRequest, NextResponse } from "next/server";
import { QuoteStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { calculateTotals, generatePublicSlug } from "@/lib/utils";

export async function GET() {
  const quotes = await prisma.quote.findMany({
    include: { client: true },
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  return NextResponse.json(quotes);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const totals = calculateTotals(items);
    const count = await prisma.quote.count();
    const reference = `Q-${String(count + 1).padStart(4, "0")}`;
    const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@example.com";
    const ownerName = process.env.SEED_OWNER_NAME ?? "Demo Owner";

    const quote = await prisma.quote.create({
      data: {
        title: body.title ?? "Nueva cotización",
        summary: body.summary,
        terms: body.terms,
        notes: body.notes,
        currency: body.currency ?? "CLP",
        owner: {
          connectOrCreate: {
            where: { email: ownerEmail },
            create: {
              email: ownerEmail,
              name: ownerName
            }
          }
        },
        client: body.clientId
          ? {
              connect: { id: body.clientId }
            }
          : undefined,
        template: body.templateId
          ? {
              connect: { id: body.templateId }
            }
          : undefined,
        reference,
        publicSlug: generatePublicSlug(reference),
        status: QuoteStatus.DRAFT,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        items: {
          create: items.map((item: any, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            position: index
          }))
        }
      }
    });

    return NextResponse.json({ message: "Cotización creada", quote });
  } catch (error) {
    console.error("create quote error", error);
    return NextResponse.json({ error: "No se pudo crear la cotización" }, { status: 500 });
  }
}
