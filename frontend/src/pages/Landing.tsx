import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Network, HeartHandshake, ArrowRight } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

// For scroll-triggered sections (below fold)
const fadeUpView = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

const FEATURES = [
  {
    icon: Shield,
    label: "Cryptographic Privacy",
    title: "Zero-Knowledge Proofs",
    desc: "Groth16 zk-SNARKs let mustahik prove eligibility without revealing income, assets, or personal data. Private witness never leaves the device.",
  },
  {
    icon: Network,
    label: "Self-Sovereign Identity",
    title: "W3C DID Standards",
    desc: "Decentralized Identifiers conforming to the W3C DID Core specification. No central authority. Full key rotation and deactivation support.",
  },
  {
    icon: HeartHandshake,
    label: "Maqasid al-Shariah",
    title: "Sharia-Compliant",
    desc: "Designed around the protection of nafs and mal. Fiat-to-IDRX architecture avoids riba. Nisab thresholds encoded as verifiable predicates.",
  },
];

const STATS = [
  { value: "5", label: "Protocol Actors" },
  { value: "3", label: "Smart Contracts" },
  { value: "Groth16", label: "Proof System" },
  { value: "Base", label: "Sepolia Network" },
];

export function Landing() {
  const reduced = useReducedMotion();
  const anim = (delay = 0) =>
    reduced
      ? { initial: {}, animate: {}, transition: {} }
      : fadeUp(delay);
  const animView = (delay = 0) =>
    reduced
      ? { initial: {}, whileInView: {}, viewport: { once: true }, transition: {} }
      : fadeUpView(delay);

  return (
    <div style={{ background: "var(--color-tawf-sand)" }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Decorative circles */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {[600, 900, 1200].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                top: "50%",
                right: "-10%",
                transform: "translateY(-50%)",
                borderColor: `color-mix(in srgb, var(--color-tawf-green) ${3 - i}%, transparent)`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <motion.p
              {...anim(0)}
              className="text-xs tracking-widest uppercase mb-6 font-medium"
              style={{ color: "var(--color-tawf-gold)" }}
            >
              ZK-DID Protocol · Base Sepolia
            </motion.p>
            <motion.h1
              {...anim(0.1)}
              className="text-5xl md:text-6xl font-light leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)", textWrap: "balance" }}
            >
              Privacy-Preserving Identity for Zakat Recipients
            </motion.h1>
            <motion.p
              {...anim(0.2)}
              className="text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: "var(--color-tawf-muted)" }}
            >
              tawf-did integrates zero-knowledge proof systems with W3C Decentralized Identifier standards — enabling cryptographic verification of mustahik eligibility without disclosing personal attributes or financial records.
            </motion.p>
            <motion.div {...anim(0.3)} className="flex flex-wrap gap-4">
              <Link
                to="/claim"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
                style={{
                  background: "var(--color-tawf-green)",
                  color: "var(--color-tawf-sand)",
                  borderRadius: "var(--radius-button)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-tawf-green-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-tawf-green)")}
              >
                Claim Identity <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase font-medium border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
                style={{
                  borderColor: "var(--color-tawf-green)",
                  color: "var(--color-tawf-green)",
                  borderRadius: "var(--radius-button)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-tawf-green)";
                  e.currentTarget.style.color = "var(--color-tawf-sand)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-tawf-green)";
                }}
              >
                Read the Protocol
              </Link>
            </motion.div>
          </div>

          {/* Right: abstract ZK diagram */}
          <motion.div {...anim(0.2)} className="hidden md:flex justify-center">
            <div className="relative w-80 h-80">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "color-mix(in srgb, var(--color-tawf-green) 15%, transparent)" }}
              />
              {/* Middle ring */}
              <div
                className="absolute inset-8 rounded-full border"
                style={{ borderColor: "color-mix(in srgb, var(--color-tawf-gold) 30%, transparent)" }}
              />
              {/* Center */}
              <div
                className="absolute inset-16 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-tawf-green)" }}
              >
                <span
                  className="text-3xl font-light"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-gold)" }}
                >
                  π
                </span>
              </div>
              {/* Orbit labels */}
              {[
                { label: "Prover", angle: 0 },
                { label: "Verifier", angle: 120 },
                { label: "DID Registry", angle: 240 },
              ].map(({ label, angle }) => {
                const rad = (angle * Math.PI) / 180;
                const r = 148;
                const x = 160 + r * Math.cos(rad);
                const y = 160 + r * Math.sin(rad);
                return (
                  <div
                    key={label}
                    className="absolute text-xs tracking-wider uppercase font-medium px-2 py-1 rounded"
                    style={{
                      left: x,
                      top: y,
                      transform: "translate(-50%, -50%)",
                      background: "var(--color-tawf-sand)",
                      color: "var(--color-tawf-green)",
                      border: "1px solid color-mix(in srgb, var(--color-tawf-green) 15%, transparent)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        aria-label="Protocol statistics"
        style={{ background: "var(--color-tawf-green)" }}
        className="py-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, i) => (
              <motion.div key={label} {...animView(i * 0.08)} className="text-center">
                <dt
                  className="text-3xl font-light mb-1"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-gold)" }}
                >
                  {value}
                </dt>
                <dd className="text-xs tracking-widest uppercase" style={{ color: "rgba(249,246,240,0.6)" }}>
                  {label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...animView()} className="text-center mb-16">
            <p
              className="text-xs tracking-widest uppercase mb-4 font-medium"
              style={{ color: "var(--color-tawf-gold)" }}
            >
              Core Architecture
            </p>
            <h2
              id="features-heading"
              className="text-4xl font-light"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)", textWrap: "balance" }}
            >
              Built on Cryptographic Truth
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, label, title, desc }, i) => (
              <motion.article
                key={title}
                {...animView(i * 0.1)}
                className="p-8 rounded-2xl border"
                style={{
                  background: "var(--color-tawf-white)",
                  borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "var(--color-tawf-sand)" }}
                >
                  <Icon size={28} aria-hidden="true" style={{ color: "var(--color-tawf-gold)" }} />
                </div>
                <p
                  className="text-xs tracking-widest uppercase mb-2 font-medium"
                  style={{ color: "var(--color-tawf-gold)" }}
                >
                  {label}
                </p>
                <h3
                  className="text-xl font-medium mb-3"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-tawf-muted)" }}>
                  {desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section
        className="py-24"
        style={{ background: "var(--color-tawf-sand-dark)" }}
        aria-labelledby="cta-heading"
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p {...animView()} className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            The Identity Layer for ZISWAF
          </motion.p>
          <motion.h2
            {...animView(0.1)}
            id="cta-heading"
            className="text-4xl md:text-5xl font-light mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)", textWrap: "balance" }}
          >
            Dignity through cryptography. Not as promises — as on-chain reality.
          </motion.h2>
          <motion.p {...animView(0.2)} className="text-base leading-relaxed mb-10" style={{ color: "var(--color-tawf-muted)" }}>
            tawf-did will power identity verification across ziswaf.tawf.foundation — giving every mustahik a self-sovereign, privacy-preserving credential that satisfies both Sharia requirements and cryptographic soundness.
          </motion.p>
          <motion.div {...animView(0.3)} className="flex flex-wrap justify-center gap-4">
            <Link
              to="/claim"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
              style={{ background: "var(--color-tawf-green)", color: "var(--color-tawf-sand)", borderRadius: "var(--radius-button)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-tawf-green-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-tawf-green)")}
            >
              Get Your DID <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase font-medium border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
              style={{ borderColor: "var(--color-tawf-green)", color: "var(--color-tawf-green)", borderRadius: "var(--radius-button)", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-tawf-green)"; e.currentTarget.style.color = "var(--color-tawf-sand)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-tawf-green)"; }}
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
