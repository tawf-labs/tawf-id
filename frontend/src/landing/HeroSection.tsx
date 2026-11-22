import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, Magnetic, HeroStage, DrawnUnderline, IsoGrid, CONTAINER } from "../motion";
import CredentialGateArt from "./art/CredentialGateArt";

/* Hero: glaze band, copy left, art right, copy above the art on phones. */
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-glaze pb-12 md:pb-16">
      <IsoGrid color="#C3D3CA" cy="55%" />
      <div className={`${CONTAINER} relative`}>
        <div className="grid min-h-[85svh] items-center gap-10 py-10 pt-28 md:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:pt-36">
          <Reveal className="text-center lg:text-left">
            <p className="mb-6 inline-flex items-center gap-2.5 text-[15px] font-medium text-accent">
              <span className="size-[7px] rounded-full bg-accent" aria-hidden="true" />
              ZK-DID Protocol · Base Sepolia
            </p>

            <Reveal blur y={26}>
              <h1 className="mx-auto max-w-[15.5em] text-[clamp(34px,5.2vw,64px)] font-medium leading-[1.06] tracking-[-0.035em] text-balance text-ink lg:mx-0">
                Privacy-Preserving <DrawnUnderline>Identity</DrawnUnderline> for Zakat Recipients
              </h1>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mx-auto mt-6 max-w-[34em] text-[clamp(16px,1.4vw,18.5px)] leading-[1.6] text-muted lg:mx-0">
                tawf-did integrates zero-knowledge proof systems with W3C Decentralized Identifier standards,
                enabling cryptographic verification of mustahik eligibility without disclosing personal
                attributes or financial records.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
                <Magnetic>
                <Link
                  to="/claim"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-glaze"
                >
                  <span>Claim Identity</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                </Magnetic>
                <Link
                  to="/about"
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-line bg-paper/90 px-6 text-[15px] font-medium text-ink backdrop-blur-xs transition-colors duration-200 hover:border-ink hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-glaze"
                >
                  Read the Protocol
                </Link>
              </div>
            </Reveal>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto w-full max-w-[620px] lg:mt-0 lg:max-w-none">
            <HeroStage>
              <CredentialGateArt className="w-full" />
            </HeroStage>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
