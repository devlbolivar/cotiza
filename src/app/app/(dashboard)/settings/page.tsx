export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Configuración</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ajustes básicos del espacio demo. Próximamente se integrará autenticación y branding propio.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Datos de la empresa</h2>
          <p className="mt-2 text-sm text-slate-600">
            Personaliza nombre comercial, información legal y pie de página de las cotizaciones.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Automatizaciones</h2>
          <p className="mt-2 text-sm text-slate-600">
            Configura recordatorios automáticos, integraciones con CRM y webhooks.
          </p>
        </div>
      </section>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Roadmap</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Single sign-on con Clerk/Auth.js.</li>
          <li>Personalización de dominios y subdominios para enlaces públicos.</li>
          <li>Campos personalizados por tipo de cotización.</li>
        </ul>
      </div>
    </div>
  );
}
