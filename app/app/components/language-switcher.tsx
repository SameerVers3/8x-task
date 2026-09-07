"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage, Language } from "@/providers/language-provider";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "" },
  { code: "es", label: "Español", flag: "" },
  { code: "fr", label: "Français", flag: "" },
  { code: "de", label: "Deutsch", flag: "" },
  { code: "ja", label: "日本語", flag: "" },
  { code: "ko", label: "한국어", flag: "" },
  { code: "zh", label: "中文", flag: "" },
  { code: "ar", label: "العربية", flag: "" },
  { code: "hi", label: "हिन्दी", flag: "" },
  { code: "pt", label: "Português", flag: "" },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] transition-colors text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)]"
        title={t("lang.title")}
      >
        <Globe className="h-4 w-4" />
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
              className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-2 shadow-[var(--theme-shadow-lg)]"
            >
              <p className="mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                {t("lang.title")}
              </p>
              <div className="flex flex-col gap-0.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                      lang === l.code
                        ? "bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                        : "text-[var(--theme-fg-muted)] hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-fg)]"
                    }`}
                  >
                    <span className="font-medium w-6 text-center">{l.code.toUpperCase()}</span>
                    <span className="flex-1">{l.label}</span>
                    {lang === l.code && <Check className="h-3.5 w-3.5 shrink-0" />}
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
