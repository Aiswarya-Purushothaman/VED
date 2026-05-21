import type { ServiceForm } from "./types";

export const SADDLE = "#84572F";
export const TUSCAN = "#F1A805";

export const PLAN_COLORS: Record<string, string> = {
  basic: "#3B82F6",
  premium: TUSCAN,
  luxury: "#8B5CF6",
};

export const CATEGORIES = [
  "birthday", "wedding", "anniversary", "baby", "proposal",
  "candlelight", "premium", "corporate", "festivals", "special",
];

export const EMPTY_FORM: ServiceForm = {
  name: "", slug: "", emoji: "", category: "birthday",
  shortDesc: "", longDesc: "", image: "",
  included: [""],
  packages: [
    { planType: "basic",   name: "Basic",   description: "", items: [""], price: "" },
    { planType: "premium", name: "Premium", description: "", items: [""], price: "" },
    { planType: "luxury",  name: "Luxury",  description: "", items: [""], price: "" },
  ],
  addons: [""],
};

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
