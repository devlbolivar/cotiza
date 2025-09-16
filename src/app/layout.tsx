import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "AI Cotizador & Propuestas",
    template: "%s | AI Cotizador & Propuestas"
  },
  description: "Genera, envía y rastrea cotizaciones inteligentes para tu pyme.",
  applicationName: "AI Cotizador & Propuestas",
  manifest: "/manifest.json",
  metadataBase: new URL(appUrl)
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        <ServiceWorkerRegister />
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
