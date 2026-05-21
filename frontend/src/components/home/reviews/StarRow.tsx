import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { SADDLE } from "@/lib/theme";

interface Props { rating: number; accent: string; size?: number; }

export default function StarRow({ rating, accent, size = 13 }: Props) {
  const reduced = useReducedMotion();
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <motion.span
          key={s}
          initial={reduced ? false : { opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: s * 0.06, type: "spring", stiffness: 400, damping: 20 }}
        >
          <Star
            size={size}
            style={s <= rating ? { color: accent, fill: accent } : { color: `${SADDLE}30` }}
          />
        </motion.span>
      ))}
    </div>
  );
}
