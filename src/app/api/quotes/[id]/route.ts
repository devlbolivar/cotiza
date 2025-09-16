import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateTotals } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { client: true, items: true }
  });
  if (!quote) {
    return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
  }
  return NextResponse.json(quote);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const totals = calculateTotals(items);

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        title: body.title,
        summary: body.summary,
        terms: body.terms,
        notes: body.notes,
        currency: body.currency,
        clientId: body.clientId,
        templateId: body.templateId,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        items: {
          deleteMany: {},
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

    return NextResponse.json({ message: "Cotización actualizada", quote });
  } catch (error) {
    console.error("update quote error", error);
    return NextResponse.json({ error: "No se pudo actualizar la cotización" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.quote.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Cotización eliminada" });
  } catch (error) {
    console.error("delete quote error", error);
    return NextResponse.json({ error: "No se pudo eliminar la cotización" }, { status: 500 });
  }
}
