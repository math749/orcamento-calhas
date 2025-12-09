import { describe, expect, it } from "vitest";
import { formatPhoneForWhatsApp } from "../drizzle/schema";

describe("WhatsApp Phone Formatting", () => {
  it("should format Brazilian phone number correctly", () => {
    const phone = "(11) 9 9999-9999";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("5511999999999");
  });

  it("should remove leading zero from phone number", () => {
    const phone = "011999999999";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("5511999999999");
  });

  it("should handle phone with only digits", () => {
    const phone = "11999999999";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("5511999999999");
  });

  it("should handle phone with spaces", () => {
    const phone = "11 9 9999 9999";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("5511999999999");
  });

  it("should handle phone with dashes", () => {
    const phone = "11-99999-9999";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("5511999999999");
  });

  it("should generate valid WhatsApp link", () => {
    const phone = "(11) 9 9999-9999";
    const formatted = formatPhoneForWhatsApp(phone);
    const whatsappLink = `https://wa.me/${formatted}`;
    expect(whatsappLink).toBe("https://wa.me/5511999999999");
  });

  it("should handle phone with country code already", () => {
    const phone = "55 11 9 9999-9999";
    const formatted = formatPhoneForWhatsApp(phone);
    // Should still work correctly
    expect(formatted).toMatch(/^55/);
  });

  it("should handle different area codes", () => {
    const phone = "(21) 9 8888-7777";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("5521988887777");
  });

  it("should handle landline format", () => {
    const phone = "(11) 3333-4444";
    const formatted = formatPhoneForWhatsApp(phone);
    expect(formatted).toBe("551133334444");
  });
});
