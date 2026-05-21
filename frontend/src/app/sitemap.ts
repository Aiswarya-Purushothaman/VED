import type { MetadataRoute } from "next";
import { servicesApi } from "@/lib/api";

const BASE = "https://virtualeventsanddecorations.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await servicesApi.list();
    servicePages = services.map((s) => ({
      url: `${BASE}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    }));
  } catch {
    // If backend is unreachable at build time, omit service pages from sitemap
  }

  return [...staticPages, ...servicePages];
}
