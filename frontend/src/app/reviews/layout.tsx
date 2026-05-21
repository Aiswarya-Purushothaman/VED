import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials | Virtual Events and Decorations",
  description:
    "Read 500+ five-star reviews from happy clients across Bengaluru. See why we're the most trusted event decoration service in the city.",
  keywords: [
    "decoration service reviews Bengaluru",
    "event decoration testimonials",
    "Virtual Events and Decorations reviews",
    "best decorator Bengaluru",
  ],
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Client Reviews | Virtual Events and Decorations",
    description: "500+ five-star reviews from happy clients. Bengaluru's most trusted decoration service.",
    type: "website",
    url: "https://virtualeventsanddecorations.in/reviews",
    images: [{ url: "/hero-wedding-mandap.jpg", width: 1200, height: 630, alt: "Customer Reviews – Virtual Events and Decorations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Reviews | Virtual Events and Decorations",
    description: "500+ five-star reviews from happy clients in Bengaluru.",
    images: ["/hero-wedding-mandap.jpg"],
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
