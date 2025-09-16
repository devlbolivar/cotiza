import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuoteEditor } from "@/components/QuoteEditor";
import { QuoteActions } from "@/components/QuoteActions";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params
}: {
  params: { id: string };
}) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      template: true,
      items: { orderBy: { position: "asc" } }
    }
  });

  if (!quote) {
    notFound();
  }

  const [clients, templates] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.template.findMany({ orderBy: { name: "asc" } })
  ]);

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/q/${quote.publicSlug}`;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{quote.title}</h1>
          <p className="text-sm text-slate-600">
            Referencia {quote.reference} · Total {formatCurrency(Number(quote.total), quote.currency)}
          </p>
        </div>
        <QuoteActions
          quoteId={quote.id}
          status={quote.status}
          publicUrl={publicUrl}
          clientPhone={quote.client?.phone ?? undefined}
        />
      </div>

      <QuoteEditor
        quoteId={quote.id}
        initialValues={{
          title: quote.title,
          summary: quote.summary ?? "",
          terms: quote.terms ?? "",
          notes: quote.notes ?? "",
          currency: quote.currency,
          clientId: quote.clientId,
          templateId: quote.templateId,
          items: quote.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unit: item.unit ?? undefined,
            unitPrice: Number(item.unitPrice)
          }))
        }}
        clients={clients}
        templates={templates}
      />
    </div>
  );
}
