/**
 * HTML escaping utilities to prevent XSS attacks
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

export function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text).replace(/[&<>"'\/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

export function sanitizeForHtml(text: string | null | undefined): string {
  if (!text) return '';
  return escapeHtml(String(text));
}

export function sanitizeForAttribute(text: string | null | undefined): string {
  if (!text) return '';
  const sanitized = escapeHtml(String(text));
  // Additional escaping for attribute context
  return sanitized.replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');
}
