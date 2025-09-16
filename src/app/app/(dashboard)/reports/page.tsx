import { QuoteStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { formatCurrency, quoteStatusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusOrder: QuoteStatus[] = [
  QuoteStatus.SENT,
  QuoteStatus.VIEWED,
  QuoteStatus.APPROVED,
  QuoteStatus.REJECTED,
  QuoteStatus.EXPIRED
];

export default async function ReportsPage() {
  const quotes = await prisma.quote.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });

  const statusBuckets = statusOrder.map((status) => {
    const filtered = quotes.filter((quote) => quote.status === status);
    const total = filtered.reduce((acc, quote) => acc + Number(quote.total), 0);
    return {
      status,
      count: filtered.length,
      total
    };
  });

  const conversionRate = (() => {
    const sent = statusBuckets.find((bucket) => bucket.status === QuoteStatus.SENT)?.count ?? 0;
    const approved = statusBuckets.find((bucket) => bucket.status === QuoteStatus.APPROVED)?.count ?? 0;
    if (!sent) return 0;
    return Math.round((approved / sent) * 100);
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Reportes</h1>
        <p className="mt-2 text-sm text-slate-600">
          Analiza el desempeño de tus propuestas y detecta cuellos de botella.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm text-slate-500">Tasa de cierre</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{conversionRate}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm text-slate-500">Ticket promedio</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {formatCurrency(quotes.length ? quotes.reduce((acc, quote) => acc + Number(quote.total), 0) / quotes.length : 0)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm text-slate-500">Cotizaciones activas</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {quotes.filter((quote) => [QuoteStatus.SENT, QuoteStatus.VIEWED].includes(quote.status)).length}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Cantidad</th>
              <th className="px-6 py-3">Monto acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {statusBuckets.map((bucket) => (
              <tr key={bucket.status}>
                <td className="px-6 py-4 font-medium text-slate-900">{quoteStatusLabel(bucket.status)}</td>
                <td className="px-6 py-4 text-slate-600">{bucket.count}</td>
                <td className="px-6 py-4 text-slate-600">{formatCurrency(bucket.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Siguientes pasos sugeridos</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Exportar reportes en CSV y compartir con dirección.</li>
          <li>Comparar desempeño por plantilla u origen del lead.</li>
          <li>Alertas cuando una cotización está por expirar.</li>
        </ul>
      </div>
    </div>
  );
}
