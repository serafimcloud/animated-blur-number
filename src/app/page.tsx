"use client";

import * as React from "react";
import { AnimateNumber } from "@/components/animate-number";
import { Button } from "@/components/button";

const REPO = "https://github.com/serafimcloud/animated-blur-number";

export default function Home() {
  const [n, setN] = React.useState(1_204_837);
  const [price, setPrice] = React.useState(4999.0);
  const [pct, setPct] = React.useState(42.0);
  const [blur, setBlur] = React.useState(10);
  const [duration, setDuration] = React.useState(700);
  const [live, setLive] = React.useState(false);

  React.useEffect(() => {
    if (!live) return;
    const id = setInterval(
      () => setN((v) => v + Math.floor(Math.random() * 40) + 1),
      900
    );
    return () => clearInterval(id);
  }, [live]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              animated-blur-number
            </h1>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] text-[color:var(--fg-muted)] underline-offset-4 hover:text-[color:var(--fg)] hover:underline"
            >
              GitHub ↗
            </a>
          </div>
          <p className="text-[15px] leading-relaxed text-[color:var(--fg-muted)]">
            A number that transitions digit-by-digit with an iOS-style spring,
            and blurs <em>only</em> the digits that actually change. Watch the
            leading digits stay crisp and still while the trailing ones roll +
            blur into place.
          </p>
        </header>

        {/* Hero counter */}
        <section className="flex flex-col gap-6">
          <div className="flex min-h-[5rem] items-center">
            <AnimateNumber
              value={n}
              blur={blur}
              duration={duration}
              className="text-6xl font-semibold"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button id="inc1" variant="outline" onClick={() => setN((v) => v + 1)}>
              +1
            </Button>
            <Button id="inc9" variant="outline" onClick={() => setN((v) => v + 9)}>
              +9
            </Button>
            <Button id="inc137" variant="outline" onClick={() => setN((v) => v + 137)}>
              +137
            </Button>
            <Button id="inc1k" variant="outline" onClick={() => setN((v) => v + 1000)}>
              +1,000
            </Button>
            <Button id="dec7" variant="outline" onClick={() => setN((v) => v - 7)}>
              -7
            </Button>
            <Button
              id="rand"
              variant="outline"
              onClick={() => setN(Math.floor(Math.random() * 9_999_999))}
            >
              Randomize
            </Button>
            <Button
              id="live"
              variant={live ? "default" : "secondary"}
              onClick={() => setLive((v) => !v)}
            >
              {live ? "Stop ticking" : "Tick live"}
            </Button>
          </div>
        </section>

        {/* Knobs */}
        <section className="grid grid-cols-2 gap-6 rounded-xl border border-[color:var(--border)] p-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="flex justify-between text-[color:var(--fg-muted)]">
              <span>Blur</span>
              <span className="tabular-nums">{blur}px</span>
            </span>
            <input
              id="blur"
              type="range"
              min={0}
              max={24}
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="accent-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="flex justify-between text-[color:var(--fg-muted)]">
              <span>Duration</span>
              <span className="tabular-nums">{duration}ms</span>
            </span>
            <input
              id="duration"
              type="range"
              min={150}
              max={1500}
              step={50}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="accent-white"
            />
          </label>
        </section>

        {/* Formatting examples */}
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="text-sm text-[color:var(--fg-muted)]">
              Currency (prefix + 2 decimals)
            </span>
            <AnimateNumber
              value={price}
              prefix="$"
              blur={blur}
              duration={duration}
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              className="text-4xl font-semibold"
            />
            <div className="flex gap-2">
              <Button
                id="price-cent"
                variant="outline"
                onClick={() => setPrice((v) => Math.round((v + 0.01) * 100) / 100)}
              >
                +$0.01
              </Button>
              <Button
                id="price-big"
                variant="outline"
                onClick={() => setPrice((v) => Math.round((v + 499.99) * 100) / 100)}
              >
                +$499.99
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm text-[color:var(--fg-muted)]">
              Percentage (suffix + 1 decimal)
            </span>
            <AnimateNumber
              value={pct}
              suffix="%"
              blur={blur}
              duration={duration}
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
              className="text-4xl font-semibold"
            />
            <div className="flex gap-2">
              <Button
                id="pct-up"
                variant="outline"
                onClick={() => setPct((v) => Math.round((v + 0.1) * 10) / 10)}
              >
                +0.1
              </Button>
              <Button
                id="pct-down"
                variant="outline"
                onClick={() => setPct((v) => Math.round((v - 3.7) * 10) / 10)}
              >
                -3.7
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-[color:var(--border)] pt-6 text-[13px] text-[color:var(--fg-muted)]">
          Inspired by iOS{" "}
          <code className="text-[color:var(--fg)]">numericText</code> and
          motion.dev. MIT licensed.{" "}
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-[color:var(--fg)]"
          >
            Source
          </a>
          .
        </footer>
      </div>
    </main>
  );
}
