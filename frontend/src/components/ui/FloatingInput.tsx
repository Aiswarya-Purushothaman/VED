"use client";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  rightSlot?: ReactNode;
  autoComplete?: string;
}

export default function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  rightSlot,
  autoComplete,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative pt-5">
      <motion.label
        htmlFor={name}
        className="absolute left-0 font-cinzel text-xs tracking-wider uppercase pointer-events-none"
        animate={{
          top: active ? 0 : "1.4rem",
          color: active ? "#00A693" : "#4A7C7C",
          fontSize: active ? "0.6rem" : "0.7rem",
        }}
        transition={{ duration: 0.18 }}
      >
        {label}
        {required && " *"}
      </motion.label>
      <div className="relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          required={required}
          autoComplete={autoComplete}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary pb-2 pt-3 font-dm text-light text-sm focus:outline-none transition-colors pr-8"
        />
        {rightSlot && (
          <span className="absolute right-0 top-3 flex items-center">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}
