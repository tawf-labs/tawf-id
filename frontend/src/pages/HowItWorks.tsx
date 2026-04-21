import { motion, useReducedMotion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const STEPS = [
  {
    n: "01",
    actor: "Government Data Authority",
    title: "Credential Issuance",
    desc: "The issuing authority conducts offline attribute verification and issues a BBS+-signed Verifiable Credential (VC) over the attribute vector: income, assets, and dependents, conforming to the W3C VC Data Model. The credential is stored in the claimant's wallet.",
  },
  {
    n: "02",
    actor: "Mustahik Claimant",
    title: "Proof Generation",
    desc: "The claimant selects their asnaf category and invokes the ZKP circuit. Private attributes from the VC are used as the witness to generate a Groth16 proof π and a nullifier hash η = Poseidon(sk_DID ‖ cycle_id). Proof generation runs entirely in-browser via WebAssembly. Private data never leaves the device.",
  },
  {
    n: "03",
    actor: "Amil Institution",
    title: "On-Chain Verification",
    desc: "The amil submits (π, η, DID) to the on-chain Verifier contract. The contract verifies π against the pre-compiled verification key and checks η against the nullifier set to prevent double-claiming within a cycle.",
  },
  {
    n: "04",
    actor: "Blockchain Network",
    title: "Disbursement",
    desc: "Upon successful verification, the Disbursement Contract releases the zakat amount to the claimant's designated address on Base Sepolia. A Disbursed event is emitted with the DID, amount, cycle ID, and nullifier, creating an auditable yet privacy-respecting on-chain record.",
  },
];

export function HowItWorks() {
  const reduced = useReducedMotion();
  const anim = (delay = 0) =>
    reduced ? { initial: {}, animate: {}, transition: {} } : fadeUp(delay);
  const animView = (delay = 0) =>
    reduced ? { initial: {}, whileInView: {}, viewport: { once: true }, transition: {} } : fadeUpView(delay);

  return (
    <div style={{ background: "var(--color-tawf-sand)" }}>
      {/* Header */}
      <section className="pt-40 pb-16 px-6" style={{ background: "var(--color-tawf-green)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.p {...anim()} className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            Four-Phase Protocol
          </motion.p>
          <motion.h1
            {...anim(0.1)}
            className="text-5xl font-light mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-sand)", textWrap: "balance" }}
          >
            How ZK-DID Works
          </motion.h1>
          <motion.p {...anim(0.2)} className="text-base leading-relaxed" style={{ color: "rgba(249,246,240,0.65)" }}>
            A complete five-actor protocol integrating W3C DID, Verifiable Credentials, and Groth16 proofs for mustahik verification, from credential issuance to on-chain disbursement.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6" aria-label="Protocol steps">
        <div className="max-w-3xl mx-auto">
          <ol className="relative">
            {/* Vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-0 bottom-0 w-px"
              style={{ background: "color-mix(in srgb, var(--color-tawf-green) 15%, transparent)" }}
            />
            {STEPS.map(({ n, actor, title, desc }, i) => (
              <motion.li key={n} {...animView(i * 0.12)} className="relative pl-20 pb-16 last:pb-0">
                {/* Number circle */}
                <div
                  className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    background: "var(--color-tawf-green)",
                    color: "var(--color-tawf-gold)",
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                  }}
                  aria-hidden="true"
                >
                  {n}
                </div>
                <p
                  className="text-xs tracking-widest uppercase mb-2 font-medium"
                  style={{ color: "var(--color-tawf-gold)" }}
                >
                  {actor}
                </p>
                <h2
                  className="text-2xl font-medium mb-3"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
                >
                  {title}
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-tawf-muted)" }}>
                  {desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Nullifier explanation */}
      <section className="py-16 px-6" style={{ background: "var(--color-tawf-white)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...animView()}
            className="text-3xl font-light mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
          >
            Double-Claim Prevention
          </motion.h2>
          <motion.p {...animView(0.1)} className="text-base leading-relaxed mb-6" style={{ color: "var(--color-tawf-muted)" }}>
            Each proof submission includes a nullifier hash derived from the claimant's DID private key and the current cycle ID. The on-chain Verifier maintains a set of spent nullifiers, preventing the same mustahik from claiming zakat more than once per cycle, while revealing nothing about their identity.
          </motion.p>
          <motion.div
            {...animView(0.2)}
            className="p-6 rounded-2xl font-mono text-sm"
            style={{ background: "var(--color-tawf-sand)", color: "var(--color-tawf-green)", border: "1px solid color-mix(in srgb, var(--color-tawf-green) 12%, transparent)" }}
          >
            <p style={{ color: "var(--color-tawf-muted)" }}>// Nullifier formula</p>
            <p>η = Poseidon(sk_DID ‖ cycle_id)</p>
            <br />
            <p style={{ color: "var(--color-tawf-muted)" }}>// Eligibility predicate</p>
            <p>C(A, T) = 1 ⟺ income ≤ nisab ∧ assets ≤ ceiling</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
