"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  ImageIcon,
  VideoIcon,
  Layers,
  Sparkles,
  Palette,
  Maximize2,
  type LucideIcon,
} from "lucide-react";

const MODELS: { icon: LucideIcon; name: string; desc: string; badge?: string }[] = [
  { icon: ImageIcon, name: "Flux Dev", desc: "Best general-purpose image model. Stunning detail and prompt adherence.", badge: "Most popular" },
  { icon: ImageIcon, name: "Flux Schnell", desc: "Fastest image generation. Great for rapid iteration and prototyping." },
  { icon: ImageIcon, name: "SDXL", desc: "High-resolution generation with excellent composition and lighting." },
  { icon: VideoIcon, name: "Fluid Video", desc: "Text-to-video with cinematic motion and smooth transitions." },
  { icon: Wand2, name: "Style Transfer", desc: "Apply any artistic style to your existing images instantly." },
  { icon: Maximize2, name: "Upscale 4x", desc: "Enhance resolution while preserving and sharpening details." },
  { icon: Palette, name: "Color Grading", desc: "Apply cinematic LUTs and color palettes to any image." },
  { icon: Layers, name: "Inpainting", desc: "Edit, replace, or expand parts of any image with precision." },
];

export function ModelGrid() {
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
            Models & Tools
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
            Everything you need
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODELS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
              >
                {m.badge && (
                  <span
                    className="absolute -top-2 left-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    {m.badge}
                  </span>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent-solid)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{m.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
