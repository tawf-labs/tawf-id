import { Link } from "react-router-dom";
import { DidGlyph } from "./art/FeatureGlyphs";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealText, Magnetic, TurningPattern, CONTAINER } from "../motion";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-stone py-20 md:py-24" aria-labelledby="cta-heading">
      <TurningPattern />
      <div className={`${CONTAINER} relative z-10 max-w-3xl text-center`}>
        <Reveal>
          <DidGlyph className="mx-auto mb-4 h-20 w-20" />
          <p className="mb-5 inline-flex items-center justify-center gap-2.5 text-[15px] font-medium text-accent">
            <span className="size-[7px] rounded-full bg-accent" aria-hidden="true" />
            The Identity Layer for ZISWAF
          </p>
          <span id="cta-heading" className="block">
            <RevealText
              as="h2"
              text="Dignity through cryptography. Not as promises, as on-chain reality."
              className="mx-auto max-w-[26ch] text-[clamp(30px,4.4vw,50px)] font-medium leading-[1.08] tracking-[-0.03em] text-balance text-ink"
            />
          </span>
          <p className="mx-auto mt-6 max-w-[46em] text-[17px] leading-[1.6] text-muted">
            tawf-did will power identity verification across ziswaf.tawf.foundation, giving every mustahik a
            self-sovereign, privacy-preserving credential that satisfies both Sharia requirements and
            cryptographic soundness.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Magnetic>
            <Link
              to="/claim"
              className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone"
            >
              <span>Get Your DID</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            </Magnetic>
            <Link
              to="/how-it-works"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-line bg-paper px-6 text-[15px] font-medium text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone"
            >
              See How It Works
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
