"use client";

import { ProvidersWrapper } from "./providers-wrapper";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AuthModal } from "./auth-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProvidersWrapper>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <AuthModal />
      </div>
    </ProvidersWrapper>
  );
}
