import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealText, Stagger, StaggerItem, IsoGrid, CONTAINER } from "../motion";
import { ProofGlyph, DidGlyph, ShariaGlyph } from "./art/FeatureGlyphs";

const FEATURES = [
  {
    glyph: ProofGlyph,
    label: "Cryptographic Privacy",
    title: "Zero-Knowledge Proofs",
    desc: "Groth16 zk-SNARKs let mustahik prove eligibility without revealing income, assets, or personal data. Private witness never leaves the device.",
  },
  {
    glyph: DidGlyph,
    label: "Self-Sovereign Identity",
    title: "W3C DID Standards",
    desc: "Decentralized Identifiers conforming to the W3C DID Core specification. No central authority. Full key rotation and deactivation support.",
  },
  {
    glyph: ShariaGlyph,
    label: "Maqasid al-Shariah",
    title: "Sharia-aligned",
    desc: "Designed around the protection of nafs and mal. Fiat-to-IDRX architecture avoids riba. Nisab thresholds encoded as verifiable predicates.",
  },
];

export function FeaturesSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden border-b border-line py-20 md:py-24" aria-labelledby="features-heading">
      <IsoGrid color="#DDE5DF" cy="45%" />
      <div className={`${CONTAINER} relative`}>
        <Reveal className="mb-12 md:mb-14">
          <p className="mb-5 inline-flex items-center gap-2.5 text-[15px] font-medium text-accent">
            <span className="size-[7px] rounded-full bg-accent" aria-hidden="true" />
            Core Architecture
          </p>
          <span id="features-heading" className="block">
            <RevealText
              as="h2"
              text="Built on Cryptographic Truth"
              className="max-w-[16ch] text-[clamp(30px,4.2vw,46px)] font-medium leading-[1.06] tracking-[-0.03em] text-ink lg:max-w-none"
            />
          </span>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-3" step={0.1}>
          {FEATURES.map(({ glyph: Glyph, label, title, desc }) => (
            <StaggerItem key={title}>
              <motion.article
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="h-full rounded-2xl border border-line bg-paper p-7 transition-colors duration-200 hover:border-accent/40"
              >
                <div className="mb-5 flex h-24 w-24 items-center justify-center" aria-hidden="true">
                  <Glyph className="h-24 w-24" />
                </div>
                <p className="mb-2 text-[13px] font-medium tracking-[0.08em] uppercase text-accent">{label}</p>
                <h3 className="mb-3 text-xl font-medium tracking-[-0.02em] text-ink">{title}</h3>
                <p className="text-[15px] leading-[1.6] text-muted">{desc}</p>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
