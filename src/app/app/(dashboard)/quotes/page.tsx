import { QuoteStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { StatsCards } from "@/components/StatsCards";
import { QuoteTable } from "@/components/QuoteTable";

function buildFunnel(quotes: Array<{ status: QuoteStatus }>) {
  const funnelOrder: QuoteStatus[] = [
    QuoteStatus.SENT,
    QuoteStatus.VIEWED,
    QuoteStatus.APPROVED,
    QuoteStatus.REJECTED,
    QuoteStatus.EXPIRED
  ];

  return funnelOrder.map((status) => ({
    status,
    value: quotes.filter((quote) => quote.status === status).length
  }));
}

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: { client: true },
    orderBy: { updatedAt: "desc" },
    take: 20
  });

  const stats = [
    {
      label: "Total cotizaciones",
      value: await prisma.quote.count()
    },
    {
      label: "Enviadas",
      value: await prisma.quote.count({ where: { status: QuoteStatus.SENT } })
    },
    {
      label: "Vistas",
      value: await prisma.quote.count({ where: { status: QuoteStatus.VIEWED } }),
      delta: "+12% vs semana pasada"
    },
    {
      label: "Aprobadas",
      value: await prisma.quote.count({ where: { status: QuoteStatus.APPROVED } })
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Cotizaciones</h1>
        <p className="text-sm text-slate-600">
          Crea nuevas propuestas, revisa estados y gestiona recordatorios.
        </p>
      </div>
      <StatsCards stats={stats} funnel={buildFunnel(quotes)} />
      <QuoteTable
        quotes={quotes.map((quote) => ({
          id: quote.id,
          reference: quote.reference,
          title: quote.title,
          status: quote.status,
          total: Number(quote.total),
          currency: quote.currency,
          clientName: quote.client?.name,
          updatedAt: quote.updatedAt
        }))}
      />
    </div>
  );
}
