"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LogoMark from "@/components/ui/LogoMark";
import FloatingInput from "@/components/ui/FloatingInput";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

function PasswordStrength({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const score = [hasLength, hasUpper, hasNumber].filter(Boolean).length;

  if (!password) return null;

  const colors = ["#ef4444", "#f97316", "#00A693"];
  const labels = ["Weak", "Fair", "Strong"];

  return (
    <div className="flex items-center gap-2 mt-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-0.5 flex-1 rounded-full transition-all duration-300"
          style={{ background: i < score ? colors[score - 1] : "#00A69320" }}
        />
      ))}
      <span
        className="font-cinzel text-[8px] tracking-wider uppercase w-10 text-right"
        style={{ color: score > 0 ? colors[score - 1] : "#4A7C7C" }}
      >
        {score > 0 ? labels[score - 1] : ""}
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const reduced = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
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
            Join Us
          </span>
          <h1 className="font-playfair text-2xl font-bold text-light mt-1">
            Create{" "}
            <em className="font-cormorant not-italic text-gradient-gold">
              Account
            </em>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <FloatingInput
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div>
            <FloatingInput
              label="Password"
              name="password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
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
            <PasswordStrength password={password} />
          </div>

          <FloatingInput
            label="Confirm Password"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-text-muted hover:text-primary transition-colors p-0.5"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
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
            className="w-full py-3.5 font-cinzel text-[10px] tracking-[0.35em] uppercase font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ background: TUSCAN, color: "#020608" }}
          >
            {loading ? "Creating account…" : "Create Account"}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium transition-colors hover:opacity-80"
            style={{ color: "#00A693" }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
