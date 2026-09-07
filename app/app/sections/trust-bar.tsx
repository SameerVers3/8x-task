"use client";

import { motion } from "framer-motion";

const CREATORS = [
  "Stellaaa",
  "L10n_H34r7",
  "fortylove",
  "Pinkielicious",
  "PaperbackLion",
  "Veilance",
  "CreativeEdge",
  "ArtifyAI",
  "FML2",
  "eduardo_saffe",
  "OneViolentGentleman",
  "Rohanda",
  "Mazz_W",
  "Imperativ",
  "highCastle",
  "Tommu",
  "AkiAICreator",
  "Asto556",
  "impossiblebearcl4060",
  "SomeT",
  "Stu42",
  "OrlandoOrso",
  "Ocean3",
  "UnstableGen",
  "a2957598",
  "Dever",
  "Entersandman",
  "Adel_AI",
  "doberman1987",
  "FallenIncursio",
  "4ndr3w",
  "DarkirStorm",
  "freek22",
  "popyay",
  "DreamCk",
  "EcstaticKalliope",
  "invioai",
  "7Zack",
  "gonzalu",
  "Elioplasma",
  "Hizumi___",
  "Ajuro",
  "tent44",
  "matasvolkovas350",
  "SOVONOY",
];

export function TrustBar() {
  return (
    <section
      className="relative overflow-hidden border-y border-[var(--border-subtle)]"
      style={{ background: "var(--bg-elevated)" }}
    >
      <div className="py-10 md:py-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]"
        >
          Trusted by creators at
        </motion.p>

        {/* Marquee */}
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee items-center gap-12 px-6 md:gap-16">
            {[...CREATORS, ...CREATORS].map((name, i) => (
              <span
                key={i}
                className="shrink-0 whitespace-nowrap text-sm font-semibold text-[var(--text-secondary)] opacity-50 transition-opacity duration-200 hover:opacity-100"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="flex animate-marquee items-center gap-12 px-6 md:gap-16" aria-hidden="true">
            {[...CREATORS, ...CREATORS].map((name, i) => (
              <span
                key={i}
                className="shrink-0 whitespace-nowrap text-sm font-semibold text-[var(--text-secondary)] opacity-50 transition-opacity duration-200 hover:opacity-100"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
