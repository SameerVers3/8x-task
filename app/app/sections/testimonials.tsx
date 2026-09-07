"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// TODO: Replace with real testimonials once collected from users
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    avatar: "SC",
    text: "Fluid has completely transformed my creative workflow. The quality is incredible and the interface is so intuitive.",
  },
  {
    name: "Marcus Johnson",
    role: "Content Creator",
    text: "I generate thumbnails and concept art daily. The credit system is fair and the results are consistently amazing.",
  },
  {
    name: "Yuki Tanaka",
    role: "Game Designer",
    text: "The anime style presets are perfect for my projects. I've never found an AI art tool this good for Japanese aesthetics.",
  },
  {
    name: "Elena Rossi",
    role: "Fashion Photographer",
    text: "Fluid helps me visualize concepts before shoots. It's like having a creative assistant that works 24/7.",
  },
  {
    name: "David Park",
    role: "Indie Filmmaker",
    text: "The video generation feature is a game changer for storyboarding. I can create mood videos in minutes instead of days.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const t = TESTIMONIALS[index];

  return (
    <section className="border-y border-[var(--border-subtle)] px-6 py-24 md:px-16" style={{ background: "var(--bg-elevated)" }}>
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]">
            Testimonials
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
            Loved by creators
          </h2>
        </motion.div>

        <div
          className="relative mx-auto max-w-2xl rounded-[20px] border border-[var(--border-subtle)] p-8 md:p-10"
          style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px) saturate(140%)" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote className="mb-4 h-6 w-6 text-[var(--accent-solid)] opacity-50" />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base leading-relaxed text-[var(--text-primary)] md:text-lg">
                "{t.text}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-muted)] text-sm font-semibold text-[var(--accent-solid)]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-[var(--accent-solid)]" : "w-1.5 bg-[var(--border-subtle)] hover:bg-[var(--text-tertiary)]"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--glass-fill-hover)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--glass-fill-hover)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
