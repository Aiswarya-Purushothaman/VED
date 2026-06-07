"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  // Refs gate state updates so we never re-render inside hot-path event handlers
  const visibleRef = useRef(false);
  const isPointerRef = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50 });
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 28 });

  useEffect(() => {
    if (prefersReduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const next = !!el.closest("a, button, [role='button'], input, select, textarea, label");
      if (next !== isPointerRef.current) {
        isPointerRef.current = next;
        setIsPointer(next);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY, prefersReduced]); // `visible` removed — tracked via ref instead

  if (prefersReduced || !visible) return null;

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isPointer ? 1.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="custom-cursor-ring"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isPointer ? 1.9 : 1, opacity: isPointer ? 0.4 : 0.75 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
