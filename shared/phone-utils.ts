/**
 * Utilities for phone number formatting and WhatsApp integration
 * Handles Brazilian phone numbers (10 or 11 digits)
 */

export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Remove country code 55 if present
  let normalized = cleaned;
  if (normalized.startsWith('55')) {
    normalized = normalized.slice(2);
  }
  
  // Validate: must be 10 or 11 digits (Brazilian format)
  if (!/^\d{10,11}$/.test(normalized)) {
    return '';
  }
  
  return normalized;
}

export function formatPhoneForWhatsApp(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '';
  
  // WhatsApp format: country code + number (no + symbol in URL)
  return `55${normalized}`;
}

export function generateWhatsAppLink(phone: string, message?: string): string {
  const whatsappPhone = formatPhoneForWhatsApp(phone);
  if (!whatsappPhone) return '';
  
  const baseUrl = `https://wa.me/${whatsappPhone}`;
  
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  }
  
  return baseUrl;
}

export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return normalized.length === 10 || normalized.length === 11;
}

export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return phone;
  
  // Format as (XX) 9XXXX-XXXX or (XX) XXXX-XXXX
  if (normalized.length === 11) {
    return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 7)}-${normalized.slice(7)}`;
  }
  
  return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 6)}-${normalized.slice(6)}`;
}
