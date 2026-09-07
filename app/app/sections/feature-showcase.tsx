"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const FEATURE_CARDS: { title: string; desc: string; image: string; badge: string | null; href: string; isVideo?: boolean }[] = [
  {
    title: "Fluid Images",
    desc: "Generate photorealistic portraits, surreal landscapes, and abstract art from a single sentence.",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/81f8e626-a822-4815-b8be-361ff65b0d88/original=true/81f8e626-a822-4815-b8be-361ff65b0d88.jpeg",
    badge: "Popular",
    href: "/generate",
  },
  {
    title: "Fluid Videos",
    desc: "Turn text into cinematic motion. From concept scenes to animated visual effects.",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7238afe-3f56-41f5-92a4-ece392806c60/original=true/c7238afe-3f56-41f5-92a4-ece392806c60.jpeg",
    badge: "New",
    href: "/generate",
    isVideo: true,
  },
  {
    title: "Style Presets",
    desc: "One-click cinematic, anime, photorealistic, oil painting, and more aesthetic filters.",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cc2189cb-9ca7-4f49-83a9-a04de1cbad69/original=true/cc2189cb-9ca7-4f49-83a9-a04de1cbad69.jpeg",
    badge: null,
    href: "/generate",
  },
  {
    title: "Enhance & Upscale",
    desc: "Take any image and push it further. Upscale resolution, restyle, and refine details.",
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg",
    badge: null,
    href: "/generate",
  },
];

export function FeatureShowcase() {
  return (
    <section className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]">
            Capabilities
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
            What you can create
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={card.href}
                className="group relative block overflow-hidden rounded-[20px] border border-[var(--border-subtle)] transition-all duration-200 hover:scale-[1.02] hover:border-[var(--border-strong)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {card.badge && (
                    <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                      style={{ background: "var(--accent-gradient)" }}
                    >
                      {card.badge}
                    </span>
                  )}
                  {card.isVideo && (
                    <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      Video
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-semibold text-white">{card.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{card.desc}</p>
                  </div>
                  {card.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white ring-1 ring-white/30 transition-all duration-200 group-hover:scale-110 group-hover:bg-white/30">
                        <Play className="h-4 w-4 fill-white" />
                      </div>
                    </div>
                  )}
                  {!card.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white">
                        <Play className="h-4 w-4 fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
