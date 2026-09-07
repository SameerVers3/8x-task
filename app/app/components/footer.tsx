"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Twitter,
  Github,
  Instagram,
  Youtube,
  Mail,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "nav.generate", href: "/generate" },
      { label: "nav.history", href: "/history" },
      { label: "nav.pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "footer.about", href: "/about" },
      { label: "footer.contact", href: "/contact" },
      { label: "footer.faq", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "footer.privacy", href: "/privacy" },
      { label: "footer.terms", href: "/terms" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "https://twitter.com/8xai", label: "Twitter" },
  { icon: Github, href: "https://github.com/8xai", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/8xai", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@8xai", label: "YouTube" },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-auto border-t border-[var(--theme-border)] bg-[var(--theme-bg-elevated)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--theme-accent)] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">
                8<span className="text-[var(--theme-accent)]">x</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--theme-fg-muted)] leading-relaxed max-w-xs">
              Create breathtaking images and videos with AI. No expertise needed.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-surface)] text-[var(--theme-fg-muted)] hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-accent)] transition-colors"
                    aria-label={s.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-[var(--theme-fg)] mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--theme-fg-muted)] hover:text-[var(--theme-accent)] transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-glass)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--theme-fg)]">
                Stay in the loop
              </h3>
              <p className="text-sm text-[var(--theme-fg-muted)] mt-1">
                Get the latest AI art tips and feature updates.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] px-4 py-2.5 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
              />
              <button className="flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors">
                <Mail className="h-4 w-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--theme-fg-subtle)]">
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-[var(--theme-danger)]" /> by 8x
          </p>
          <p> 2024 8x Creative AI. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
