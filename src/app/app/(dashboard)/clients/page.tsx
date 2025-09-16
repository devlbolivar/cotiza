import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Clientes</h1>
        <p className="mt-2 text-sm text-slate-600">
          Registra datos básicos para enviar cotizaciones y seguimiento rápido.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Registra tus primeros clientes para empezar a cotizar.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                  <td className="px-6 py-4 text-slate-600">{client.email ?? "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{client.phone ?? "-"}</td>
                  <td className="px-6 py-4 text-slate-500">{client.notes ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Próximamente</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Importar clientes desde Excel o CRM.</li>
          <li>Etiquetas y segmentos personalizados.</li>
          <li>Historial de cotizaciones y oportunidades.</li>
        </ul>
      </div>
    </div>
  );
}
