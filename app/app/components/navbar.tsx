"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  User,
  LogIn,
  LogOut,
  Coins,
  Menu,
  X,
  Home,
  CreditCard,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { Sidebar } from "./sidebar";

const navLinks = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/generate", label: "nav.generate", icon: Wand2 },
  { href: "/history", label: "nav.history", icon: History, auth: true },
  { href: "/pricing", label: "nav.pricing", icon: CreditCard },
];

export function Navbar() {
  const { user, isLoading, logout, setIsAuthModalOpen } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`mx-3 mt-3 rounded-2xl px-4 py-3 transition-all duration-200 md:mx-6 md:px-6 ${
          scrolled
            ? "border-b border-[var(--border-subtle)] bg-[rgba(3,3,4,0.72)] backdrop-blur-[20px]"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
              Fluid
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !user) return null;
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-[var(--accent-solid)] bg-[var(--accent-muted)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-fill-hover)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t(link.label)}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg bg-[var(--accent-muted)] -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--accent-muted)] px-3 py-1.5 text-xs font-medium text-[var(--accent-solid)]">
                <Coins className="h-3.5 w-3.5" />
                {user.credits}
              </div>
            )}

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-elevated-2)] hover:bg-[var(--glass-fill-hover)] transition-colors"
                >
                  <User className="h-4 w-4 text-[var(--text-secondary)]" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--accent-solid)] px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>{t("nav.signin")}</span>
              </button>
            )}

            <Sidebar />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg md:hidden text-[var(--text-secondary)]"
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
            className="mx-3 mt-2 rounded-xl border border-[var(--border-subtle)] p-4 md:hidden"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px) saturate(140%)" }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                if (link.auth && !user) return null;
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[var(--accent-solid)] bg-[var(--accent-muted)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-fill-hover)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(link.label)}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-[var(--border-subtle)]" />
              {user && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)]">
                    <Coins className="h-4 w-4" />
                    {user.credits} {t("nav.credits")}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--danger)] hover:bg-[var(--glass-fill-hover)] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.signout")}
                  </button>
                </>
              )}
              {!user && (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--accent-solid)] hover:bg-[var(--accent-muted)] transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  {t("nav.signin")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
