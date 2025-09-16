import { describe, expect, it } from "vitest";
import {
  calculateTotals,
  createWhatsappLink,
  formatCurrency,
  generatePublicSlug
} from "@/lib/utils";

describe("utils", () => {
  it("calculates totals correctly", () => {
    const totals = calculateTotals([
      { description: "A", quantity: 2, unitPrice: 10 },
      { description: "B", quantity: 1, unitPrice: 5 }
    ]);

    expect(totals).toEqual({ subtotal: 25, tax: 0, total: 25 });
  });

  it("generates unique public slugs", () => {
    const slugA = generatePublicSlug("Q-1");
    const slugB = generatePublicSlug("Q-1");

    expect(slugA).not.toEqual(slugB);
    expect(slugA).toMatch(/^q-1-/);
  });

  it("builds whatsapp links", () => {
    const link = createWhatsappLink("+56 9 1234 5678", "Hola mundo");
    expect(link).toContain("https://wa.me/56912345678");
    expect(link).toContain("Hola%20mundo");
  });

  it("formats currency in CLP by default", () => {
    expect(formatCurrency(1000)).toContain("$\u00a01.000");
  });
});
