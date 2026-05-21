import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Virtual Events and Decorations Bengaluru",
  description:
    "Get in touch with Virtual Events and Decorations. Call 8884447579, WhatsApp us, or visit us at 23rd Main Rd, JC Nagar, Nandini Layout, Bengaluru 560086.",
  keywords: [
    "contact decoration service Bengaluru",
    "event decorator contact",
    "book decoration Bengaluru",
    "WhatsApp decoration enquiry",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Virtual Events and Decorations",
    description: "Call 8884447579 or WhatsApp us. We reply within 2 hours. Located in Nandini Layout, Bengaluru.",
    type: "website",
    url: "https://virtualeventsanddecorations.in/contact",
    images: [{ url: "/hero-wedding-mandap.jpg", width: 1200, height: 630, alt: "Contact Virtual Events and Decorations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Virtual Events and Decorations",
    description: "Call 8884447579 or WhatsApp us. We reply within 2 hours.",
    images: ["/hero-wedding-mandap.jpg"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
