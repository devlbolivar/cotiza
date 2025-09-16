"use client";

import { useState } from "react";
import type { QuoteDecision } from "@prisma/client";

const DECISION_LABELS: Array<{ value: QuoteDecision; label: string; helper: string }> = [
  { value: "APPROVED", label: "Aprobar", helper: "Acepto la cotización y los términos" },
  { value: "CHANGES_REQUESTED", label: "Solicitar cambios", helper: "Necesito ajustes antes de aprobar" },
  { value: "REJECTED", label: "Rechazar", helper: "No seguiremos adelante" }
];

export function PublicDecisionForm({ quoteId }: { quoteId: string }) {
  const [decision, setDecision] = useState<QuoteDecision>("APPROVED");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch(`/api/quotes/${quoteId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, name, email, message, acceptTerms })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo registrar la respuesta");
      }

      setFeedback(data.message ?? "¡Gracias! Hemos registrado tu decisión.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="space-y-3">
        {DECISION_LABELS.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 hover:border-primary">
            <input
              type="radio"
              value={option.value}
              checked={decision === option.value}
              onChange={() => setDecision(option.value)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
              <span className="block text-xs text-slate-500">{option.helper}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Correo (opcional)</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Comentarios</label>
        <textarea
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          placeholder="Déjanos instrucciones adicionales si necesitas ajustes"
        />
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(event) => setAcceptTerms(event.target.checked)}
          className="mt-0.5"
        />
        Confirmo que he leído y acepto los términos de la cotización.
      </label>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      {feedback ? <p className="text-sm text-emerald-600">{feedback}</p> : null}
      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar decisión"}
      </button>
    </form>
  );
}
