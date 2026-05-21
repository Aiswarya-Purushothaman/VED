"use client";
import Link from "next/link";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { SADDLE, TUSCAN } from "@/lib/theme";

interface NavLink { href: string; label: string; }

interface Props {
  links: NavLink[];
  pathname: string;
  scrolled: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName?: string;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileMenu({
  links, pathname, scrolled, isLoggedIn, isAdmin, userName, onLogout, onClose,
}: Props) {
  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`lg:hidden fixed inset-x-0 bottom-0 flex flex-col z-40 ${scrolled ? "top-16" : "top-16 md:top-20"}`}
      style={{
        background: "rgba(237,250,250,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: `1px solid ${TUSCAN}20`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${TUSCAN}08 0%, transparent 70%)` }}
      />

      <div className="flex flex-col items-center justify-center flex-1 gap-1 py-10 relative z-10">
        {links.map((link, i) => {
          const active = pathname === link.href;
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <Link href={link.href} className="flex items-center justify-center gap-4 w-full py-5 relative group">
                <motion.span
                  className="absolute left-8 h-px w-0 group-hover:w-8 transition-all duration-300 rounded-full"
                  style={{ background: TUSCAN }}
                  animate={{ width: active ? 32 : 0 }}
                />
                <span
                  className="font-cormorant text-3xl font-light tracking-wide transition-colors duration-200"
                  style={{ color: active ? TUSCAN : `${SADDLE}CC` }}
                >
                  {link.label}
                </span>
                <motion.span
                  className="absolute right-8 h-px w-0 group-hover:w-8 transition-all duration-300 rounded-full"
                  style={{ background: TUSCAN }}
                  animate={{ width: active ? 32 : 0 }}
                />
              </Link>
              {i < links.length - 1 && (
                <div className="mx-auto w-16 h-px opacity-20" style={{ background: TUSCAN }} />
              )}
            </motion.div>
          );
        })}

        {/* Auth section */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ delay: 0.05 + links.length * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="mx-auto w-16 h-px opacity-20 mb-1" style={{ background: TUSCAN }} />
          {!isLoggedIn ? (
            <Link href="/login" className="flex items-center justify-center gap-3 w-full py-5">
              <LogIn size={16} style={{ color: TUSCAN }} />
              <span className="font-cormorant text-2xl font-light tracking-wide" style={{ color: `${SADDLE}CC` }}>
                Login
              </span>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-3 py-5">
              <span className="font-cormorant text-xl font-light" style={{ color: TUSCAN }}>{userName}</span>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 font-cinzel text-[9px] tracking-[0.3em] uppercase transition-all active:scale-95"
                  style={{ border: `1px solid ${TUSCAN}50`, color: SADDLE }}
                >
                  <LayoutDashboard size={12} style={{ color: TUSCAN }} />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 font-cinzel text-[9px] tracking-[0.3em] uppercase transition-all active:scale-95"
                style={{ border: "1px solid rgba(185,28,28,0.3)", color: "#b91c1c" }}
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.42, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <p className="font-cinzel text-[8px] tracking-[0.35em] uppercase" style={{ color: `${SADDLE}50` }}>
            9 AM – 9 PM · 7 Days a Week
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
