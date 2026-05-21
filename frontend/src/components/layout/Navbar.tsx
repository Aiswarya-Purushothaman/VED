"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoMark from "@/components/ui/LogoMark";
import { useAuth } from "@/context/AuthContext";
import { SADDLE, TUSCAN, BUTTER } from "@/lib/theme";
import UserDropdown from "./navbar/UserDropdown";
import MobileMenu from "./navbar/MobileMenu";

const navLinks = [
  { href: "/",         label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/reviews",  label: "Reviews" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname    = usePathname();
  const { user, isLoading, isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const linkCol = `${SADDLE}CC`;

  return (
    <>
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(237,250,250,0.82)" : "transparent",
        backdropFilter:       scrolled ? "blur(20px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottom: scrolled ? `1px solid ${TUSCAN}18` : "1px solid transparent",
        boxShadow:   scrolled ? `0 2px 24px ${TUSCAN}10` : "none",
      }}
    >
      {/* Scroll progress line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px] origin-left"
        style={{ background: `linear-gradient(to right, ${SADDLE}, ${TUSCAN}, ${BUTTER})` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="container-max px-4 md:px-6">
        <div className={`flex items-center justify-between transition-all duration-400 ${scrolled ? "h-16" : "h-16 md:h-20"}`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 45, scale: 1.08 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0"
            >
              <LogoMark size={34} />
            </motion.div>
            <div className="leading-tight">
              <div className="font-playfair font-bold text-sm md:text-base leading-none transition-colors duration-400" style={{ color: SADDLE }}>
                Virtual Events
              </div>
              <div className="font-cinzel text-[9px] tracking-[0.3em] uppercase transition-colors duration-400" style={{ color: `${SADDLE}80` }}>
                &amp; Decorations
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-dm text-[10px] tracking-[0.25em] uppercase pb-1 transition-colors duration-200"
                  style={{ color: active ? TUSCAN : linkCol }}
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 h-px rounded-full"
                    style={{ background: TUSCAN }}
                    initial={{ width: active ? "100%" : "0%" }}
                    animate={{ width: active ? "100%" : "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-2.5">
            {isLoading ? (
              /* Auth skeleton shimmer */
              <div className="hidden lg:flex items-center gap-2">
                <div
                  className="shimmer-light h-[44px] w-[88px] rounded-sm"
                  style={{ background: `${TUSCAN}15` }}
                />
              </div>
            ) : (
              <>
                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 font-dm text-[9px] tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 min-h-[44px]"
                    style={{ border: `1px solid ${TUSCAN}50`, color: SADDLE, background: `${TUSCAN}0A` }}
                  >
                    <LogIn size={12} style={{ color: TUSCAN }} />
                    Login
                  </Link>
                ) : (
                  <UserDropdown
                    open={dropdownOpen}
                    onToggle={() => setDropdownOpen((o) => !o)}
                    onClose={() => setDropdownOpen(false)}
                    userName={user!.name}
                    userEmail={user!.email}
                    isAdmin={isAdmin}
                    onLogout={logout}
                    dropdownRef={dropdownRef}
                  />
                )}
              </>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90"
              style={{
                border: `1px solid ${TUSCAN}30`,
                color: SADDLE,
                background: menuOpen ? `${TUSCAN}15` : "transparent",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={20} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

    </motion.header>

    {/* Mobile menu rendered outside motion.header so position:fixed isn't broken by the header's CSS transform */}
    <AnimatePresence>
      {menuOpen && (
        <MobileMenu
          links={navLinks}
          pathname={pathname}
          scrolled={scrolled}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          userName={user?.name}
          onLogout={logout}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </AnimatePresence>
    </>
  );
}
