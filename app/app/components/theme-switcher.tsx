"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage } from "@/providers/language-provider";
import { themePresets } from "@/lib/themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] transition-colors text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)]"
        title={t("theme.title")}
      >
        <Palette className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-3 shadow-[var(--theme-shadow-lg)]"
            >
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                {t("theme.title")}
              </p>
              <div className="flex flex-col gap-1">
                {themePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setTheme(preset.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                      theme.id === preset.id
                        ? "bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                        : "text-[var(--theme-fg-muted)] hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-fg)]"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full shrink-0 border border-[var(--theme-border)]"
                      style={{ background: preset.colors.accent }}
                    />
                    <span className="flex-1 truncate">
                      {preset.name}
                    </span>
                    {theme.id === preset.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
