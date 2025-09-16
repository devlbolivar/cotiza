"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import type { QuoteStatus } from "@prisma/client";
import { ClientPicker } from "@/components/ClientPicker";
import { TemplatePicker } from "@/components/TemplatePicker";
import { calculateTotals, formatCurrency, QuoteItemInput } from "@/lib/utils";

export type QuoteEditorValues = {
  title: string;
  summary: string;
  terms: string;
  notes: string;
  currency: string;
  clientId?: string | null;
  templateId?: string | null;
  items: QuoteItemInput[];
  status?: QuoteStatus;
};

type SelectOption = {
  id: string;
  name: string;
  email?: string | null;
  category?: string;
};

export function QuoteEditor({
  quoteId,
  initialValues,
  clients,
  templates
}: {
  quoteId?: string;
  initialValues: QuoteEditorValues;
  clients: SelectOption[];
  templates: SelectOption[];
}) {
  const [values, setValues] = useState<QuoteEditorValues>(initialValues);
  const [items, setItems] = useState<QuoteItemInput[]>(initialValues.items ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [aiBrief, setAiBrief] = useState("Descripción de servicios a cotizar...");
  const [isGenerating, startGenerating] = useTransition();

  const totals = useMemo(() => calculateTotals(items), [items]);

  const updateItem = (index: number, field: keyof QuoteItemInput, value: string) => {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [field]: field === "description" ? value : Number(value)
          }
        : item
    );
    setItems(nextItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "Nuevo ítem",
        quantity: 1,
        unit: "servicio",
        unitPrice: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...values,
        items,
        totals
      };
      const response = await fetch(quoteId ? `/api/quotes/${quoteId}` : "/api/quotes", {
        method: quoteId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la cotización");
      }

      const data = await response.json();
      setSuccess(data.message ?? "Cotización guardada");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  const generateWithAI = () => {
    startGenerating(async () => {
      setError(null);
      try {
        const response = await fetch("/api/quote/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brief: aiBrief })
        });

        if (!response.ok) {
          throw new Error("No se pudo generar la cotización");
        }

        const data = await response.json();
        setValues((prev) => ({
          ...prev,
          summary: data.summary,
          terms: data.terms,
          notes: data.notes
        }));
        setItems(data.items ?? []);
        setSuccess("Borrador generado con IA");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error generando con IA");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Título</label>
            <input
              value={values.title}
              onChange={(event) => setValues({ ...values, title: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Ej. Remodelación local"
            />
          </div>
          <ClientPicker
            clients={clients}
            value={values.clientId ?? undefined}
            onChange={(clientId) => setValues({ ...values, clientId: clientId || undefined })}
          />
          <TemplatePicker
            templates={templates.map((template) => ({
              id: template.id,
              name: template.name,
              category: template.category ?? ""
            }))}
            value={values.templateId ?? undefined}
            onChange={(templateId) => setValues({ ...values, templateId: templateId || undefined })}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700">Resumen</label>
            <textarea
              value={values.summary}
              onChange={(event) => setValues({ ...values, summary: event.target.value })}
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Brief para IA</label>
          <textarea
            value={aiBrief}
            onChange={(event) => setAiBrief(event.target.value)}
            rows={6}
            className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={generateWithAI}
            className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            disabled={isGenerating}
          >
            {isGenerating ? "Generando..." : "Generar con IA"}
          </button>
          <div className="rounded-lg bg-white p-4 text-sm text-slate-600 shadow-card">
            <p className="font-semibold text-slate-800">Tips</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Incluye contexto (ubicación, plazos, alcance).</li>
              <li>Agrega materiales o servicios relevantes.</li>
              <li>La cotización siempre se puede editar manualmente.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Ítems</h3>
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Agregar ítem
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card md:grid-cols-12">
              <div className="md:col-span-5">
                <label className="text-xs font-semibold text-slate-500">Descripción</label>
                <input
                  value={item.description}
                  onChange={(event) => updateItem(index, "description", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500">Cantidad</label>
                <input
                  type="number"
                  value={item.quantity}
                  min={0}
                  step="0.1"
                  onChange={(event) => updateItem(index, "quantity", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500">Unidad</label>
                <input
                  value={item.unit ?? ""}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, unit: event.target.value } : row
                      )
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-500">Precio unitario</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  min={0}
                  step="0.1"
                  onChange={(event) => updateItem(index, "unitPrice", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-end justify-between md:col-span-1">
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.quantity * item.unitPrice, values.currency)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Términos</label>
          <textarea
            value={values.terms}
            onChange={(event) => setValues({ ...values, terms: event.target.value })}
            rows={6}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Notas</label>
          <textarea
            value={values.notes}
            onChange={(event) => setValues({ ...values, notes: event.target.value })}
            rows={6}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <div className="rounded-lg bg-white p-4 shadow-card">
            <h4 className="text-sm font-semibold text-slate-700">Totales</h4>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium">{formatCurrency(totals.subtotal, values.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Impuestos</dt>
                <dd className="font-medium">{formatCurrency(totals.tax, values.currency)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold text-slate-900">
                <dt>Total</dt>
                <dd>{formatCurrency(totals.total, values.currency)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? "Guardando..." : "Guardar cotización"}
        </button>
      </div>
    </form>
  );
}
