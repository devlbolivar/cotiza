import OpenAI from "openai";
import { QUOTE_GENERATOR_SYSTEM_PROMPT, WHATSAPP_FOLLOWUP_PROMPT } from "@/lib/ai/prompts";

type QuoteDraft = {
  summary: string;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
  terms: string;
  notes: string;
};

const apiKey = process.env.OPENAI_API_KEY;

export const openaiClient = apiKey ? new OpenAI({ apiKey }) : null;

function safeParseDraft(content: string | null | undefined): QuoteDraft | null {
  if (!content) return null;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  try {
    return jsonMatch ? (JSON.parse(jsonMatch[0]) as QuoteDraft) : (JSON.parse(content) as QuoteDraft);
  } catch (error) {
    console.warn("Failed to parse AI response", error);
    return null;
  }
}

const FALLBACK_DRAFT: QuoteDraft = {
  summary: "Propuesta generada automáticamente en base al brief proporcionado.",
  items: [
    {
      description: "Consultoría y planificación",
      quantity: 1,
      unit: "servicio",
      unitPrice: 150
    },
    {
      description: "Ejecución de actividades principales",
      quantity: 5,
      unit: "hora",
      unitPrice: 45
    }
  ],
  terms: "La propuesta es válida por 7 días. Se requiere 50% de anticipo para iniciar trabajos.",
  notes: "Puedes editar ítems, cantidades y notas antes de enviar la cotización."
};

export async function generateQuoteDraft(brief: string): Promise<QuoteDraft> {
  if (!brief?.trim()) {
    throw new Error("El brief o notas son obligatorias");
  }

  if (!openaiClient) {
    return FALLBACK_DRAFT;
  }

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.3,
    messages: [
      { role: "system", content: QUOTE_GENERATOR_SYSTEM_PROMPT },
      { role: "user", content: brief }
    ]
  });

  const aiDraft = safeParseDraft(completion.choices[0]?.message?.content);
  return aiDraft ?? FALLBACK_DRAFT;
}

export async function generateWhatsappFollowUp(reference: string, total: number): Promise<string> {
  const amount = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total ?? 0);
  const context = `Referencia: ${reference}\nTotal: ${amount}`;

  if (!openaiClient) {
    return `Hola, te compartimos un recordatorio amable sobre la cotización ${reference} por ${amount}. ¿Te gustaría avanzar o necesitas ajustes?`;
  }

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.4,
    messages: [
      { role: "system", content: WHATSAPP_FOLLOWUP_PROMPT },
      { role: "user", content: context }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() ??
    `Hola, te compartimos un recordatorio amable sobre la cotización ${reference} por ${amount}. ¿Te gustaría avanzar o necesitas ajustes?`;
}
