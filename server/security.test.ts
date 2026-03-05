import { describe, expect, it } from "vitest";
import { normalizePhoneNumber, formatPhoneForWhatsApp, isValidPhoneNumber, generateWhatsAppLink } from "../shared/phone-utils";
import { escapeHtml, sanitizeForHtml } from "../shared/html-utils";

describe("Security - Phone Utils", () => {
  describe("normalizePhoneNumber", () => {
    it("should remove non-digits", () => {
      expect(normalizePhoneNumber("(11) 99999-8888")).toBe("11999998888");
    });

    it("should remove country code 55 if present", () => {
      expect(normalizePhoneNumber("5511999998888")).toBe("11999998888");
    });

    it("should handle already normalized numbers", () => {
      expect(normalizePhoneNumber("11999998888")).toBe("11999998888");
    });

    it("should return empty string for invalid numbers", () => {
      expect(normalizePhoneNumber("123")).toBe("");
      expect(normalizePhoneNumber("abc")).toBe("");
    });

    it("should handle numbers with multiple 55 prefixes", () => {
      // Multiple 55 prefixes result in too many digits, so returns empty
      expect(normalizePhoneNumber("555511999998888")).toBe("");
    });
  });

  describe("formatPhoneForWhatsApp", () => {
    it("should format valid 11-digit number", () => {
      expect(formatPhoneForWhatsApp("11999998888")).toBe("5511999998888");
    });

    it("should format valid 10-digit number", () => {
      expect(formatPhoneForWhatsApp("1133334444")).toBe("551133334444");
    });

    it("should handle formatted input", () => {
      expect(formatPhoneForWhatsApp("(11) 99999-8888")).toBe("5511999998888");
    });

    it("should not duplicate 55 prefix", () => {
      expect(formatPhoneForWhatsApp("5511999998888")).toBe("5511999998888");
    });

    it("should return empty string for invalid input", () => {
      expect(formatPhoneForWhatsApp("123")).toBe("");
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should validate 11-digit numbers", () => {
      expect(isValidPhoneNumber("11999998888")).toBe(true);
    });

    it("should validate 10-digit numbers", () => {
      expect(isValidPhoneNumber("1133334444")).toBe(true);
    });

    it("should reject invalid lengths", () => {
      expect(isValidPhoneNumber("123")).toBe(false);
      expect(isValidPhoneNumber("123456789012")).toBe(false);
    });

    it("should handle formatted input", () => {
      expect(isValidPhoneNumber("(11) 99999-8888")).toBe(true);
    });
  });

  describe("generateWhatsAppLink", () => {
    it("should generate valid WhatsApp link", () => {
      const link = generateWhatsAppLink("11999998888");
      expect(link).toBe("https://wa.me/5511999998888");
    });

    it("should include message if provided", () => {
      const link = generateWhatsAppLink("11999998888", "Olá!");
      expect(link).toContain("https://wa.me/5511999998888");
      expect(link).toContain("text=");
    });

    it("should return empty string for invalid phone", () => {
      expect(generateWhatsAppLink("123")).toBe("");
    });
  });
});

describe("Security - HTML Utils", () => {
  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#39;xss&#39;)&lt;&#x2F;script&gt;"
      );
    });

    it("should escape ampersand", () => {
      expect(escapeHtml("A & B")).toBe("A &amp; B");
    });

    it("should escape quotes", () => {
      expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
    });

    it("should handle empty strings", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("should not escape safe characters", () => {
      expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
    });

    it("should prevent XSS via img tag", () => {
      const malicious = '<img src=x onerror="alert(\'xss\')">';
      const escaped = escapeHtml(malicious);
      // The onerror attribute is escaped, so it's safe
      expect(escaped).toContain("&lt;img");
      expect(escaped).toContain("&quot;"); // Quotes are escaped
      expect(escaped).not.toContain("<img"); // Original tag is escaped
    });
  });

  describe("sanitizeForHtml", () => {
    it("should handle null and undefined", () => {
      expect(sanitizeForHtml(null)).toBe("");
      expect(sanitizeForHtml(undefined)).toBe("");
    });

    it("should escape HTML in strings", () => {
      expect(sanitizeForHtml("<b>bold</b>")).toBe("&lt;b&gt;bold&lt;&#x2F;b&gt;");
    });
  });
});
