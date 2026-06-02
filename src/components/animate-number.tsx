"use client";

/**
 * <AnimateNumber> - a number that transitions digit-by-digit, in the spirit of
 * iOS's `.contentTransition(.numericText())` and motion.dev's <AnimateNumber>,
 * PLUS: only the digits that actually change blur as they move. Unchanged
 * digits never animate.
 *
 * How it works: the formatted value is split into characters and rendered
 * right-aligned, one <CharSlot> per place value (keyed by its offset from the
 * right, so the ones digit / decimal point keep a stable identity as the
 * number grows or shrinks). A slot only mounts its sliding+blurring layers
 * when its own character differs from the last one - so a 1199 -> 1200 tick
 * animates just the "99" -> "00", leaving "12" rock-steady. The slide rides a
 * spring (see --an-spring in animate-number.css) for the iOS settle.
 *
 *   <AnimateNumber value={1234} />
 *   <AnimateNumber value={price} prefix="$" format={{ minimumFractionDigits: 2 }} />
 *   <AnimateNumber value={pct} suffix="%" duration={400} blur={12} />
 *
 * Zero runtime dependencies (React peer only). Ship animate-number.css alongside.
 */

import * as React from "react";
import "./animate-number.css";

// Tiny class joiner - keeps the component dependency-free.
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// Zero-width space so an empty slot (a digit that vanished / not yet present)
// still has a line box to animate.
const ZWSP = "​";

export type AnimateNumberProps = {
  value: number;
  /** Forwarded to `Intl.NumberFormat` (grouping, fraction digits, currency...). */
  format?: Intl.NumberFormatOptions;
  /** Defaults to "en-US" so SSR and client format identically (no hydration drift). */
  locale?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Slide+blur duration in ms. */
  duration?: number;
  /** Peak blur of a changing digit, in px. */
  blur?: number;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "prefix" | "children">;

function formatValue(
  value: number,
  locale: string,
  opts?: Intl.NumberFormatOptions
) {
  try {
    return new Intl.NumberFormat(locale, opts).format(value);
  } catch {
    return String(value);
  }
}

type CharSlotProps = {
  char: string;
  direction: number;
  durationMs: number;
  blur: number;
};

/** A single character cell that slides + blurs only when its char changes. */
function CharSlot({ char, direction, durationMs, blur }: CharSlotProps) {
  const prev = React.useRef(char);
  const genRef = React.useRef(0);
  const [state, setState] = React.useState(() => ({
    cur: char,
    out: null as string | null,
    gen: 0,
  }));

  React.useEffect(() => {
    if (char === prev.current) return;
    genRef.current += 1;
    setState({ cur: char, out: prev.current, gen: genRef.current });
    prev.current = char;
  }, [char]);

  const animating = state.out !== null;

  const style = {
    "--an-dur": `${durationMs}ms`,
    "--an-blur": `${blur}px`,
    "--an-dir": direction,
  } as React.CSSProperties;

  return (
    <span className="an-slot" style={style} aria-hidden>
      <span
        key={`in-${state.gen}`}
        className={cn("an-layer", animating && "an-in")}
        onAnimationEnd={
          animating ? () => setState((s) => ({ ...s, out: null })) : undefined
        }
      >
        {state.cur === "" ? ZWSP : state.cur}
      </span>
      {animating ? (
        <span key={`out-${state.gen}`} className="an-layer an-out">
          {state.out === "" ? ZWSP : state.out}
        </span>
      ) : null}
    </span>
  );
}

export function AnimateNumber({
  value,
  format,
  locale = "en-US",
  prefix,
  suffix,
  duration = 450,
  blur = 21,
  className,
  ...rest
}: AnimateNumberProps) {
  const formatted = formatValue(value, locale, format);

  // Roll up when the value rises, down when it falls. Keep the previous value
  // (and the resulting direction) in state and reconcile during render - the
  // documented way to derive from prior renders without poking a ref.
  const [prev, setPrev] = React.useState(value);
  const [direction, setDirection] = React.useState(1);
  if (prev !== value) {
    setDirection(value < prev ? -1 : 1);
    setPrev(value);
  }

  const chars = formatted.split("");
  const len = chars.length;

  const label = [
    typeof prefix === "string" ? prefix : "",
    formatted,
    typeof suffix === "string" ? suffix : "",
  ].join("");

  return (
    <span {...rest} className={cn("an-root", className)}>
      <span className="an-sr">{label}</span>
      {prefix != null ? <span aria-hidden>{prefix}</span> : null}
      {chars.map((ch, i) => (
        // Keyed by distance from the right so each place value keeps its slot.
        <CharSlot
          key={len - 1 - i}
          char={ch}
          direction={direction}
          durationMs={duration}
          blur={blur}
        />
      ))}
      {suffix != null ? <span aria-hidden>{suffix}</span> : null}
    </span>
  );
}

export default AnimateNumber;
