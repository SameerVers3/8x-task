"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  History,
  User,
  LogIn,
  LogOut,
  Coins,
  Menu,
  X,
  Home,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";

const navLinks = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/generate", label: "nav.generate", icon: Sparkles },
  { href: "/history", label: "nav.history", icon: History },
  { href: "/pricing", label: "nav.pricing", icon: CreditCard },
];

export function Navbar() {
  const { user, isLoading, logout, setIsAuthModalOpen } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass-strong mx-3 mt-3 rounded-2xl px-4 py-3 md:mx-6 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--theme-accent)] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              8<span className="text-[var(--theme-accent)]">x</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[var(--theme-accent)] bg-[var(--theme-accent-muted)]"
                      : "text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)] hover:bg-[var(--theme-surface-hover)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t(link.label)}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg bg-[var(--theme-accent-muted)] -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>

            {user && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--theme-accent-muted)] px-3 py-1.5 text-xs font-medium text-[var(--theme-accent)]">
                <Coins className="h-3.5 w-3.5" />
                {user.credits} {t("nav.credits")}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] transition-colors"
                >
                  <User className="h-4 w-4" />
                </Link>
                <button
                  onClick={logout}
                  className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-[var(--theme-fg-muted)] hover:text-[var(--theme-danger)] hover:bg-[var(--theme-surface-hover)] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.signin")}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg md:hidden text-[var(--theme-fg-muted)]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass mx-3 mt-2 rounded-xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[var(--theme-accent)] bg-[var(--theme-accent-muted)]"
                        : "text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)] hover:bg-[var(--theme-surface-hover)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(link.label)}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-[var(--theme-border)]" />
              <div className="flex items-center gap-2 px-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
              {user && (
                <>
                  <div className="my-2 h-px bg-[var(--theme-border)]" />
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--theme-fg-muted)]">
                    <Coins className="h-4 w-4" />
                    {user.credits} {t("nav.credits")}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--theme-danger)] hover:bg-[var(--theme-surface-hover)] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.signout")}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
