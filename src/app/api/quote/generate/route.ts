import { NextRequest, NextResponse } from "next/server";
import { generateQuoteDraft } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const brief: string = body.brief ?? body.text ?? "";

    if (!brief) {
      return NextResponse.json({ error: "Se requiere un brief o transcripción" }, { status: 400 });
    }

    const draft = await generateQuoteDraft(brief);
    return NextResponse.json(draft);
  } catch (error) {
    console.error("generate quote error", error);
    return NextResponse.json({ error: "No se pudo generar la cotización" }, { status: 500 });
  }
}
