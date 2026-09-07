"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const CARD_IMAGES = [
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/81f8e626-a822-4815-b8be-361ff65b0d88/original=true/81f8e626-a822-4815-b8be-361ff65b0d88.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a6f968b2-1220-422d-a618-ac1e938ffa62/original=true/a6f968b2-1220-422d-a618-ac1e938ffa62.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg", w: 1400, h: 2046 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4e27f2b8-68b2-4eec-9912-07c2468cfc4b/original=true/4e27f2b8-68b2-4eec-9912-07c2468cfc4b.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg", w: 1920, h: 2560 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/402ed7f8-ba25-421d-a68a-b11ae31af91f/original=true/402ed7f8-ba25-421d-a68a-b11ae31af91f.jpeg", w: 450, h: 800 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4c0ccb9b-8426-4e33-b4fe-bbca293efc32/original=true/4c0ccb9b-8426-4e33-b4fe-bbca293efc32.jpeg", w: 1440, h: 2880 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c53c6b0f-ab0f-4970-8911-b9bfd66e6f21/original=true/c53c6b0f-ab0f-4970-8911-b9bfd66e6f21.jpeg", w: 768, h: 1280 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fd4e0f10-aa6f-42f5-8bc0-5dba35ad2a13/original=true/fd4e0f10-aa6f-42f5-8bc0-5dba35ad2a13.jpeg", w: 1024, h: 1536 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc6700f4-7fd3-4fc8-84ce-dcb154161850/original=true/bc6700f4-7fd3-4fc8-84ce-dcb154161850.jpeg", w: 1080, h: 1680 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ab2daea7-2269-436b-acad-e6c73ee8af83/original=true/ab2daea7-2269-436b-acad-e6c73ee8af83.jpeg", w: 720, h: 1280 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/afcab5fa-e580-489a-9ea8-bca23534be08/original=true/afcab5fa-e580-489a-9ea8-bca23534be08.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/5be4f7eb-7618-406e-8889-0abc966bf4f0/original=true/5be4f7eb-7618-406e-8889-0abc966bf4f0.jpeg", w: 2304, h: 3456 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d57e4d81-eac9-40ed-9054-1d3b82a24f49/original=true/d57e4d81-eac9-40ed-9054-1d3b82a24f49.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9f50cbc3-98f4-4eb1-8bf6-34b40b30ad41/original=true/9f50cbc3-98f4-4eb1-8bf6-34b40b30ad41.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c0ea2c31-2551-46b4-95e4-6c3ca52a0204/original=true/c0ea2c31-2551-46b4-95e4-6c3ca52a0204.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a4d25013-1fb5-4610-8610-07a466ab2627/original=true/a4d25013-1fb5-4610-8610-07a466ab2627.jpeg", w: 1024, h: 1536 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/003eb0b8-e848-4c10-aa34-54f4f420602e/original=true/003eb0b8-e848-4c10-aa34-54f4f420602e.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a103c4ba-ee8c-47b8-a649-5eed4e16efb8/original=true/a103c4ba-ee8c-47b8-a649-5eed4e16efb8.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc6061bd-5bae-408a-9718-84232693d223/original=true/bc6061bd-5bae-408a-9718-84232693d223.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0b977657-c60e-4a6d-9ffa-b81d3e90fa37/original=true/0b977657-c60e-4a6d-9ffa-b81d3e90fa37.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ac371696-874f-4bbb-a6ed-5f7a5bd3ae62/original=true/ac371696-874f-4bbb-a6ed-5f7a5bd3ae62.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2eb7f731-4136-4295-a0f4-9e140c3a6c96/original=true/2eb7f731-4136-4295-a0f4-9e140c3a6c96.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/18530b55-dc8d-4320-a7d0-97c9dc613bc5/original=true/18530b55-dc8d-4320-a7d0-97c9dc613bc5.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/26cfd41c-7ced-4c28-839e-99c0498d05ea/original=true/26cfd41c-7ced-4c28-839e-99c0498d05ea.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/877f082b-3bc4-4b6d-976f-3980bfd0f62b/original=true/877f082b-3bc4-4b6d-976f-3980bfd0f62b.jpeg", w: 1664, h: 2432 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ebebea37-2512-47b9-a171-b79f5fc5b91f/original=true/ebebea37-2512-47b9-a171-b79f5fc5b91f.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/63171c8d-6b31-41e3-ad6f-6b1052dcaf55/original=true/63171c8d-6b31-41e3-ad6f-6b1052dcaf55.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6fcaf10d-d444-489e-9fe2-a945fbbd6cc3/original=true/6fcaf10d-d444-489e-9fe2-a945fbbd6cc3.jpeg", w: 896, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0537ea36-62dd-4aab-8884-6da0e928e303/original=true/0537ea36-62dd-4aab-8884-6da0e928e303.jpeg", w: 1248, h: 1824 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fb38a219-28f9-467d-b1e5-e51c650cbdd4/original=true/fb38a219-28f9-467d-b1e5-e51c650cbdd4.jpeg", w: 1792, h: 2304 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/18612c96-c21c-4bd7-aef0-21b9b57f4b7e/original=true/18612c96-c21c-4bd7-aef0-21b9b57f4b7e.jpeg", w: 1792, h: 2304 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3723815a-6877-4f9b-a485-4680f9e360b1/original=true/3723815a-6877-4f9b-a485-4680f9e360b1.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9488af10-7f1f-4361-877b-d9cfafeab131/original=true/9488af10-7f1f-4361-877b-d9cfafeab131.jpeg", w: 768, h: 1344 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d7b48ab2-4d80-4d72-859c-5e2d0533cf28/original=true/d7b48ab2-4d80-4d72-859c-5e2d0533cf28.jpeg", w: 768, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4cea4d6e-8cfe-4f68-ac9b-69a441f5d8f2/original=true/4cea4d6e-8cfe-4f68-ac9b-69a441f5d8f2.jpeg", w: 1152, h: 1728 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/680922a8-d5bd-4cd7-836d-eb6ae1042b8e/original=true/680922a8-d5bd-4cd7-836d-eb6ae1042b8e.jpeg", w: 1248, h: 1824 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f0aba37-7625-4158-8824-e7c2f4b1c337/original=true/0f0aba37-7625-4158-8824-e7c2f4b1c337.jpeg", w: 3328, h: 4864 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0a828b7f-26e5-4b34-9249-473ba586edca/original=true/0a828b7f-26e5-4b34-9249-473ba586edca.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b2aed23d-92ee-4ff9-88a2-386685d51d99/original=true/b2aed23d-92ee-4ff9-88a2-386685d51d99.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c52d4c1e-bd3d-4c8f-9b21-6556bd60a5d6/original=true/c52d4c1e-bd3d-4c8f-9b21-6556bd60a5d6.jpeg", w: 832, h: 1216 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d22517b4-93a6-4775-b7d2-bed18b96ebb7/original=true/d22517b4-93a6-4775-b7d2-bed18b96ebb7.jpeg", w: 1024, h: 1536 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3bcae6ac-9141-489b-8e14-81954a9e8e76/original=true/3bcae6ac-9141-489b-8e14-81954a9e8e76.jpeg", w: 1536, h: 2048 },
];

// Pre-computed positions so they are stable across renders (grid scattered across the section)
const CARD_POSITIONS = [
  { left: "2%", top: "5%", w: 140, h: 200, rotate: -8, delay: 0 },
  { left: "85%", top: "8%", w: 120, h: 170, rotate: 12, delay: 0.3 },
  { left: "12%", top: "30%", w: 160, h: 230, rotate: 5, delay: 0.6 },
  { left: "75%", top: "25%", w: 130, h: 190, rotate: -6, delay: 0.9 },
  { left: "88%", top: "55%", w: 150, h: 210, rotate: 8, delay: 1.2 },
  { left: "5%", top: "60%", w: 135, h: 195, rotate: -10, delay: 1.5 },
  { left: "20%", top: "75%", w: 145, h: 205, rotate: 4, delay: 1.8 },
  { left: "70%", top: "80%", w: 125, h: 180, rotate: -5, delay: 2.1 },
  { left: "45%", top: "5%", w: 110, h: 160, rotate: 7, delay: 0.4 },
  { left: "55%", top: "85%", w: 140, h: 200, rotate: -3, delay: 0.7 },
  { left: "30%", top: "15%", w: 100, h: 145, rotate: 15, delay: 1.0 },
  { left: "60%", top: "40%", w: 115, h: 165, rotate: -12, delay: 1.3 },
  { left: "35%", top: "50%", w: 130, h: 185, rotate: 6, delay: 1.6 },
  { left: "8%", top: "45%", w: 105, h: 150, rotate: -7, delay: 1.9 },
  { left: "92%", top: "35%", w: 120, h: 170, rotate: 9, delay: 2.2 },
  { left: "50%", top: "65%", w: 110, h: 155, rotate: -4, delay: 2.5 },
  { left: "15%", top: "85%", w: 100, h: 140, rotate: 11, delay: 0.2 },
  { left: "80%", top: "70%", w: 135, h: 190, rotate: -9, delay: 0.5 },
  { left: "40%", top: "35%", w: 95, h: 135, rotate: 3, delay: 0.8 },
  { left: "65%", top: "10%", w: 125, h: 175, rotate: -11, delay: 1.1 },
  { left: "25%", top: "55%", w: 115, h: 165, rotate: 10, delay: 1.4 },
  { left: "78%", top: "45%", w: 100, h: 145, rotate: -2, delay: 1.7 },
  { left: "48%", top: "20%", w: 90, h: 130, rotate: 13, delay: 2.0 },
  { left: "5%", top: "15%", w: 110, h: 155, rotate: -14, delay: 2.3 },
  { left: "95%", top: "75%", w: 105, h: 150, rotate: 5, delay: 2.6 },
  { left: "58%", top: "60%", w: 95, h: 135, rotate: -8, delay: 2.9 },
  { left: "33%", top: "80%", w: 120, h: 170, rotate: 7, delay: 3.2 },
  { left: "68%", top: "28%", w: 100, h: 140, rotate: -6, delay: 3.5 },
  { left: "18%", top: "40%", w: 90, h: 130, rotate: 14, delay: 3.8 },
  { left: "42%", top: "70%", w: 110, h: 155, rotate: -3, delay: 4.1 },
  { left: "90%", top: "90%", w: 85, h: 120, rotate: 11, delay: 4.4 },
  { left: "55%", top: "48%", w: 80, h: 115, rotate: -13, delay: 4.7 },
  { left: "10%", top: "78%", w: 100, h: 145, rotate: 2, delay: 5.0 },
  { left: "72%", top: "62%", w: 95, h: 135, rotate: -10, delay: 5.3 },
  { left: "38%", top: "42%", w: 85, h: 120, rotate: 8, delay: 5.6 },
  { left: "22%", top: "22%", w: 105, h: 150, rotate: -5, delay: 5.9 },
  { left: "62%", top: "75%", w: 90, h: 130, rotate: 12, delay: 6.2 },
  { left: "82%", top: "18%", w: 100, h: 140, rotate: -7, delay: 6.5 },
  { left: "45%", top: "88%", w: 95, h: 135, rotate: 4, delay: 6.8 },
  { left: "15%", top: "68%", w: 85, h: 120, rotate: -11, delay: 7.1 },
  { left: "52%", top: "30%", w: 110, h: 155, rotate: 9, delay: 7.4 },
  { left: "28%", top: "92%", w: 100, h: 145, rotate: -1, delay: 7.7 },
  { left: "88%", top: "88%", w: 90, h: 130, rotate: 6, delay: 8.0 },
  { left: "8%", top: "92%", w: 95, h: 135, rotate: -15, delay: 8.3 },
  { left: "75%", top: "92%", w: 85, h: 120, rotate: 3, delay: 8.6 },
];

function CtaCardBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll("video").forEach((v) => {
              v.play().catch(() => {});
            });
          } else {
            container.querySelectorAll("video").forEach((v) => {
              v.pause();
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {CARD_POSITIONS.map((pos, i) => {
        const img = CARD_IMAGES[i % CARD_IMAGES.length];
        return (
          <motion.div
            key={i}
            className="absolute rounded-xl border border-white/[0.06] shadow-lg overflow-hidden"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.w,
              height: pos.h,
              transform: `rotate(${pos.rotate}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: pos.delay * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="200px"
            />
          </motion.div>
        );
      })}

      {/* Radial gradient scrim — fades cards out toward center */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(3,3,4,0.96) 0%, rgba(3,3,4,0.85) 35%, rgba(3,3,4,0.6) 65%, rgba(3,3,4,0.3) 100%)`,
        }}
      />

      {/* Center blur — softens cards behind the text, sits above all cards */}
      <div
        className="pointer-events-none absolute inset-0 z-[20]"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          maskImage: "radial-gradient(ellipse 50% 45% at 50% 50%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 45% at 50% 50%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-16 md:py-40">
      <CtaCardBackground />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[30] mx-auto max-w-3xl text-center"
      >
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
          Ready to bring your
          <br />
          imagination to life?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          Join thousands of creators. Start generating stunning images and videos today — free credits on signup.
        </p>
        <Link
          href="/generate"
          className="mt-8 inline-flex items-center gap-2 rounded-[12px] px-8 py-4 text-base font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
          style={{ background: "var(--accent-gradient)" }}
        >
          <Sparkles className="h-5 w-5" />
          Start Creating for Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
