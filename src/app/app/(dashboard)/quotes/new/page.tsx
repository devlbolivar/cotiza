import prisma from "@/lib/prisma";
import { QuoteEditor } from "@/components/QuoteEditor";

export const dynamic = "force-dynamic";

export default async function NewQuotePage() {
  const [clients, templates] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.template.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Nueva cotización</h1>
        <p className="mt-2 text-sm text-slate-600">
          Genera una nueva propuesta desde cero, con plantillas o IA.
        </p>
      </div>
      <QuoteEditor
        initialValues={{
          title: "",
          summary: "",
          terms: "Pago 50% para iniciar. Entrega estimada en 5 días hábiles.",
          notes: "",
          currency: "CLP",
          clientId: undefined,
          templateId: undefined,
          items: []
        }}
        clients={clients}
        templates={templates}
      />
    </div>
  );
}
