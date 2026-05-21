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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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