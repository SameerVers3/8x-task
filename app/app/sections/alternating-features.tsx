"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Wand2, Globe, ImageIcon, VideoIcon, Clapperboard, Clock, History, Layers, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

/* ─── Image + Video Visual ─── */
function DualMediaVisual() {
  const [active, setActive] = useState<"image" | "video">("image");

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a === "image" ? "video" : "image")), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        {/* Main card */}
        <div className="relative overflow-hidden rounded-[20px] border border-[var(--border-subtle)] shadow-2xl">
          <Image
            src="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4e27f2b8-68b2-4eec-9912-07c2468cfc4b/original=true/4e27f2b8-68b2-4eec-9912-07c2468cfc4b.jpeg"
            alt="Generation"
            width={700}
            height={500}
            className="w-full object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Tab chips at bottom */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md">
            <button
              onClick={() => setActive("image")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                active === "image" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              <ImageIcon className="h-3 w-3" />
              Image
            </button>
            <button
              onClick={() => setActive("video")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                active === "video" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              <VideoIcon className="h-3 w-3" />
              Video
            </button>
          </div>
        </div>

        {/* Overlapping secondary card */}
        <motion.div
          className="absolute -right-4 -top-4 overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl"
          style={{ width: 140, height: 180 }}
          animate={{ rotate: active === "image" ? 6 : -6, scale: active === "image" ? 1 : 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg"
            alt="Secondary"
            fill
            className="object-cover"
            unoptimized
            sizes="200px"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            {active === "image" ? (
              <ImageIcon className="h-3 w-3 text-white" />
            ) : (
              <Clapperboard className="h-3 w-3 text-white" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating stat cards */}
      <motion.div
        className="absolute -left-4 bottom-8 rounded-xl border border-[var(--border-subtle)] px-4 py-3 shadow-2xl"
        style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
            <Layers className="h-4 w-4 text-[var(--accent-solid)]" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-[var(--text-primary)]">2-in-1</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Image & Video</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-2 bottom-6 rounded-xl border border-[var(--border-subtle)] px-4 py-3 shadow-2xl"
        style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-solid)]" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-[var(--text-primary)]">One Flow</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Same Interface</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── History Visual ─── */
const HISTORY_THUMBS = [
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/81f8e626-a822-4815-b8be-361ff65b0d88/original=true/81f8e626-a822-4815-b8be-361ff65b0d88.jpeg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a6f968b2-1220-422d-a618-ac1e938ffa62/original=true/a6f968b2-1220-422d-a618-ac1e938ffa62.jpeg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4c0ccb9b-8426-4e33-b4fe-bbca293efc32/original=true/4c0ccb9b-8426-4e33-b4fe-bbca293efc32.jpeg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ec8d76a5-a3dc-473d-bffb-890df13c69b7/original=true/ec8d76a5-a3dc-473d-bffb-890df13c69b7.jpeg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg",
];

function HistoryVisual() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center">
      {/* Center hero image */}
      <motion.div
        className="relative z-10 overflow-hidden rounded-[20px] border border-[var(--border-subtle)] shadow-2xl"
        style={{ width: 260, height: 340 }}
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg"
          alt="Latest"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-xs font-semibold text-white">Latest creation</p>
        </div>
      </motion.div>

      {/* Orbiting thumbnails */}
      {HISTORY_THUMBS.slice(0, 6).map((thumb, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const radius = 170;
        return (
          <motion.div
            key={i}
            className="absolute overflow-hidden rounded-lg border border-[var(--border-subtle)] shadow-lg transition-transform duration-300 hover:scale-110 hover:z-20"
            style={{
              width: 70 + (i % 3) * 15,
              height: 70 + (i % 3) * 15,
              zIndex: 5 - Math.abs(i - 3),
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            animate={{
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            }}
          >
            <Image src={thumb} alt="" fill className="object-cover" unoptimized sizes="100px" />
          </motion.div>
        );
      })}

      {/* Radial rings */}
      <div className="pointer-events-none absolute h-[300px] w-[300px] rounded-full border border-[var(--accent-solid)]/10" />
      <div className="pointer-events-none absolute h-[360px] w-[360px] rounded-full border border-[var(--border-subtle)]/20" />
    </div>
  );
}

/* ─── Style Presets Visual ─── */
const PRESETS = [
  { name: "Cinematic", image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4e27f2b8-68b2-4eec-9912-07c2468cfc4b/original=true/4e27f2b8-68b2-4eec-9912-07c2468cfc4b.jpeg", tint: "from-amber-500/20 to-orange-600/20" },
  { name: "Anime", image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a6f968b2-1220-422d-a618-ac1e938ffa62/original=true/a6f968b2-1220-422d-a618-ac1e938ffa62.jpeg", tint: "from-pink-500/20 to-rose-600/20" },
  { name: "Photoreal", image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg", tint: "from-sky-400/20 to-blue-600/20" },
  { name: "Neon Noir", image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg", tint: "from-violet-500/20 to-fuchsia-600/20" },
  { name: "Oil Paint", image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/81f8e626-a822-4815-b8be-361ff65b0d88/original=true/81f8e626-a822-4815-b8be-361ff65b0d88.jpeg", tint: "from-emerald-500/20 to-teal-600/20" },
];

function PresetsFan() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center">
      {PRESETS.map((preset, i) => {
        const offset = (i - Math.floor(PRESETS.length / 2)) * 18;
        return (
          <motion.div
            key={preset.name}
            className="absolute overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl transition-all duration-300 hover:z-20 hover:scale-110 hover:shadow-2xl"
            style={{
              width: 160,
              height: 220,
              zIndex: 10 - Math.abs(i - Math.floor(PRESETS.length / 2)),
            }}
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: offset }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={preset.image}
              alt={preset.name}
              fill
              className="object-cover"
              unoptimized
              sizes="200px"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${preset.tint}`} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-xs font-semibold text-white">{preset.name}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Floating CTA chip */}
      <motion.div
        className="absolute -bottom-2 rounded-full border border-[var(--border-subtle)] px-4 py-2 shadow-xl"
        style={{ background: "var(--glass-fill)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-solid)]" />
          <span className="text-xs font-semibold text-[var(--text-primary)]">24 presets</span>
          <span className="text-[10px] text-[var(--text-tertiary)]">1-tap apply</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Section Data ─── */
const SECTIONS = [
  {
    eyebrow: "Image & Video",
    title: "Two mediums, one flow",
    desc: "Switch seamlessly between image generation and video creation without ever leaving the app. One interface, two powerful outputs — just pick a tab and start creating.",
    cta: "Start Creating",
    href: "/generate",
    icon: Layers,
    visual: DualMediaVisual,
  },
  {
    eyebrow: "History",
    title: "Your creative archive",
    desc: "Every generation is automatically saved to your personal library. Revisit past prompts, download results anytime, and build on old ideas without starting from scratch.",
    cta: "View History",
    href: "/history",
    icon: History,
    visual: HistoryVisual,
  },
  {
    eyebrow: "Style Presets",
    title: "One click, infinite aesthetics",
    desc: "Apply cinematic, anime, photorealistic, oil painting, neon noir, and more presets with a single tap. Each preset is tuned by professional artists to bring consistent, stunning results.",
    cta: "Browse presets",
    href: "/generate",
    icon: Wand2,
    visual: PresetsFan,
  },
];

export function AlternatingFeatures() {
  return (
    <section className="px-6 py-24 md:px-16">
      <div className="mx-auto space-y-32 md:space-y-40">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          const Visual = s.visual;
          const isReversed = i % 2 === 1;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                isReversed ? "lg:[direction:rtl]" : ""
              }`}
            >
              {/* Text */}
              <div className={`space-y-6 ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[var(--accent-solid)]"
                  style={{ background: "var(--glass-fill)" }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
                    {s.eyebrow}
                  </span>
                </div>
                <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
                  {s.title}
                </h2>
                <p className="max-w-lg text-lg leading-[1.7] text-[var(--text-secondary)]">
                  {s.desc}
                </p>
                <Link
                  href={s.href}
                  className="group inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  {s.cta}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Visual */}
              <div className={`${isReversed ? "lg:[direction:ltr]" : ""}`}>
                <Visual />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
