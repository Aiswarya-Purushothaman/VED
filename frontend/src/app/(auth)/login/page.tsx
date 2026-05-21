"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LogoMark from "@/components/ui/LogoMark";
import FloatingInput from "@/components/ui/FloatingInput";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const reduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user: u } = await login(email, password);
      const from = searchParams.get("from");
      if (u?.role === "admin") {
        router.push(from && from.startsWith("/admin") ? from : "/admin");
      } else {
        router.push(from ?? "/");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EDFAFA 0%, #C8EEEE 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${TUSCAN}12 0%, transparent 70%)`,
        }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card rounded-2xl p-8 md:p-12 w-full max-w-md relative z-10"
        style={{ border: `1px solid ${TUSCAN}28` }}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-2 mb-10">
          <LogoMark size={40} />
          <div className="text-center">
            <p
              className="font-playfair font-bold text-base"
              style={{ color: SADDLE }}
            >
              Virtual Events
            </p>
            <p
              className="font-cinzel text-[8px] tracking-[0.35em] uppercase"
              style={{ color: `${SADDLE}70` }}
            >
              &amp; Decorations
            </p>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center mb-8">
          <span className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-primary">
            Welcome Back
          </span>
          <h1 className="font-playfair text-2xl font-bold text-light mt-1">
            Sign{" "}
            <em className="font-cormorant not-italic text-gradient-gold">In</em>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingInput
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <FloatingInput
            label="Password"
            name="password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-text-muted hover:text-primary transition-colors p-0.5"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-dm text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#b91c1c",
                }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={reduced ? {} : { scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 font-cinzel text-[10px] tracking-[0.35em] uppercase font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: TUSCAN, color: "#020608" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px" style={{ background: `${TUSCAN}20` }} />
          <span
            className="font-cinzel text-[8px] tracking-[0.3em] uppercase"
            style={{ color: `${SADDLE}60` }}
          >
            or
          </span>
          <span className="flex-1 h-px" style={{ background: `${TUSCAN}20` }} />
        </div>

        <p
          className="text-center font-dm text-sm"
          style={{ color: `${SADDLE}90` }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium transition-colors hover:opacity-80"
            style={{ color: "#00A693" }}
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
