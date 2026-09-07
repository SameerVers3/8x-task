"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Layers,
  Wand2,
  Play,
  Star,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import { AppShell } from "./components/app-shell";
import { useLanguage } from "@/providers/language-provider";

const showcaseImages = [
  "https://image.pollinations.ai/prompt/epic%20fantasy%20landscape%20with%20floating%20islands%20and%20waterfalls%20digital%20art%208k%20highly%20detailed?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/cyberpunk%20city%20neon%20lights%20rainy%20night%20futuristic%20digital%20art?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/anime%20girl%20with%20pastel%20colors%20sakura%20blossoms%20dreamy%20art%20style?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/minimalist%20abstract%20geometric%20art%20warm%20colors%20clean%20design?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/photorealistic%20portrait%20of%20a%20wise%20elder%20dramatic%20lighting%20studio?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/retro%2080s%20sunset%20palm%20trees%20synthwave%20aesthetic%20vaporwave?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/cute%20cartoon%20character%20exploring%20a%20magical%20forest%20bright%20colors%20children%20book%20style?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/ocean%20underwater%20scene%20bioluminescent%20creatures%20deep%20blue%20mysterious?width=400&height=400&nologo=true&model=flux",
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate stunning images in seconds with our optimized inference pipeline.",
  },
  {
    icon: Layers,
    title: "Multiple Models",
    description: "Choose from a curated selection of the best open-source and proprietary models.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your creations and prompts are private. We never train on your data.",
  },
  {
    icon: Globe,
    title: "10+ Languages",
    description: "Use the app in your native language with full internationalization support.",
  },
  {
    icon: Wand2,
    title: "Style Presets",
    description: "Apply cinematic, anime, photorealistic, and more style presets with one click.",
  },
  {
    icon: Star,
    title: "Credit System",
    description: "Pay only for what you use. Transparent pricing with no hidden fees.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    text: "8x has completely transformed my creative workflow. The quality is incredible and the interface is so intuitive.",
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
];

function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-8 pb-16 md:px-8 md:pt-12 md:pb-24">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[var(--theme-accent)] opacity-5 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[var(--theme-accent)] opacity-5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-accent-muted)] px-4 py-1.5 text-sm font-medium text-[var(--theme-accent)]">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Creative Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-[var(--theme-fg-muted)] md:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/generate"
              className="group flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-8 py-4 text-base font-medium text-white shadow-[var(--theme-shadow-glow)] hover:bg-[var(--theme-accent-hover)] transition-all"
            >
              <Sparkles className="h-5 w-5" />
              {t("hero.cta.generate")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg-glass)] px-8 py-4 text-base font-medium text-[var(--theme-fg)] backdrop-blur-sm hover:bg-[var(--theme-surface-hover)] transition-all"
            >
              {t("hero.cta.explore")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Showcase Gallery */}
      <section className="px-4 md:px-8 pb-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold md:text-3xl">What You Can Create</h2>
            <p className="mt-2 text-[var(--theme-fg-muted)]">
              A few examples generated by our community
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {showcaseImages.map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]"
              >
                <Image
                  src={url}
                  alt={`Generated art ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 md:px-8 border-y border-[var(--theme-border)] bg-[var(--theme-bg-elevated)]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold md:text-3xl">Why Choose 8x?</h2>
            <p className="mt-2 text-[var(--theme-fg-muted)]">
              Everything you need to create stunning AI art
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-glass)] p-6 backdrop-blur-sm transition-colors hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-surface-hover)]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--theme-fg-muted)]">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image + Video Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Image Generation</h3>
              <p className="mt-3 text-[var(--theme-fg-muted)] leading-relaxed">
                Create photorealistic images, anime art, digital paintings, and more. From concept art to product mockups, bring any idea to life.
              </p>
              <Link
                href="/generate"
                className="mt-6 inline-flex items-center gap-2 text-[var(--theme-accent)] font-medium hover:underline"
              >
                Try Image Generation <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-8 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={`https://image.pollinations.ai/prompt/abstract%20art%20${i}%20colorful%20vibrant?width=200&height=200&nologo=true&model=flux`}
                      alt="Example"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                <VideoIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Video Generation</h3>
              <p className="mt-3 text-[var(--theme-fg-muted)] leading-relaxed">
                Turn text into video with cinematic quality. Create animated scenes, visual effects, and motion graphics for your projects.
              </p>
              <Link
                href="/generate"
                className="mt-6 inline-flex items-center gap-2 text-[var(--theme-accent)] font-medium hover:underline"
              >
                Try Video Generation <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-8 flex items-center justify-center rounded-xl bg-[var(--theme-surface)] aspect-video overflow-hidden">
                <div className="flex flex-col items-center gap-2 text-[var(--theme-fg-subtle)]">
                  <Play className="h-10 w-10" />
                  <span className="text-sm">Video Preview</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 md:px-8 border-y border-[var(--theme-border)] bg-[var(--theme-bg-elevated)]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold md:text-3xl">Loved by Creators</h2>
            <p className="mt-2 text-[var(--theme-fg-muted)]">
              See what our community is saying
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-glass)] p-6 backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-[var(--theme-warning)] text-[var(--theme-warning)]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[var(--theme-fg-muted)] mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[var(--theme-accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--theme-accent)]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--theme-fg)]">{t.name}</p>
                    <p className="text-xs text-[var(--theme-fg-subtle)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">Ready to Create?</h2>
          <p className="mt-4 text-lg text-[var(--theme-fg-muted)]">
            Join thousands of creators and start generating amazing art today. Free credits on signup.
          </p>
          <Link
            href="/generate"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-8 py-4 text-base font-medium text-white shadow-[var(--theme-shadow-glow)] hover:bg-[var(--theme-accent-hover)] transition-all"
          >
            <Sparkles className="h-5 w-5" />
            Start Creating for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  );
}
