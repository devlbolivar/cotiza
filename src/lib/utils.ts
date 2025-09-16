import { formatDistanceToNow, addHours } from "date-fns";
import { es } from "date-fns/locale";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { QuoteStatus } from "@prisma/client";

export type QuoteItemInput = {
  description: string;
  quantity: number;
  unit?: string | null;
  unitPrice: number;
};

export function cn(...inputs: Array<string | undefined | null | false>): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "CLP"): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency }).format(value ?? 0);
}

export function calculateTotals(items: QuoteItemInput[]): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const tax = 0;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function generatePublicSlug(reference?: string): string {
  const base = reference?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "quote";
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomSuffix}`;
}

export function quoteStatusLabel(status: QuoteStatus): string {
  switch (status) {
    case QuoteStatus.SENT:
      return "Enviada";
    case QuoteStatus.VIEWED:
      return "Vista";
    case QuoteStatus.APPROVED:
      return "Aprobada";
    case QuoteStatus.REJECTED:
      return "Rechazada";
    case QuoteStatus.CHANGES_REQUESTED:
      return "Con cambios";
    case QuoteStatus.EXPIRED:
      return "Expirada";
    default:
      return "Borrador";
  }
}

export function quoteStatusBadge(status: QuoteStatus): string {
  const map: Record<QuoteStatus, string> = {
    [QuoteStatus.DRAFT]: "bg-slate-100 text-slate-600",
    [QuoteStatus.SENT]: "bg-blue-100 text-blue-600",
    [QuoteStatus.VIEWED]: "bg-violet-100 text-violet-600",
    [QuoteStatus.APPROVED]: "bg-emerald-100 text-emerald-600",
    [QuoteStatus.REJECTED]: "bg-rose-100 text-rose-600",
    [QuoteStatus.CHANGES_REQUESTED]: "bg-amber-100 text-amber-600",
    [QuoteStatus.EXPIRED]: "bg-slate-200 text-slate-700"
  };
  return map[status] ?? map[QuoteStatus.DRAFT];
}

export function relativeTime(date?: Date | string | null): string {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export function getReminderSchedule(sentAt: Date): Array<{ label: string; runAt: Date }> {
  return [24, 72].map((hours) => ({
    label: `${hours}h`,
    runAt: addHours(sentAt, hours)
  }));
}

export function createWhatsappLink(phone: string, message: string): string {
  const normalized = phone.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encodedMessage}`;
}
