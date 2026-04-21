/**
 * Prover Web Worker
 * Runs SnarkJS groth16.fullProve off the main thread so the UI stays responsive.
 * Private witness data never leaves this worker context.
 */
import * as snarkjs from "snarkjs";

export type ProverInput = {
  income: string;
  assets: string;
  sk_did: string;
  nisab_threshold: string;
  asset_ceiling: string;
  cycle_id: string;
  commitment: string;
};

export type ProverResult =
  | { ok: true; proof: snarkjs.Groth16Proof; publicSignals: string[] }
  | { ok: false; error: string };

self.onmessage = async (e: MessageEvent<ProverInput>) => {
  try {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      e.data,
      "/circuits/mustahik_eligibility.wasm",
      "/circuits/mustahik_eligibility_final.zkey"
    );
    self.postMessage({ ok: true, proof, publicSignals } satisfies ProverResult);
  } catch (err) {
    self.postMessage({ ok: false, error: String(err) } satisfies ProverResult);
  }
};
