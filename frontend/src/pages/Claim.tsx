import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useProver } from "../hooks/useProver";
import { DISBURSEMENT_ABI } from "../lib/abis";
import { DISBURSEMENT_ADDRESS, BASE_SEPOLIA_EXPLORER } from "../lib/constants";
import type { Groth16Proof } from "snarkjs";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

// Convert SnarkJS proof to Solidity calldata format
// pubSignals order from circuit: [nullifier, eligible, nisab_threshold, asset_ceiling, cycle_id, commitment]
function proofToCalldata(proof: Groth16Proof, publicSignals: string[]) {
  const pA = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])] as [bigint, bigint];
  const pB = [
    [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
    [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
  ] as [[bigint, bigint], [bigint, bigint]];
  const pC = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])] as [bigint, bigint];
  const pubSignals = publicSignals.map(BigInt) as [bigint, bigint, bigint, bigint, bigint, bigint];
  return { pA, pB, pC, pubSignals };
}

type FormValues = { income: string; assets: string; dependents: string };

const NISAB = "5000000";
const ASSET_CEILING = "50000000";
const CYCLE_ID = "1";

// Derive did:ethr DID deterministically from wallet address
function addressToDID(address: string) {
  return `did:ethr:baseSepolia:${address.toLowerCase()}`;
}

export function Claim() {
  const { address, isConnected } = useAccount();
  const reduced = useReducedMotion();
  const { state: proverState, prove, reset: resetProver } = useProver();
  const { writeContract, data: txHash, isPending: isTxPending, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const [form, setForm] = useState<FormValues>({ income: "", assets: "", dependents: "" });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // DID is auto-derived from connected wallet, user never needs to know
  const did = address ? addressToDID(address) : "";

  const validate = (): boolean => {
    const e: Partial<FormValues> = {};
    if (!form.income || isNaN(Number(form.income))) e.income = "Enter a valid income amount";
    if (!form.assets || isNaN(Number(form.assets))) e.assets = "Enter a valid asset amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerateProof = async () => {
    if (!validate()) return;
    setStep(2);
    const sk_did = BigInt(address || "0x0").toString();
    prove({
      income: form.income,
      assets: form.assets,
      sk_did,
      nisab_threshold: NISAB,
      asset_ceiling: ASSET_CEILING,
      cycle_id: CYCLE_ID,
    });
  };

  const handleSubmit = () => {
    if (proverState.status !== "done" || !address) return;
    setStep(3);
    const { pA, pB, pC, pubSignals } = proofToCalldata(proverState.proof, proverState.publicSignals);
    writeContract({
      address: DISBURSEMENT_ADDRESS,
      abi: DISBURSEMENT_ABI,
      functionName: "disburse",
      args: [did, address, BigInt(0), pA, pB, pC, pubSignals],
      gas: BigInt(1_000_000),
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-tawf-gold";
  const inputStyle = { background: "var(--color-tawf-white)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 15%, transparent)", color: "var(--color-tawf-ink)" };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20" style={{ background: "var(--color-tawf-sand)" }}>
        <div className="text-center max-w-md">
          <p className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            Wallet Required
          </p>
          <h1 className="text-4xl font-light mb-4" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
            Connect to Claim
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-tawf-muted)" }}>
            Connect your wallet on Base Sepolia to generate a ZK proof and claim your mustahik identity.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: "var(--color-tawf-sand)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div {...(reduced ? {} : fadeUp())} className="mb-10">
          <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: "var(--color-tawf-gold)" }}>
            Mustahik Identity Claim
          </p>
          <h1 className="text-4xl font-light mb-3" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
            Prove Your Eligibility
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-tawf-muted)" }}>
            Your income and asset data are used as a private witness. They never leave your device. Only the cryptographic proof is submitted on-chain.
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-tawf-muted)" }}>
            Not sure if you qualify?{" "}
            <Link to="/asnaf" className="underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tawf-gold rounded" style={{ color: "var(--color-tawf-green)" }}>
              Learn about the Asnaf categories
            </Link>
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10" aria-label="Claim steps">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300"
                style={{
                  background: step >= s ? "var(--color-tawf-green)" : "transparent",
                  color: step >= s ? "var(--color-tawf-gold)" : "var(--color-tawf-muted)",
                  border: step >= s ? "none" : "1px solid var(--color-tawf-muted)",
                }}
                aria-current={step === s ? "step" : undefined}
              >
                {s}
              </div>
              <span className="text-xs tracking-wide hidden sm:block" style={{ color: step >= s ? "var(--color-tawf-green)" : "var(--color-tawf-muted)" }}>
                {s === 1 ? "Attributes" : s === 2 ? "Generate Proof" : "Submit"}
              </span>
              {s < 3 && <div className="w-8 h-px" style={{ background: "color-mix(in srgb, var(--color-tawf-green) 20%, transparent)" }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Attribute form */}
        {step === 1 && (
          <motion.div {...(reduced ? {} : fadeUp(0.1))} className="p-8 rounded-2xl border" style={{ background: "var(--color-tawf-white)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}>
            <h2 className="text-xl font-medium mb-6" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
              Enter Your Attributes
            </h2>
            <form
              onSubmit={(e) => { e.preventDefault(); handleGenerateProof(); }}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* DID is auto-generated, show it as read-only info */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: "color-mix(in srgb, var(--color-tawf-green) 5%, transparent)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 15%, transparent)" }}
              >
                <p className="text-xs tracking-widest uppercase mb-1 font-medium" style={{ color: "var(--color-tawf-green)" }}>
                  Your tawf-did
                </p>
                <p className="text-xs font-mono break-all" style={{ color: "var(--color-tawf-muted)" }}>
                  {did}
                </p>
              </div>

              <div>
                <label htmlFor="income" className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: "var(--color-tawf-green)" }}>
                  Monthly Income (IDR)
                </label>
                <input
                  id="income"
                  name="income"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. 2000000"
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errors.income ? "#ef4444" : inputStyle.borderColor }}
                  value={form.income}
                  onChange={(e) => setForm((f) => ({ ...f, income: e.target.value }))}
                  aria-describedby={errors.income ? "income-error" : "income-hint"}
                  aria-invalid={!!errors.income}
                />
                <p id="income-hint" className="text-xs mt-1" style={{ color: "var(--color-tawf-muted)" }}>
                  Nisab threshold: Rp {Number(NISAB).toLocaleString("id-ID")}
                </p>
                {errors.income && <p id="income-error" className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.income}</p>}
              </div>

              <div>
                <label htmlFor="assets" className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: "var(--color-tawf-green)" }}>
                  Total Non-Exempt Assets (IDR)
                </label>
                <input
                  id="assets"
                  name="assets"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. 10000000"
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errors.assets ? "#ef4444" : inputStyle.borderColor }}
                  value={form.assets}
                  onChange={(e) => setForm((f) => ({ ...f, assets: e.target.value }))}
                  aria-describedby={errors.assets ? "assets-error" : undefined}
                  aria-invalid={!!errors.assets}
                />
                {errors.assets && <p id="assets-error" className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.assets}</p>}
              </div>

              <div>
                <label htmlFor="dependents" className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: "var(--color-tawf-green)" }}>
                  Number of Dependents
                </label>
                <input
                  id="dependents"
                  name="dependents"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. 3"
                  className={inputClass}
                  style={inputStyle}
                  value={form.dependents}
                  onChange={(e) => setForm((f) => ({ ...f, dependents: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
                style={{ background: "var(--color-tawf-green)", color: "var(--color-tawf-sand)", borderRadius: "var(--radius-button)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-tawf-green-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-tawf-green)")}
              >
                Generate ZK Proof
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Proof generation */}
        {step === 2 && (
          <motion.div {...(reduced ? {} : fadeUp(0.1))} className="p-8 rounded-2xl border text-center" style={{ background: "var(--color-tawf-white)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}>
            {proverState.status === "proving" && (
              <div aria-live="polite" aria-busy="true">
                <Loader2 size={40} className="mx-auto mb-4 animate-spin" aria-hidden="true" style={{ color: "var(--color-tawf-green)" }} />
                <h2 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
                  Generating Proof…
                </h2>
                <p className="text-sm" style={{ color: "var(--color-tawf-muted)" }}>
                  Running Groth16 prover in-browser. Your private data never leaves this device.
                </p>
              </div>
            )}
            {proverState.status === "done" && (
              <div aria-live="polite">
                <CheckCircle size={40} className="mx-auto mb-4" aria-hidden="true" style={{ color: "var(--color-tawf-green)" }} />
                <h2 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
                  Proof Generated
                </h2>
                <p className="text-sm mb-4" style={{ color: "var(--color-tawf-muted)" }}>
                  Nullifier: <code className="font-mono text-xs" style={{ color: "var(--color-tawf-green)" }}>{proverState.publicSignals[0]?.slice(0, 20)}…</code>
                </p>
                <details className="text-left mb-6">
                  <summary className="text-xs tracking-widest uppercase cursor-pointer font-medium mb-2" style={{ color: "var(--color-tawf-gold)" }}>
                    Inspect Proof
                  </summary>
                  <pre className="text-xs p-4 rounded-xl overflow-x-auto" style={{ background: "var(--color-tawf-sand)", color: "var(--color-tawf-green)" }}>
                    {JSON.stringify({ proof: proverState.proof, publicSignals: proverState.publicSignals }, null, 2)}
                  </pre>
                </details>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
                  style={{ background: "var(--color-tawf-green)", color: "var(--color-tawf-sand)", borderRadius: "var(--radius-button)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-tawf-green-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-tawf-green)")}
                >
                  Submit On-Chain
                </button>
              </div>
            )}
            {proverState.status === "error" && (
              <div aria-live="assertive">
                <AlertCircle size={40} className="mx-auto mb-4" aria-hidden="true" style={{ color: "#ef4444" }} />
                <h2 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
                  Proof Failed
                </h2>
                <p className="text-sm mb-6 font-mono" style={{ color: "#ef4444" }}>{proverState.message}</p>
                <button
                  onClick={() => { resetProver(); setStep(1); }}
                  className="px-6 py-3 text-sm tracking-widest uppercase font-medium border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
                  style={{ borderColor: "var(--color-tawf-green)", color: "var(--color-tawf-green)", borderRadius: "var(--radius-button)", background: "transparent" }}
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Transaction */}
        {step === 3 && (
          <motion.div {...(reduced ? {} : fadeUp(0.1))} className="p-8 rounded-2xl border text-center" style={{ background: "var(--color-tawf-white)", borderColor: "color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}>
            {(isTxPending || isConfirming) && (
              <div aria-live="polite" aria-busy="true">
                <Loader2 size={40} className="mx-auto mb-4 animate-spin" aria-hidden="true" style={{ color: "var(--color-tawf-green)" }} />
                <h2 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
                  {isTxPending ? "Confirm in Wallet…" : "Confirming Transaction…"}
                </h2>
                <p className="text-sm" style={{ color: "var(--color-tawf-muted)" }}>
                  {isConfirming && txHash && (
                    <a href={`${BASE_SEPOLIA_EXPLORER}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tawf-gold rounded" style={{ color: "var(--color-tawf-gold)" }}>
                      View on Basescan <ExternalLink size={12} className="inline" aria-hidden="true" />
                    </a>
                  )}
                </p>
              </div>
            )}
            {isConfirmed && (
              <div aria-live="polite">
                <CheckCircle size={40} className="mx-auto mb-4" aria-hidden="true" style={{ color: "var(--color-tawf-green)" }} />
                <h2 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
                  Identity Verified
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-tawf-muted)" }}>
                  Your ZK-DID has been verified and recorded on Base Sepolia.
                </p>
                {txHash && (
                  <a
                    href={`${BASE_SEPOLIA_EXPLORER}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold rounded"
                    style={{ color: "var(--color-tawf-gold)" }}
                  >
                    View Transaction <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
            {txError && (
              <div aria-live="assertive">
                <AlertCircle size={40} className="mx-auto mb-4" aria-hidden="true" style={{ color: "#ef4444" }} />
                <h2 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}>
                  Transaction Failed
                </h2>
                <p className="text-sm mb-6 font-mono break-words" style={{ color: "#ef4444" }}>{txError.message}</p>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-sm tracking-widest uppercase font-medium border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
                  style={{ borderColor: "var(--color-tawf-green)", color: "var(--color-tawf-green)", borderRadius: "var(--radius-button)", background: "transparent" }}
                >
                  Retry Submission
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
