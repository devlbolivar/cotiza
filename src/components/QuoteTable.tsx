import Link from "next/link";
import type { QuoteStatus } from "@prisma/client";
import { formatCurrency, quoteStatusBadge, quoteStatusLabel, relativeTime } from "@/lib/utils";

type QuoteListItem = {
  id: string;
  reference: string;
  title: string;
  status: QuoteStatus;
  total: number;
  currency: string;
  clientName?: string | null;
  updatedAt: Date;
};

export function QuoteTable({ quotes }: { quotes: QuoteListItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3">Referencia</th>
            <th className="px-6 py-3">Cliente</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Total</th>
            <th className="px-6 py-3">Actualizado</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm">
          {quotes.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                Aún no hay cotizaciones. Genera la primera para empezar.
              </td>
            </tr>
          ) : (
            quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{quote.reference}</td>
                <td className="px-6 py-4 text-slate-600">{quote.clientName ?? "-"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${quoteStatusBadge(quote.status)}`}>
                    {quoteStatusLabel(quote.status)}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {formatCurrency(quote.total, quote.currency)}
                </td>
                <td className="px-6 py-4 text-slate-500">{relativeTime(quote.updatedAt)}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link href={`/app/quotes/${quote.id}`} className="font-medium text-primary">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
