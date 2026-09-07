"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  ImageIcon,
  ChevronRight,
  Pause,
  Play,
  Clapperboard,
} from "lucide-react";

const HERO_BACKGROUNDS = [
  {
    url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/936f0e8d-c76f-4aa7-8b5c-37349f9b7da7/original=true/936f0e8d-c76f-4aa7-8b5c-37349f9b7da7.jpeg",
    alt: "AI Art by Stellaaa",
    type: "image" as const,
  },
  {
    url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7238afe-3f56-41f5-92a4-ece392806c60/original=true/c7238afe-3f56-41f5-92a4-ece392806c60.mp4",
    poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7238afe-3f56-41f5-92a4-ece392806c60/original=true/c7238afe-3f56-41f5-92a4-ece392806c60.jpeg",
    alt: "AI Video by HshiKoi",
    type: "video" as const,
  },
  {
    url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/29ccc99b-e514-47a9-a361-924d4d13b100/original=true/29ccc99b-e514-47a9-a361-924d4d13b100.jpeg",
    alt: "AI Art by fortylove",
    type: "image" as const,
  },
  {
    url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/dd00de1d-ec6a-4848-bc8c-01d7a8437a5d/original=true/dd00de1d-ec6a-4848-bc8c-01d7a8437a5d.jpeg",
    alt: "AI Art by saper7474377",
    type: "image" as const,
  },
  {
    url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/012041fd-c1cb-4c08-b0dd-b4ae9148e9bc/original=true/012041fd-c1cb-4c08-b0dd-b4ae9148e9bc.jpeg",
    alt: "AI Art by Pinkielicious",
    type: "image" as const,
  },
];

function HeroBackground() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % HERO_BACKGROUNDS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    const bg = HERO_BACKGROUNDS[active];
    if (bg.type === "video" && videoRef.current) {
      videoRef.current.play();
    }
  }, [active]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backgrounds */}
      {HERO_BACKGROUNDS.map((bg, i) => (
        <AnimatePresence key={i} mode="popLayout">
          {i === active && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {bg.type === "video" ? (
                <video
                  ref={i === active ? videoRef : undefined}
                  src={bg.url}
                  poster={bg.poster}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={bg.url}
                  alt={bg.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  unoptimized
                  sizes="100vw"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(3,3,4,0.95) 0%, rgba(3,3,4,0.45) 40%, rgba(3,3,4,0.75) 100%)",
        }}
      />

      {/* Pause button */}
      <button
        onClick={() => setPaused((p) => !p)}
        className="absolute bottom-6 right-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-colors"
        aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
      >
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {HERO_BACKGROUNDS.map((bg, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
        {HERO_BACKGROUNDS[active].type === "video" && (
          <span className="ml-1 flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-sm">
            <Clapperboard className="h-3 w-3" />
            Video
          </span>
        )}
      </div>
    </div>
  );
}

function FloatingGenerationBar() {
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative mx-auto w-full max-w-3xl rounded-[20px] border transition-all duration-300 ${
        focused
          ? "border-[var(--accent-solid)] shadow-[0_0_30px_rgba(124,58,237,0.25)]"
          : "border-[var(--border-strong)] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      }`}
      style={{
        background: "var(--glass-fill)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
      }}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--glass-fill-hover)] hover:text-[var(--text-primary)] transition-colors">
          <ImageIcon className="h-4 w-4" />
        </button>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe what you want to create…"
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && prompt.trim()) {
              window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}`;
            }
          }}
        />
        <span className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          Flux
        </span>
        <span className="hidden md:inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          1:1
        </span>
        <Link
          href={prompt.trim() ? `/generate?prompt=${encodeURIComponent(prompt)}` : "/generate"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--accent-gradient)" }}
        >
          <Wand2 className="h-4 w-4 text-white" />
        </Link>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative -mt-20 min-h-[90dvh] overflow-hidden" style={{ minHeight: "640px" }}>
      <HeroBackground />

      {/* Foreground content */}
      <div className="relative z-10 flex h-full min-h-[90dvh] flex-col justify-end px-6 pb-24 pt-20 md:px-16 md:pb-32">
        <div className="mx-auto w-full max-w-[1440px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{
                background: "var(--glass-fill)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Sparkles className="h-3 w-3" />
              Fluid AI — Image & Video
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]"
          >
            Create anything
            <br />
            you imagine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-[48ch] text-base leading-[1.6] text-[var(--text-secondary)] md:text-lg"
          >
            Transform text into stunning images and videos in seconds. No expertise needed.
            Just describe your vision and let Fluid bring it to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              <Wand2 className="h-4 w-4" />
              Start Creating
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--glass-fill-hover)]"
            >
              View Pricing
            </Link>
          </motion.div>

          {/* Floating generation bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <FloatingGenerationBar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
