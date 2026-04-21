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

const ACTORS = [
  { id: "gov", label: "Government\nData Authority", role: "Credential Issuer" },
  { id: "mustahik", label: "Mustahik\nClaimant", role: "Prover / Holder" },
  { id: "amil", label: "Amil\nInstitution", role: "Verifier" },
  { id: "chain", label: "Blockchain\nNetwork", role: "Execution Layer" },
  { id: "did", label: "DID\nRegistry", role: "Identifier Resolution" },
];

const TECH_STACK = [
  { component: "ZKP Circuit Language", tool: "Circom 2.1.x + circomlib" },
  { component: "Proof System", tool: "Groth16 (SnarkJS)" },
  { component: "Hash Function", tool: "Poseidon (arithmetic-friendly)" },
  { component: "Smart Contracts", tool: "Solidity 0.8.x" },
  { component: "Blockchain Network", tool: "Base Sepolia (EVM, chainId 84532)" },
  { component: "DID Method", tool: "did:ethr (W3C DID Core)" },
  { component: "Credential Format", tool: "W3C Verifiable Credentials" },
  { component: "Frontend", tool: "React + Vite + Tailwind CSS v4" },
  { component: "Wallet", tool: "RainbowKit + wagmi + viem" },
];

export function About() {
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
            Research Paper · BINUS University
          </motion.p>
          <motion.h1
            {...anim(0.1)}
            className="text-4xl md:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-sand)", textWrap: "balance" }}
          >
            A Zero-Knowledge Decentralized Identity Protocol
          </motion.h1>
          <motion.p {...animView(0.2)} className="text-sm leading-relaxed" style={{ color: "rgba(249,246,240,0.65)" }}>
            Muhammad Zidan Fatonie · Alexander Agung Santoso Gunawan · School of Computer Science, BINUS University
          </motion.p>
        </div>
      </section>

      {/* Abstract */}
      <section id="paper" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p {...anim()} className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            Abstract
          </motion.p>
          <motion.p {...animView(0.1)} className="text-lg leading-relaxed" style={{ color: "var(--color-tawf-ink)" }}>
            Zakat management systems face a critical paradox: blockchain transparency inadvertently exposes the socioeconomic status of mustahik recipients. This protocol proposes a Zero-Knowledge Decentralized Identity (ZK-DID) system integrating zk-SNARKs with W3C DID standards, enabling cryptographic verification of eligibility without disclosing personal attributes or financial records.
          </motion.p>
          <motion.p {...animView(0.15)} className="text-base leading-relaxed mt-4" style={{ color: "var(--color-tawf-muted)" }}>
            The architecture satisfies simultaneous requirements of privacy, verifiability, scalability, and Sharia compliance. A prototype is deployed on Base Sepolia using Circom, SnarkJS, and Solidity. Evaluation focuses on proof generation overhead, on-chain verification gas costs, and resistance to identity-linkage attacks.
          </motion.p>
        </div>
      </section>

      {/* 5-Actor Architecture */}
      <section className="py-16 px-6" style={{ background: "var(--color-tawf-white)" }} aria-labelledby="arch-heading">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...anim()}
            id="arch-heading"
            className="text-3xl font-light mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
          >
            Five-Actor Trust Model
          </motion.h2>
          <motion.p {...animView(0.1)} className="text-sm mb-10" style={{ color: "var(--color-tawf-muted)" }}>
            The protocol operates within a five-actor model with clearly defined trust boundaries.
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ACTORS.map(({ id, label, role }, i) => (
              <motion.div
                key={id}
                {...anim(i * 0.08)}
                className="p-4 rounded-2xl text-center border"
                style={{
                  background: "var(--color-tawf-sand)",
                  borderColor: "color-mix(in srgb, var(--color-tawf-green) 12%, transparent)",
                }}
              >
                <p
                  className="text-sm font-medium mb-1 whitespace-pre-line leading-snug"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
                >
                  {label}
                </p>
                <p className="text-xs" style={{ color: "var(--color-tawf-gold)" }}>
                  {role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key equations */}
      <section id="circuits" className="py-20 px-6" aria-labelledby="eq-heading">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...anim()}
            id="eq-heading"
            className="text-3xl font-light mb-8"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
          >
            Formal Specification
          </motion.h2>
          <div className="flex flex-col gap-6">
            {[
              {
                title: "Eligibility Predicate",
                code: `C(A, T) = 1  ⟺  ⋀ᵢ φᵢ(aᵢ, tᵢ)\n\nwhere φᵢ are range predicates:\n  income ≤ nisab_threshold\n  assets ≤ asset_ceiling`,
              },
              {
                title: "ZK Statement",
                code: `∃ A : C(A, T) = 1  ∧  Com(A) = cm\n\nPublic inputs: T (thresholds), cm (commitment)\nPrivate witness: A (income, assets, dependents)`,
              },
              {
                title: "Nullifier Hash",
                code: `η = Poseidon(sk_DID ‖ cycle_id)\n\nPrevents double-claiming per cycle.\nUnlinkable to claimant identity without sk_DID.`,
              },
            ].map(({ title, code }, i) => (
              <motion.div key={title} {...anim(i * 0.1)}>
                <p className="text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
                  {title}
                </p>
                <pre
                  className="p-5 rounded-2xl text-sm leading-relaxed overflow-x-auto"
                  style={{
                    background: "var(--color-tawf-green)",
                    color: "var(--color-tawf-sand)",
                    fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                  }}
                >
                  <code>{code}</code>
                </pre>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-6" style={{ background: "var(--color-tawf-white)" }} aria-labelledby="stack-heading">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...anim()}
            id="stack-heading"
            className="text-3xl font-light mb-8"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
          >
            Development Stack
          </motion.h2>
          <motion.div {...animView(0.1)} className="rounded-2xl overflow-hidden border" style={{ borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}>
            <table className="w-full text-sm" aria-label="Development tools and environment">
              <thead>
                <tr style={{ background: "var(--color-tawf-green)" }}>
                  <th className="text-left px-6 py-3 font-medium text-xs tracking-widest uppercase" style={{ color: "var(--color-tawf-gold)" }}>
                    Component
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-xs tracking-widest uppercase" style={{ color: "var(--color-tawf-gold)" }}>
                    Tool
                  </th>
                </tr>
              </thead>
              <tbody>
                {TECH_STACK.map(({ component, tool }, i) => (
                  <tr
                    key={component}
                    style={{ background: i % 2 === 0 ? "var(--color-tawf-sand)" : "var(--color-tawf-white)" }}
                  >
                    <td className="px-6 py-3 font-medium" style={{ color: "var(--color-tawf-green)" }}>
                      {component}
                    </td>
                    <td className="px-6 py-3" style={{ color: "var(--color-tawf-muted)" }}>
                      {tool}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
