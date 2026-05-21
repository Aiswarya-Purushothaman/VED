"use client";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock, ExternalLink, ArrowUpRight } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import { motion, useReducedMotion } from "framer-motion";
import { buildWhatsAppURL } from "@/lib/whatsapp";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BREEZE = "#92ADA4";

/* ── Data ─────────────────────────────────────────── */
const ADDRESS  = "23rd Main Rd, JC Nagar, Kurubarahalli, Nandini Layout, Bengaluru, Karnataka 560086";
const MAPS_URL = "https://www.google.com/maps/place/Virtual+Events+and+decorations/@13.0123559,77.5303386,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3de6d16c5b93:0x57209a40c18bc166!8m2!3d13.0123559!4d77.5303386!16s%2Fg%2F11kmyrskhg";
const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3!2d77.5303386!3d13.0123559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3de6d16c5b93%3A0x57209a40c18bc166!2sVirtual%20Events%20and%20decorations!5e0!3m2!1sen!2sin!4v1";

const quickLinks: [string, string][] = [
  ["/", "Home"], ["/services", "Services"], ["/gallery", "Gallery"],
  ["/reviews", "Reviews"], ["/about", "About Us"], ["/contact", "Contact"],
];

const serviceLinks = [
  { label: "Birthday Decorations",  slug: "birthday-decorations" },
  { label: "Wedding Decorations",   slug: "wedding-decorations" },
  { label: "Anniversary Setups",    slug: "anniversary-decorations" },
  { label: "Baby Showers",          slug: "baby-shower" },
  { label: "Corporate Events",      slug: "corporate-events" },
  { label: "Candlelight Dinners",   slug: "candlelight-dinner" },
  { label: "Premium Luxury Decor",  slug: "premium-decorations" },
  { label: "Proposal Setups",       slug: "proposal-setup" },
];

/* ── Footer column heading ────────────────────────── */
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-4 h-px" style={{ background: TUSCAN }} />
      <h3
        className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-semibold"
        style={{ color: SADDLE }}
      >
        {children}
      </h3>
    </div>
  );
}

/* ── Animated link item ───────────────────────────── */
function FooterLink({ href, children, external = false }: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const base = "group flex items-center gap-1.5 font-dm text-sm transition-colors duration-200";
  const inner = (
    <>
      <span
        className="w-0 h-px transition-all duration-300 group-hover:w-3 rounded-full opacity-0 group-hover:opacity-100"
        style={{ background: TUSCAN }}
      />
      <span className="transition-colors duration-200" style={{ color: `${SADDLE}BB` }}>
        {children}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {inner}
    </Link>
  );
}

/* ── Main component ───────────────────────────────── */
export default function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #E0F5F5 0%, #C8EEEE 100%)" }}
    >
      {/* ── Gradient rules ── */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${TUSCAN}50, transparent)` }} />

      {/* ── Ambient glow ── */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: TUSCAN }} />
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ background: BREEZE }} />

      {/* ════════════════════════════════════════════
          MAP STRIP
      ════════════════════════════════════════════ */}
      <div className="container-max px-4 md:px-6 pt-12 pb-0 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-px" style={{ background: TUSCAN }} />
            <MapPin size={13} style={{ color: TUSCAN }} className="flex-shrink-0" />
            <h3
              className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-semibold"
              style={{ color: SADDLE }}
            >
              Find Us
            </h3>
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-cinzel text-[8px] sm:text-[9px] tracking-[0.25em] uppercase transition-all duration-200 group"
            style={{ color: SADDLE }}
          >
            Open in Maps
            <ArrowUpRight
              size={11}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: TUSCAN }}
            />
          </a>
        </div>

        {/* Map iframe */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            height: 220,
            border: `1px solid ${TUSCAN}28`,
            boxShadow: `0 4px 24px ${TUSCAN}12`,
          }}
        >
          <iframe
            src={MAPS_EMBED}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "sepia(15%) saturate(90%) hue-rotate(5deg) brightness(1.05)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Virtual Events and Decorations location"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: `inset 0 0 0 1px ${TUSCAN}20` }} />
        </motion.div>

        {/* Address */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-start gap-2 group transition-all duration-200"
        >
          <MapPin size={12} className="flex-shrink-0 mt-0.5" style={{ color: TUSCAN }} />
          <span
            className="font-dm text-xs leading-relaxed transition-colors duration-200"
            style={{ color: `${SADDLE}99` }}
          >
            {ADDRESS}
          </span>
        </a>
      </div>

      {/* ════════════════════════════════════════════
          LINK COLUMNS
      ════════════════════════════════════════════ */}
      <div className="container-max px-4 md:px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* ── Brand ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-2 md:col-span-1"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <LogoMark size={36} />
              <div>
                <div
                  className="font-playfair font-bold text-base leading-tight"
                  style={{ color: SADDLE }}
                >
                  Virtual Events
                </div>
                <div
                  className="font-cinzel text-[8px] tracking-[0.3em] uppercase"
                  style={{ color: `${SADDLE}80` }}
                >
                  &amp; Decorations
                </div>
              </div>
            </div>

            <p
              className="font-dm text-sm leading-relaxed mb-5"
              style={{ color: `${SADDLE}90` }}
            >
              We Turn Your Moments Into Memories. Professional decoration services for all occasions in Bengaluru.
            </p>

            {/* Contact pills */}
            <div className="flex flex-col gap-2">
              <a
                href="tel:8884447579"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-dm text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: `${TUSCAN}15`,
                  border: `1px solid ${TUSCAN}30`,
                  color: SADDLE,
                }}
              >
                <Phone size={12} style={{ color: TUSCAN }} />
                8884447579
              </a>

              <a
                href={buildWhatsAppURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-dm text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.25)",
                  color: "#1a9d50",
                }}
              >
                <MessageCircle size={12} style={{ color: "#25D366" }} />
                WhatsApp Us
              </a>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-dm text-xs"
                style={{
                  background: `${BREEZE}15`,
                  border: `1px solid ${BREEZE}30`,
                  color: `${SADDLE}90`,
                }}
              >
                <Clock size={12} style={{ color: BREEZE }} />
                9 AM – 9 PM, Daily
              </div>
            </div>
          </motion.div>

          {/* ── Quick Links ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ColHeading>Quick Links</ColHeading>
            <ul className="space-y-2.5">
              {quickLinks.map(([href, label]) => (
                <li key={href}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Services ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.14, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ColHeading>Our Services</ColHeading>
            <ul className="space-y-2.5">
              {serviceLinks.map(({ label, slug }) => (
                <li key={slug}>
                  <FooterLink href={`/services/${slug}`}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Location ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ColHeading>Visit Us</ColHeading>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 transition-colors duration-200 mb-5"
            >
              <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: TUSCAN }} />
              <span className="font-dm text-sm leading-relaxed" style={{ color: `${SADDLE}90` }}>
                {ADDRESS}
              </span>
            </a>

            {/* Open in maps button */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-cinzel text-[9px] tracking-[0.3em] uppercase transition-all duration-200 group"
              style={{ color: SADDLE }}
            >
              <ExternalLink size={11} style={{ color: TUSCAN }} />
              Open in Google Maps
            </a>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${TUSCAN}20` }}
        >
          <p
            className="font-dm text-xs text-center sm:text-left"
            style={{ color: `${SADDLE}70` }}
          >
            © 2019 Virtual Events and Decorations. All Rights Reserved.
          </p>
          <p
            className="font-cinzel text-[8px] tracking-[0.3em] uppercase"
            style={{ color: `${SADDLE}55` }}
          >
            Crafted for unforgettable celebrations
          </p>
        </div>
      </div>
    </footer>
  );
}
