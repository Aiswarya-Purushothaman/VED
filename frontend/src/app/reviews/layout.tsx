import type { Metadata } from "next";
import { reviews } from "@/data/reviews";

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

const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Virtual Events and Decorations",
  "@id": "https://virtualeventsanddecorations.in",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: String(reviews.length),
    bestRating: "5",
    worstRating: "1",
  },
  review: reviews.slice(0, 5).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5", worstRating: "1" },
    reviewBody: r.text,
    datePublished: r.date,
  })),
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }} />
      {children}
    </>
  );
}
