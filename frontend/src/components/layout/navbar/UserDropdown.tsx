"use client";
import Link from "next/link";
import { LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SADDLE, TUSCAN } from "@/lib/theme";

interface Props {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  onLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export default function UserDropdown({
  open, onToggle, onClose, userName, userEmail, isAdmin, onLogout, dropdownRef,
}: Props) {
  return (
    <div className="hidden lg:block relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 font-cinzel text-[9px] tracking-[0.25em] uppercase transition-all duration-300 hover:scale-[1.02] min-h-[44px]"
        style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE, background: `${TUSCAN}0A` }}
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
          style={{ background: TUSCAN, color: "#020608" }}
        >
          {userName.charAt(0).toUpperCase()}
        </span>
        {userName.split(" ")[0]}
        <ChevronDown size={11} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
            style={{
              background: "rgba(237,250,250,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${TUSCAN}25`,
              boxShadow: `0 8px 32px ${TUSCAN}15`,
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: `${TUSCAN}15` }}>
              <p className="font-cinzel text-[8px] tracking-[0.3em] uppercase" style={{ color: `${SADDLE}70` }}>
                Signed in as
              </p>
              <p className="font-dm text-xs font-medium truncate mt-0.5" style={{ color: SADDLE }}>
                {userEmail}
              </p>
            </div>
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 font-dm text-xs transition-colors hover:bg-primary/5"
                style={{ color: SADDLE }}
              >
                <LayoutDashboard size={13} style={{ color: TUSCAN }} />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 font-dm text-xs transition-colors hover:bg-primary/5"
                style={{ color: SADDLE }}
              >
                <User size={13} style={{ color: TUSCAN }} />
                Profile
              </Link>
            )}
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center gap-2 px-4 py-3 font-dm text-xs transition-colors hover:bg-red-50"
              style={{ color: "#b91c1c" }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
