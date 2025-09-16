import type { Quote, Client } from "@prisma/client";
import { format } from "date-fns";

export type QuoteEmailContext = {
  quote: Quote;
  client?: Client | null;
  publicUrl: string;
};

export interface MailProvider {
  sendQuoteEmail(context: QuoteEmailContext): Promise<void>;
  sendReminderEmail(context: QuoteEmailContext & { reminderLabel: string }): Promise<void>;
}

class FakeMailProvider implements MailProvider {
  async sendQuoteEmail(context: QuoteEmailContext): Promise<void> {
    console.log("[mail:faked] Sending quote email", buildQuoteEmail(context));
  }

  async sendReminderEmail(context: QuoteEmailContext & { reminderLabel: string }): Promise<void> {
    console.log("[mail:faked] Sending reminder", context.reminderLabel, buildQuoteEmail(context));
  }
}

// TODO: add real SMTP provider integration (Resend, Postmark, etc.)

function buildQuoteEmail(context: QuoteEmailContext): { subject: string; body: string } {
  const subject = `Cotización ${context.quote.reference}`;
  const expires = context.quote.expiresAt
    ? format(context.quote.expiresAt, "dd/MM/yyyy")
    : "sin fecha límite";

  const body = `Hola ${context.client?.name ?? ""},\n\n` +
    `Te compartimos la cotización ${context.quote.reference}.\n` +
    `Total: ${context.quote.total.toString()} ${context.quote.currency}.\n` +
    `Válida hasta: ${expires}.\n\n` +
    `Revisa y responde en ${context.publicUrl}`;

  return { subject, body };
}

export function getMailProvider(): MailProvider {
  const provider = process.env.MAIL_PROVIDER ?? "fake";
  if (provider === "fake") {
    return new FakeMailProvider();
  }

  return new FakeMailProvider();
}
