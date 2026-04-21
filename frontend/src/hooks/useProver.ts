import { useState, useCallback } from "react";
import type { ProverInput, ProverResult } from "../workers/prover.worker";
import type { Groth16Proof } from "snarkjs";

type ProofState =
  | { status: "idle" }
  | { status: "proving" }
  | { status: "done"; proof: Groth16Proof; publicSignals: string[] }
  | { status: "error"; message: string };

export function useProver() {
  const [state, setState] = useState<ProofState>({ status: "idle" });

  const prove = useCallback((input: ProverInput) => {
    setState({ status: "proving" });
    const worker = new Worker(new URL("../workers/prover.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<ProverResult>) => {
      if (e.data.ok) {
        setState({ status: "done", proof: e.data.proof, publicSignals: e.data.publicSignals });
      } else {
        setState({ status: "error", message: e.data.error });
      }
      worker.terminate();
    };
    worker.onerror = (err) => {
      setState({ status: "error", message: err.message });
      worker.terminate();
    };
    worker.postMessage(input);
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, prove, reset };
}
