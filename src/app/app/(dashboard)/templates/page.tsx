import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { category: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Plantillas</h1>
        <p className="mt-2 text-sm text-slate-600">
          Personaliza propuestas por oficio para acelerar la generación automática.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => {
          const itemsCount = Array.isArray(template.items) ? template.items.length : 0;
          return (
            <article key={template.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{template.name}</h2>
                  <p className="text-sm text-slate-500">{template.category}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {itemsCount} ítems
                </span>
              </header>
              <p className="mt-4 text-sm text-slate-600">{template.description}</p>
              <footer className="mt-6 text-xs text-slate-500">
                Última actualización {template.updatedAt.toLocaleDateString("es-CL")}
              </footer>
            </article>
          );
        })}
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Ideas para futuras iteraciones</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Versionado de plantillas por temporada.</li>
          <li>Variables dinámicas (cliente, dirección, fechas).</li>
          <li>Compartir plantillas con colaboradores.</li>
        </ul>
      </div>
    </div>
  );
}
