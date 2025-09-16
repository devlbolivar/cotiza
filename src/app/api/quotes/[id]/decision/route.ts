import { NextRequest, NextResponse } from "next/server";
import { QuoteDecision, QuoteStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

const STATUS_BY_DECISION: Record<QuoteDecision, QuoteStatus> = {
  [QuoteDecision.APPROVED]: QuoteStatus.APPROVED,
  [QuoteDecision.CHANGES_REQUESTED]: QuoteStatus.CHANGES_REQUESTED,
  [QuoteDecision.REJECTED]: QuoteStatus.REJECTED
};

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const decision = body.decision as QuoteDecision;

    if (!decision || !Object.values(QuoteDecision).includes(decision)) {
      return NextResponse.json({ error: "Decisión inválida" }, { status: 400 });
    }

    if (!body.name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    if (!body.acceptTerms) {
      return NextResponse.json({ error: "Debes aceptar los términos" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") ?? request.ip ?? "unknown";

    const updated = await prisma.quote.update({
      where: { id: params.id },
      data: {
        decision,
        decisionName: body.name,
        decisionEmail: body.email,
        decisionMessage: body.message,
        decisionIp: ip,
        decisionAt: new Date(),
        status: STATUS_BY_DECISION[decision],
        approvedAt: decision === QuoteDecision.APPROVED ? new Date() : undefined,
        activities: {
          create: {
            type: "CLIENT_ACTION",
            description: `Cliente respondió: ${decision}`,
            metadata: body
          }
        }
      }
    });

    return NextResponse.json({ message: "Respuesta registrada", quote: updated });
  } catch (error) {
    console.error("decision error", error);
    return NextResponse.json({ error: "No se pudo registrar la respuesta" }, { status: 500 });
  }
}
