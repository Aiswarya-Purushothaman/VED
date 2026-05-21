import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, DM_Sans, Cinzel } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SiteShell from "@/components/layout/SiteShell";

const LoadingScreen  = dynamic(() => import("@/components/ui/LoadingScreen"),  { ssr: false });
const CustomCursor   = dynamic(() => import("@/components/ui/CustomCursor"),   { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600"],
  display: "swap",
});

const SITE_URL = "https://virtualeventsanddecorations.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Virtual Events and Decorations | We Turn Your Moments Into Memories",
    template: "%s | Virtual Events and Decorations",
  },
  description:
    "Professional decoration services for birthdays, weddings, anniversaries, baby showers, corporate events & more in Bengaluru. Call 8884447579 or WhatsApp for enquiries.",
  keywords: [
    "event decoration Bengaluru",
    "balloon decoration",
    "birthday decor Bengaluru",
    "wedding decoration Bengaluru",
    "anniversary decoration",
    "baby shower decoration",
    "corporate event decoration",
    "candlelight dinner setup",
    "proposal decoration",
  ],
  authors: [{ name: "Virtual Events and Decorations" }],
  creator: "Virtual Events and Decorations",
  publisher: "Virtual Events and Decorations",
  formatDetection: { telephone: true, email: true, address: true },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Virtual Events and Decorations | We Turn Your Moments Into Memories",
    description: "We Turn Your Moments Into Memories. Premium decoration services across Bengaluru.",
    type: "website",
    url: SITE_URL,
    siteName: "Virtual Events and Decorations",
    locale: "en_IN",
    images: [
      {
        url: "/hero-wedding-mandap.jpg",
        width: 1200,
        height: 630,
        alt: "Virtual Events and Decorations – Premium Event Decor in Bengaluru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Events and Decorations | We Turn Your Moments Into Memories",
    description: "Premium decoration services for birthdays, weddings, anniversaries & more in Bengaluru.",
    images: ["/hero-wedding-mandap.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable} ${cinzel.variable} antialiased bg-dark`}>
        <LoadingScreen />
        <ScrollProgress />
        <CustomCursor />
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
