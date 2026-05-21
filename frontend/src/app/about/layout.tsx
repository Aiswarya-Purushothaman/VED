import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Virtual Events and Decorations Bengaluru",
  description:
    "Learn about Virtual Events and Decorations — Bengaluru's trusted decoration partner with 8+ years of experience, 500+ events decorated, and a 5-star Google rating.",
  keywords: [
    "about Virtual Events and Decorations",
    "decoration company Bengaluru",
    "event decorator Bengaluru",
    "decoration team Bengaluru",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Virtual Events and Decorations",
    description: "8+ years of experience, 500+ events, 5-star rating. Bengaluru's most loved decoration company.",
    type: "website",
    url: "https://virtualeventsanddecorations.in/about",
    images: [{ url: "/founder.jpg", width: 1200, height: 630, alt: "Virtual Events and Decorations Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Virtual Events and Decorations",
    description: "8+ years of experience, 500+ events, 5-star rating. Bengaluru's most loved decoration company.",
    images: ["/founder.jpg"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
