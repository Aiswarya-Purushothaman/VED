import { notFound } from "next/navigation";
import { servicesApi } from "@/lib/api";
import type { Service, ServiceSummary } from "@/lib/api";
import { buildServiceEnquiryURL } from "@/lib/whatsapp";
import CTABanner from "@/components/home/CTABanner";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ServiceAnimatedBody from "@/components/services/ServiceAnimatedBody";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const service = await servicesApi.get(params.slug);
    return {
      title: service.name,
      description: service.shortDesc,
      alternates: { canonical: `/services/${service.slug}` },
      openGraph: {
        title: `${service.name} | Virtual Events and Decorations`,
        description: service.shortDesc,
        type: "website",
        url: `https://virtualeventsanddecorations.in/services/${service.slug}`,
        images: [{ url: service.image, width: 1200, height: 630, alt: service.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${service.name} | Virtual Events and Decorations`,
        description: service.shortDesc,
        images: [service.image],
      },
    };
  } catch {
    return {};
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  let service: Service;
  let related: ServiceSummary[] = [];

  try {
    service = await servicesApi.get(params.slug);
    const categoryServices = await servicesApi.list(service.category);
    related = categoryServices.filter((s) => s.id !== service.id).slice(0, 3);
  } catch {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://virtualeventsanddecorations.in" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://virtualeventsanddecorations.in/services" },
      { "@type": "ListItem", position: 3, name: service!.name, item: `https://virtualeventsanddecorations.in/services/${service!.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service!.name,
    description: service!.shortDesc,
    provider: {
      "@type": "LocalBusiness",
      name: "Virtual Events and Decorations",
      telephone: "+918884447579",
    },
    areaServed: { "@type": "City", name: "Bengaluru" },
    url: `https://virtualeventsanddecorations.in/services/${service!.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServiceHeroSection
        name={service!.name}
        image={service!.image}
        whatsappUrl={buildServiceEnquiryURL(service!.name)}
      />

      <ServiceAnimatedBody service={service!} related={related} />

      <CTABanner />
    </>
  );
}
