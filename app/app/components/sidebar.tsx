"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Settings,
  Palette,
  Globe,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage, type Language } from "@/providers/language-provider";
import { useAuth } from "@/providers/auth-provider";
import { themePresets } from "@/lib/themes";

const languages: [Language, string, string][] = [
  ["en", "English", "EN"],
  ["es", "Español", "ES"],
  ["fr", "Français", "FR"],
  ["de", "Deutsch", "DE"],
  ["ja", "日本語", "JA"],
  ["ko", "한국어", "KO"],
  ["zh", "中文", "ZH"],
  ["ar", "العربية", "AR"],
  ["hi", "हिन्दी", "HI"],
  ["pt", "Português", "PT"],
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { theme, currentTheme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--theme-fg-muted)] hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-fg)] transition-colors"
        aria-label="Open settings"
      >
        <Settings className="h-[18px] w-[18px]" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-[340px] max-w-[90vw] border-l border-[var(--theme-border)] bg-[var(--theme-bg)] shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/80 backdrop-blur-md px-5 py-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-[var(--theme-fg-muted)]" />
                <span className="text-sm font-semibold">Settings</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--theme-fg-muted)] hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-fg)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-8">
              {/* User Section */}
              {user && (
                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] font-semibold text-sm">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-[var(--theme-fg-muted)]">
                        {user.credits} credits
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-bg-elevated)] py-2 text-xs font-medium text-[var(--theme-fg)] hover:bg-[var(--theme-surface-hover)] transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-bg-elevated)] py-2 text-xs font-medium text-[var(--theme-danger)] hover:bg-[var(--theme-danger)]/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Theme */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--theme-fg-muted)]">
                  <Palette className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Appearance</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {themePresets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                        currentTheme === t.id
                          ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)]/30"
                          : "border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-[var(--theme-accent)]/20"
                      }`}
                    >
                      <div
                        className="h-6 w-6 shrink-0 rounded-full border border-white/10"
                        style={{ background: `linear-gradient(135deg, ${t.colors.accent}, ${t.colors.accentHover})` }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{t.name}</p>
                        <p className="text-[10px] text-[var(--theme-fg-subtle)] truncate">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--theme-fg-muted)]">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Language</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map(([code, name, abbr]) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                        lang === code
                          ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)]/30 text-[var(--theme-accent)]"
                          : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-fg)] hover:border-[var(--theme-accent)]/20"
                      }`}
                    >
                      <span className="text-xs font-medium">{name}</span>
                      <span className="text-[10px] text-[var(--theme-fg-subtle)]">{abbr}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--theme-fg-muted)] mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Legal</span>
                </div>
                {[
                  ["About", "/about"],
                  ["Privacy", "/privacy"],
                  ["Terms", "/terms"],
                  ["Contact", "/contact"],
                ].map(([label, href]) => (
                  <Link
                    key={href as string}
                    href={href as string}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--theme-fg-muted)] hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-fg)] transition-colors"
                  >
                    {label}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
