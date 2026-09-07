"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Wand2, Globe } from "lucide-react";

const SECTIONS = [
  {
    eyebrow: "Lightning Fast",
    title: "From idea to image in seconds",
    desc: "Fluid's optimized inference pipeline runs on distributed GPUs, delivering high-quality generations without the wait. No queues, no throttling — just pure speed.",
    cta: "Try it now",
    href: "/generate",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4e27f2b8-68b2-4eec-9912-07c2468cfc4b/original=true/4e27f2b8-68b2-4eec-9912-07c2468cfc4b.jpeg",
    icon: Zap,
    microCards: [
      { label: "2.3s", sub: "Avg generation time" },
      { label: "8K", sub: "Max resolution" },
    ],
  },
  {
    eyebrow: "10+ Languages",
    title: "Prompt in your native tongue",
    desc: "Fluid understands context across languages. Describe your vision in English, Spanish, Japanese, Hindi, or any of 10 supported languages. The model adapts culturally and linguistically.",
    cta: "Explore languages",
    href: "/generate",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ec8d76a5-a3dc-473d-bffb-890df13c69b7/original=true/ec8d76a5-a3dc-473d-bffb-890df13c69b7.jpeg",
    icon: Globe,
    microCards: [
      { label: "10", sub: "Languages" },
      { label: "99%", sub: "Context accuracy" },
    ],
  },
  {
    eyebrow: "Style Presets",
    title: "One click, infinite aesthetics",
    desc: "Apply cinematic, anime, photorealistic, oil painting, neon noir, and more presets with a single tap. Each preset is tuned by professional artists to bring consistent, stunning results.",
    cta: "Browse presets",
    href: "/generate",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg",
    icon: Wand2,
    microCards: [
      { label: "24", sub: "Style presets" },
      { label: "1-tap", sub: "Apply" },
    ],
  },
];

export function AlternatingFeatures() {
  return (
    <section className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[1280px] space-y-24 md:space-y-32">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          const isReversed = i % 2 === 1;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                isReversed ? "md:[direction:rtl]" : ""
              }`}
            >
              {/* Text */}
              <div className={`space-y-5 ${isReversed ? "md:[direction:ltr]" : ""}`}>
                <div className="flex items-center gap-2 text-[var(--accent-solid)]">
                  <Icon className="h-4 w-4" />
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.06em]">
                    {s.eyebrow}
                  </span>
                </div>
                <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
                  {s.title}
                </h2>
                <p className="max-w-md leading-[1.6] text-[var(--text-secondary)]">
                  {s.desc}
                </p>
                <Link
                  href={s.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-solid)] transition-colors hover:underline"
                >
                  {s.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Media */}
              <div className={`relative ${isReversed ? "md:[direction:ltr]" : ""}`}>
                <div className="relative overflow-hidden rounded-[20px] border border-[var(--border-subtle)]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    width={700}
                    height={500}
                    className="w-full object-cover"
                    unoptimized
                  />
                </div>
                {/* Floating micro-cards */}
                <div
                  className={`absolute ${isReversed ? "-left-3" : "-right-3"} bottom-8 flex flex-col gap-2`}
                >
                  {s.microCards.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 shadow-lg"
                      style={{
                        background: "var(--glass-fill)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <p className="text-sm font-bold text-[var(--text-primary)]">{m.label}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{m.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
