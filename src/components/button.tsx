"use client";

import * as React from "react";

type Variant = "default" | "outline" | "secondary";

const VARIANTS: Record<Variant, string> = {
  default: "bg-white text-black hover:bg-white/90",
  outline:
    "border border-[color:var(--border)] bg-transparent text-[color:var(--fg)] hover:bg-white/[0.06]",
  secondary: "bg-white/10 text-[color:var(--fg)] hover:bg-white/15",
};

export function Button({
  variant = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex h-9 select-none items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:translate-y-px ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
