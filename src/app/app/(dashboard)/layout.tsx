import Link from "next/link";
import { ReactNode } from "react";

const navigation = [
  { href: "/app/quotes", label: "Cotizaciones" },
  { href: "/app/quotes/new", label: "Nueva" },
  { href: "/app/clients", label: "Clientes" },
  { href: "/app/templates", label: "Plantillas" },
  { href: "/app/reports", label: "Reportes" },
  { href: "/app/settings", label: "Configuración" }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/app/quotes" className="text-lg font-semibold text-slate-900">
            AI Cotizador
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-slate-600">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
