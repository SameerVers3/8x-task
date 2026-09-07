"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// TODO: Replace with real FAQ content once verified by the team
const FAQ_ITEMS = [
  {
    question: "What is Fluid and how does it work?",
    answer: "Fluid is an AI-powered creative platform that lets you generate images and videos from text descriptions. Simply type what you want to see, choose a model and style, and Fluid generates it in seconds using state-of-the-art diffusion models.",
  },
  {
    question: "Do I need to sign up to use Fluid?",
    answer: "No. You can start generating images immediately without creating an account. However, signing up gives you 50 free credits, access to your creation history, and the ability to use higher-quality models.",
  },
  {
    question: "How does the credit system work?",
    answer: "Each generation costs a certain number of credits depending on the model and output quality. Standard image generation typically costs 2–5 credits. Video generation costs more. Credits are deducted only when a generation succeeds — if it fails, you get an automatic refund.",
  },
  {
    question: "What models are available?",
    answer: "Fluid supports multiple image models including Flux Dev, Flux Schnell, and SDXL. For video, we offer Fluid Video. You can also use style presets, upscaling, and inpainting tools. New models are added regularly.",
  },
  {
    question: "Can I use the generated content commercially?",
    answer: "{{PLACEHOLDER}} — Commercial usage terms depend on the specific model and subscription tier. Please review our Terms of Service for detailed licensing information.",
  },
  {
    question: "How do I get more credits?",
    answer: "You can upgrade to a paid plan (Creator or Pro) for monthly credits, or purchase credit packs that never expire. Enterprise plans offer unlimited credits with custom SLAs.",
  },
];

function FaqItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[var(--text-primary)]"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)]">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[720px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]">
            FAQ
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
