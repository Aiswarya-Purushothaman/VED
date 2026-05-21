# Virtual Events and Decorations — Project Documentation

---

## Business Identity

| Field | Details |
|---|---|
| **Name** | Virtual Events and Decorations |
| **Package name** | `ved-app` (v0.1.0) |
| **Tagline** | "We Turn Your Moments Into Memories" |
| **Type** | Premium event decoration service |
| **Location** | 23rd Main Rd, JC Nagar, Kurubarahalli, Nandini Layout, Bengaluru, Karnataka 560086 |
| **Phone** | 8884447579 |
| **WhatsApp** | +91 8884447579 |
| **Hours** | 9 AM – 9 PM, 7 days a week |
| **Credentials** | 500+ events, 8+ years experience, 5-star Google rating |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.35 (App Router) |
| Language | TypeScript 5 |
| UI | React 18 |
| Styling | Tailwind CSS 3.4.1 |
| Animations | Framer Motion 12.38.0 |
| Icons | Lucide React 1.8.0 |
| Carousel | Swiper 12.1.3 |
| Utilities | clsx 2.1.1, tailwind-merge 3.5.0 |
| Linting | ESLint 8 + eslint-config-next |

### Fonts (Google Fonts)

| Font | Style | Usage |
|---|---|---|
| Playfair Display | Serif | Headings / display text |
| Cormorant Garamond | Serif | Luxury accent display |
| Cinzel | Serif | Decorative uppercase labels |
| DM Sans | Sans-serif | Body / UI text |

---

## Project Structure

```
/VED
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout: fonts, Navbar, Footer, FABs, metadata
│   │   ├── globals.css             ← Tailwind directives + all custom CSS classes
│   │   ├── page.tsx                ← Home page (composes all home components)
│   │   ├── services/
│   │   │   ├── layout.tsx          ← SEO metadata for /services
│   │   │   ├── page.tsx            ← Services listing: category filters + pagination
│   │   │   └── [slug]/
│   │   │       └── page.tsx        ← Dynamic service detail (statically generated)
│   │   ├── gallery/
│   │   │   ├── layout.tsx          ← SEO metadata for /gallery
│   │   │   └── page.tsx            ← Gallery grid with filter + lightbox
│   │   ├── reviews/
│   │   │   ├── layout.tsx          ← SEO metadata for /reviews
│   │   │   └── page.tsx            ← Review listing with star filter + load-more
│   │   ├── about/
│   │   │   ├── layout.tsx          ← SEO metadata for /about
│   │   │   └── page.tsx            ← Story, mission/vision, team, achievements
│   │   └── contact/
│   │       ├── layout.tsx          ← SEO metadata for /contact
│   │       └── page.tsx            ← Contact form + map + phone/WhatsApp links
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          ← Responsive navbar, transparent scroll effect
│   │   │   ├── Footer.tsx          ← 4-column footer, embedded map, contact info
│   │   │   ├── WhatsAppFAB.tsx     ← Floating WhatsApp button (bottom-right)
│   │   │   └── CallFAB.tsx         ← Floating Call button (above WhatsApp)
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx      ← Full-screen 4-slide auto-carousel
│   │   │   ├── MarqueeTicker.tsx   ← Infinite scrolling service name ticker
│   │   │   ├── StatsBar.tsx        ← Animated counters (500+, 5★, 8+, 100%)
│   │   │   ├── ServicesGrid.tsx    ← Service cards grid (supports limit prop)
│   │   │   ├── HowItWorks.tsx      ← 3-step process visualization
│   │   │   ├── GalleryStrip.tsx    ← Featured 8-image gallery with lightbox
│   │   │   ├── ReviewsCarousel.tsx ← 3-card paginated review carousel
│   │   │   ├── WhyChooseUs.tsx     ← 6 feature cards (glass card style)
│   │   │   └── CTABanner.tsx       ← Dark gradient CTA with Call + WhatsApp buttons
│   │   ├── gallery/                ← Reserved for future gallery components
│   │   ├── reviews/                ← Reserved for future review components
│   │   ├── services/               ← Reserved for future service components
│   │   └── ui/                     ← Reserved for shared UI primitives
│   ├── data/
│   │   ├── services.ts             ← 42 services + 11 categories + 12 gallery images
│   │   └── reviews.ts              ← 20 five-star client testimonials
│   ├── lib/
│   │   └── whatsapp.ts             ← WhatsApp URL builder utilities
│   └── types/
│       └── css.d.ts                ← TypeScript CSS module declarations
├── public/
│   ├── founder.jpg                 ← Kiran Kumar (founder photo, used on About page)
│   └── icon.svg                    ← Logo / favicon
├── next.config.mjs                 ← Allows images from images.unsplash.com
├── tailwind.config.ts              ← Colors, fonts, keyframes
├── tsconfig.json                   ← Strict mode, @/* path alias
├── postcss.config.mjs              ← Tailwind PostCSS plugin
├── package.json                    ← Scripts: dev / build / start / lint
├── package-lock.json
├── .eslintrc.json                  ← next/core-web-vitals + next/typescript
├── .gitignore
└── README.md                       ← Default Create Next App readme (unchanged)
```

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — hero slider, ticker, stats, services (8 of 42), how-it-works, gallery strip, reviews, why-us, CTA |
| `/services` | All 42 services with 11-category filter tabs + 12-per-page pagination |
| `/services/[slug]` | Individual service: description, what's included, 3-tier packages, add-ons, related services |
| `/gallery` | Photo gallery with category filter + masonry column layout + lightbox |
| `/reviews` | All reviews with 5-star / 4-star filter + load-more (9 at a time) |
| `/about` | Story, mission, vision, team (Kiran Kumar), achievements |
| `/contact` | Contact form (submits via WhatsApp), phone + WhatsApp links, embedded Google Map |

---

## All 42 Services

### Birthday
- Birthday Decorations
- Kids Birthday Parties
- Milestone Birthday (30/40/50)
- First Birthday Photoshoot
- Surprise Birthday Party
- Princess / Prince Theme
- Unicorn Theme Party

### Wedding
- Wedding Decorations
- Mehndi Ceremony Decor
- Haldi Ceremony Decor
- Wedding Reception Decor
- Sangeet Night Decor
- Bridal Suite Decoration

### Anniversary & Romance
- Anniversary Setups
- Candlelight Dinner Setup
- Proposal Setups

### Baby & Kids
- Baby Shower Decorations
- Welcome Baby Decorations
- Naming Ceremony Decor
- Gender Reveal Party

### Special Occasions
- Engagement Ceremony
- Bachelorette Party
- Graduation Celebration
- Farewell Party Decor
- Retirement Party Decor
- House Warming Ceremony

### Corporate
- Corporate Events
- Product Launch Event
- Award Ceremony Setup
- Virtual Events

### Premium & Specialty
- Premium Luxury Decor
- Balloon Sculpture & Art
- Floral Wall Installation
- LED & Lighting Setup
- Photo Booth Setup
- Customised Decorations

### Outdoor & Social
- Outdoor Party Setup
- Pool Party Decoration
- Kitty Party Setup

### Festivals
- Festival Decorations
- Diwali Home Decoration
- Christmas & New Year Decor

Each service includes:
- Emoji, slug, short description, long description, Unsplash image
- `included[]` — checklist of everything covered
- **3 package tiers:** Basic / Premium (Popular) / Luxury
- `addons[]` — optional extras: photography, videography, catering, DJ, cakes, lighting, etc.

---

## Data Files

### `src/data/services.ts`
Exports:
- `services` — array of 42 `Service` objects
- `categories` — 11 filter label strings
- `galleryImages` — 12 image objects with URL, category, and alt text

### `src/data/reviews.ts`
Exports:
- `reviews` — 20 testimonials, all 5-star, dated April 2023 – March 2024
- Reviewer names: Priya Nair, Mohammed Shafiq, Anjali Krishnan, Rahul Menon, Sneha Thomas, and more

---

## TypeScript Interfaces

```ts
// services.ts
interface Package {
  name: string;
  description: string;
  items: string[];
}

interface Service {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  category: string;
  included: string[];
  packages: Package[];
  addons: string[];
}

// reviews.ts
interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
}
```

---

## Lib Utilities (`src/lib/whatsapp.ts`)

| Function | Purpose |
|---|---|
| `WHATSAPP_NUMBER` | Constant → `"918884447579"` |
| `buildWhatsAppURL(message?)` | Generic WhatsApp web link with optional pre-filled message |
| `buildServiceEnquiryURL(serviceName)` | Pre-fills "Hi! I'm interested in '[name]'..." |
| `buildContactFormURL(name, service, date, phone)` | Full contact form data encoded in WhatsApp message |

---

## Component Details

### Layout Components

**Navbar.tsx**
- Fixed header with transparent-to-solid scroll effect
- Links: Home, Services, Gallery, Reviews, About, Contact
- Mobile hamburger menu (toggled at `lg` breakpoint)
- Inline phone call button
- Dynamic text color based on scroll position

**Footer.tsx**
- 4-column layout: Company info / Quick links / Services links / Contact info
- Embedded Google Map with sepia filter
- Address, phone, WhatsApp, operating hours
- Copyright 2019 — "Made with love for unforgettable celebrations"

**WhatsAppFAB.tsx**
- Fixed bottom-right floating button
- Green `#25D366` background with `pulse2` animation
- Opens WhatsApp with pre-filled general enquiry

**CallFAB.tsx**
- Fixed bottom-right, positioned above WhatsApp FAB
- Primary pink `#E91E8C` background with `pulse-gold` animation
- Initiates call to 8884447579

---

### Home Page Components

**HeroSlider.tsx**
- Full-viewport height carousel, auto-advances every 5 seconds
- 4 slides: Birthday, Wedding, Anniversary & Romance, Baby Showers
- Each slide: Unsplash photo + dark gradient overlay + animated text
- Controls: left/right arrows, dot indicators with progress bars
- Slide transitions: 0.9s with custom cubic-bezier easing

**MarqueeTicker.tsx**
- Infinite 35s horizontal scroll with 14 service labels
- Services: Birthday, Wedding, Anniversary, Baby Showers, Corporate, Candlelight, Virtual Events, Festival, Bachelorette, Engagement, Kids Birthday, Premium Luxury, Proposal, Outdoor Party
- Cinzel font, uppercase, bullet separators

**StatsBar.tsx**
- 4 animated counters that trigger when scrolled into view
- 500+ Events Decorated | 5★ Google Rating | 8+ Years Experience | 100% Happy Clients
- Uses Intersection Observer API

**ServicesGrid.tsx**
- Responsive 4-column card grid (1→2→4 cols)
- Accepts `limit` prop (home page passes `8`, services page shows all)
- Cards: image with hover zoom, emoji, name, short description, "Explore →" link

**HowItWorks.tsx**
- 3-step process:
  1. Call or WhatsApp Us
  2. We Plan Your Setup
  3. We Decorate, You Celebrate
- Numbered badges with emoji icons

**GalleryStrip.tsx**
- 8 featured images in a CSS grid
- Hover opacity effect on each image
- Click opens lightbox with prev/next navigation and close button
- "View Full Gallery" link → `/gallery`

**ReviewsCarousel.tsx**
- Shows top 6 reviews in a 3-card paginated carousel
- Google "G" logo badge per card
- Star rating, reviewer name, date, review text
- Prev/Next controls + page dot indicators
- "See all reviews on Google" link

**WhyChooseUs.tsx**
- 6 glass-card feature tiles:
  - Customizable | Affordable | On-Time | 5-Star Rated | Photography Add-ons | Setup & Cleanup

**CTABanner.tsx**
- Dark `#1A1510` gradient background with magenta radial glows
- Heading: "Ready to Make Your Event Magical?" with gradient text accent
- Two CTAs: Call button + WhatsApp Us Now button
- Decorative border lines + circle outlines

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#E91E8C` | Buttons, borders, active states |
| `primary-light` | `#FF6EC7` | Hover states |
| `gold` / `accent` | `#C9A84C` | Decorative gold accents |
| `gold-light` | `#F0D080` | Soft gold tint |
| `dark` | `#FFF0F7` | Page background (blush white) |
| `dark-card` | `#FFEAF4` | Card background (soft blush) |
| `dark-mid` | `#FFD6EC` | Alternate section background |
| `light` | `#1A1510` | Primary text (warm near-black) |
| `text-muted` | `#8B5A7A` | Secondary text (muted mauve) |
| WhatsApp | `#25D366` | WhatsApp buttons only |

### Custom CSS Classes

| Class | Description |
|---|---|
| `.glass-card` | Frosted glass: `rgba(255,240,247,0.80)` + `blur(12px)` + pink border |
| `.btn-primary` | Pink pill button with hover brighten |
| `.btn-outline` | Pink bordered pill button with hover fill |
| `.btn-whatsapp` | Green pill button |
| `.section-padding` | `py-16 md:py-24 px-4 md:px-6` |
| `.container-max` | `max-w-7xl mx-auto` |
| `.section-heading` | Playfair Display, 3xl–5xl, bold |
| `.card-hover` | `hover:scale-[1.02]` transition |
| `.text-gradient-gold` | Gold → magenta → pink gradient text |
| `.glow-gold` | Pink drop-shadow glow |
| `.shadow-warm` | Soft warm shadow |
| `.animate-pulse-gold` | 2s scale + ring pulse animation |

### Animations

| Name | Duration | Description |
|---|---|---|
| `marquee` | 35s infinite | Horizontal scroll for ticker |
| `pulse2` | 2s infinite | Scale + green shadow (WhatsApp FAB) |
| `pulse-gold` | 2s infinite | Scale + pink shadow (Call FAB) |
| Framer Motion slides | 0.9s | Hero carousel with cubic-bezier easing |
| Framer Motion stagger | 0.04–0.1s delay | Card grid entrance animations |
| Stats counter | Viewport-triggered | Number count-up on scroll-into-view |

---

## Integrations & Special Features

### WhatsApp Integration
- All primary CTAs (hero, service pages, contact form, footer) route through WhatsApp
- Pre-filled messages per context (general, service-specific, full form data)
- 2-hour response guarantee mentioned throughout the site

### Phone Integration
- `tel:8884447579` links in navbar, footer, contact page, and Call FAB
- Call FAB persists across all pages

### Google Maps
- Embedded `<iframe>` in Footer and Contact page
- Custom CSS filter: sepia + hue-rotate to match brand colors
- Clickable map link opens Google Maps

### Unsplash Images
- All service and gallery images hosted on `images.unsplash.com`
- Configured in `next.config.mjs` as an allowed remote image hostname
- Uses Next.js `<Image>` component for optimization and lazy loading

### Static Generation
- All 42 `/services/[slug]` pages pre-built at build time via `generateStaticParams`
- Enables fast page loads with no server-side rendering overhead

---

## SEO & Metadata

- Root metadata: title, description, keywords (`event decoration`, `balloon decoration`, `birthday decor`, `wedding decoration`, `Bengaluru`), OpenGraph
- Each route has its own `layout.tsx` with page-specific metadata
- Dynamic service pages generate metadata from the service's name and description
- Favicon: `public/icon.svg` set as `icon`, `shortcut`, and `apple-touch-icon`

---

## Accessibility

- `aria-label` on all icon-only buttons (arrows, close, FABs)
- Minimum 44px touch target height on all interactive elements
- `alt` text on all `<Image>` components
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`
- `scroll-behavior: smooth` globally via CSS
- `-webkit-font-smoothing: antialiased` for crisp text rendering

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| Mobile `< 640px` | 1-column grids, hamburger nav, stacked buttons |
| Tablet `md: 768px` | 2-column grids, expanded spacing |
| Desktop `lg: 1024px` | 3–4 column grids, full navbar visible |
| Large `xl: 1280px` | Max-width container `7xl` constrains layout |

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Config Files Summary

| File | Purpose |
|---|---|
| `next.config.mjs` | Allows Unsplash as remote image source |
| `tailwind.config.ts` | Custom colors, font families, keyframe animations |
| `tsconfig.json` | Strict TypeScript, `@/*` path alias → `./src/*`, incremental builds |
| `postcss.config.mjs` | Tailwind CSS PostCSS plugin |
| `.eslintrc.json` | Extends `next/core-web-vitals` + `next/typescript` |

---

## Team

| Name | Role |
|---|---|
| Kiran Kumar | Lead Decorator & Founder |

Photo: `public/founder.jpg` — displayed on the About page.

---

## Public Assets

| File | Usage |
|---|---|
| `public/founder.jpg` | Founder photo on About page |
| `public/icon.svg` | Site logo and favicon |

All other images are loaded from `images.unsplash.com` at runtime via Next.js image optimization.

---

*Last updated: April 2026*
