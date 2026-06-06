import HeroSlider from "@/components/home/HeroSlider";
import ServicesGrid from "@/components/home/ServicesGrid";
import WeddingStrip from "@/components/home/WeddingStrip";
import BirthdayStrip from "@/components/home/BirthdayStrip";
import OccasionCategories from "@/components/home/OccasionCategories";
import StatsBar from "@/components/home/StatsBar";
import SpecialOccasions from "@/components/home/SpecialOccasions";
import HowItWorks from "@/components/home/HowItWorks";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTABanner from "@/components/home/CTABanner";
import FeaturedEventBanner from "@/components/home/FeaturedEventBanner";
import PromotionBanner from "@/components/home/PromotionBanner";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Virtual Events and Decorations",
  url: "https://virtualeventsanddecorations.in",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://virtualeventsanddecorations.in/services?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is the best decoration service in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Virtual Events and Decorations is one of the top-rated decoration services in Bangalore (Bengaluru) with 500+ happy customers, specialising in birthdays, weddings, anniversaries, proposals, and candlelight dinners.",
      },
    },
    {
      "@type": "Question",
      name: "How much does event decoration cost in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Decoration packages in Bangalore start from ₹1,499 for simple balloon setups to ₹50,000+ for premium wedding and large event decorations. Contact us at 8884447579 for a free quote.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide decoration services at home in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Virtual Events and Decorations provides at-home decoration services across all areas of Bangalore/Bengaluru for birthdays, anniversaries, proposals, baby showers, and more.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a decoration in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book a decoration by calling or WhatsApp-ing us at 8884447579, or by filling the booking form on our website. We recommend booking at least 3–5 days in advance.",
      },
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Virtual Events and Decorations",
  image: "https://virtualeventsanddecorations.in/hero-wedding-mandap.jpg",
  "@id": "https://virtualeventsanddecorations.in",
  url: "https://virtualeventsanddecorations.in",
  telephone: "+918884447579",
  priceRange: "₹₹",
  description:
    "Premium event decoration services in Bengaluru for birthdays, weddings, anniversaries, baby showers, corporate events, candlelight dinners & proposals.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "23rd Main Rd, JC Nagar, Nandini Layout",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560086",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.0006,
    longitude: 77.5565,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/virtualeventsanddecorations",
    "https://www.facebook.com/virtualeventsanddecorations",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Decoration Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Birthday Decorations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding Decorations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Anniversary Decorations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Baby Shower Decorations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Candlelight Dinner Setup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Proposal Decorations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Event Decorations" } },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HeroSlider />
      {/* <MarqueeTicker /> */}
      <ServicesGrid limit={8} />
      <FeaturedEventBanner />

      <WeddingStrip />
      <BirthdayStrip />
      <OccasionCategories />
      <SpecialOccasions />
      <PromotionBanner />
      <StatsBar />
      <HowItWorks />
      {/* <GalleryStrip /> */}
      <ReviewsCarousel />
      <WhyChooseUs />
      <CTABanner />
    </>
  );
}