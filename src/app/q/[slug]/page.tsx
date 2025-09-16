import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { PublicDecisionForm } from "@/components/PublicDecisionForm";

export const dynamic = "force-dynamic";

export default async function PublicQuotePage({ params }: { params: { slug: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { publicSlug: params.slug },
    include: { items: { orderBy: { position: "asc" } } }
  });

  if (!quote) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-wider text-slate-500">Cotización #{quote.reference}</p>
        <h1 className="text-4xl font-semibold text-slate-900">{quote.title}</h1>
        <p className="text-base text-slate-600">{quote.summary}</p>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Ítem</th>
              <th className="px-6 py-3">Cantidad</th>
              <th className="px-6 py-3">Unidad</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {quote.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm text-slate-700">{item.description}</td>
                <td className="px-6 py-4 text-slate-500">{Number(item.quantity)}</td>
                <td className="px-6 py-4 text-slate-500">{item.unit ?? ""}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {formatCurrency(Number(item.quantity) * Number(item.unitPrice), quote.currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 text-sm text-slate-600">
            <tr>
              <td colSpan={3} className="px-6 py-3 text-right font-semibold text-slate-900">
                Total
              </td>
              <td className="px-6 py-3 text-right font-semibold text-slate-900">
                {formatCurrency(Number(quote.total), quote.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Términos</h2>
          <p className="whitespace-pre-line text-sm text-slate-600">{quote.terms}</p>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Notas</h2>
          <p className="whitespace-pre-line text-sm text-slate-600">{quote.notes}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Tu decisión</h2>
        <p className="mt-2 text-sm text-slate-600">
          Deja tu respuesta y una persona del equipo te contactará para confirmar los próximos pasos.
        </p>
        <div className="mt-4">
          <PublicDecisionForm quoteId={quote.id} />
        </div>
      </section>
    </div>
  );
}
