"use client";

import { useState, useTransition } from "react";
import type { QuoteStatus } from "@prisma/client";
import { createWhatsappLink } from "@/lib/utils";

export function QuoteActions({
  quoteId,
  status,
  publicUrl,
  clientPhone
}: {
  quoteId: string;
  status: QuoteStatus;
  publicUrl: string;
  clientPhone?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");

  const sendQuote = () => {
    startTransition(async () => {
      const response = await fetch(`/api/quotes/${quoteId}/send`, {
        method: "POST"
      });
      const data = await response.json();
      setMessage(data.message ?? "Cotización enviada (stub)");
      if (data.whatsappMessage) {
        setWhatsappMessage(data.whatsappMessage);
      }
    });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setMessage("Enlace copiado al portapapeles");
  };

  const whatsappLink = whatsappMessage && clientPhone ? createWhatsappLink(clientPhone, whatsappMessage) : null;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={sendQuote}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Enviando..." : status === "SENT" ? "Reenviar" : "Enviar cotización"}
        </button>
        <button
          onClick={copyLink}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Copiar enlace público
        </button>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
          >
            Abrir WhatsApp
          </a>
        ) : null}
      </div>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      {whatsappMessage ? (
        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Mensaje sugerido:</p>
          <p className="whitespace-pre-line">{whatsappMessage}</p>
        </div>
      ) : null}
      <p className="text-xs text-slate-500">
        Los recordatorios automáticos se programan 24h y 72h después del envío.
      </p>
    </div>
  );
}
