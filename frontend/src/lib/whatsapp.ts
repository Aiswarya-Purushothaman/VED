export const WHATSAPP_NUMBER = "918884447579";

export function buildWhatsAppURL(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message)
    return `${base}?text=Hi!%20I%27d%20like%20to%20enquire%20about%20your%20decoration%20services.`;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildServiceEnquiryURL(serviceName: string): string {
  return buildWhatsAppURL(
    `Hi! I'm interested in "${serviceName}" decorations. Could you please share more details and pricing?`
  );
}

export function buildContactFormURL(
  name: string,
  service: string,
  date: string,
  phone: string
): string {
  return buildWhatsAppURL(
    `Hi! My name is ${name}. I need ${service} on ${date}. My contact number is ${phone}. Please reach out!`
  );
}
