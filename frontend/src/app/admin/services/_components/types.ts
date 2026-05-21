export interface PkgForm {
  planType: "basic" | "premium" | "luxury";
  name: string;
  description: string;
  items: string[];
  price: string;
}

export interface ServiceForm {
  name: string;
  slug: string;
  emoji: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  included: string[];
  packages: PkgForm[];
  addons: string[];
}
