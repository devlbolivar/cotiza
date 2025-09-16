import Link from "next/link";

const features = [
  {
    title: "Genera cotizaciones con IA",
    description: "Convierte notas de texto o audio en propuestas estructuradas listas para editar."
  },
  {
    title: "Envío y seguimiento centralizado",
    description: "Envía por email, comparte enlace público y haz seguimiento en tiempo real."
  },
  {
    title: "Decisión rápida del cliente",
    description: "Los clientes pueden aprobar, pedir cambios o rechazar directamente desde la web."
  },
  {
    title: "Recordatorios inteligentes",
    description: "Recibe recordatorios automáticos a las 24 y 72 horas con mensajes sugeridos."
  }
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-slate-900 py-24 text-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
              Lanzamiento MVP
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              AI Cotizador &amp; Propuestas
            </h1>
            <p className="mt-4 text-lg text-slate-200">
              Acelera el cierre de negocios con cotizaciones generadas por IA, recordatorios automáticos y reportes claros.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/app/quotes"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-card"
              >
                Ir al panel demo
              </Link>
              <Link
                href="#features"
                className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-100 hover:bg-slate-800"
              >
                Ver funcionalidades
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto flex-1 px-6 py-16">
        <h2 className="text-3xl font-semibold">Diseñado para equipos comerciales ágiles</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Crea plantillas por oficio, registra clientes y visualiza el embudo de cotizaciones en cuestión de minutos.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
