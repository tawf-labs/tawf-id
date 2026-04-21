#!/usr/bin/env node
/**
 * Test proof generation and verification for MustahikEligibility circuit.
 * Run after: npm run compile && npm run setup && npm run contribute && npm run export:vkey
 */
const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function main() {
  // Sample input: income = 2_000_000 IDR, nisab = 5_000_000 IDR → eligible
  const input = {
    income: "2000000",
    assets: "10000000",
    sk_did: "12345678901234567890",
    nisab_threshold: "5000000",
    asset_ceiling: "50000000",
    cycle_id: "1",
    // commitment = Poseidon(income, assets, sk_did) — compute offline
    commitment: "0", // placeholder; replace with actual Poseidon hash
  };

  console.log("Generating proof...");
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    path.join(__dirname, "../build/mustahik_eligibility_js/mustahik_eligibility.wasm"),
    path.join(__dirname, "../build/mustahik_eligibility_final.zkey")
  );

  console.log("Public signals:", publicSignals);
  console.log("  nullifier:", publicSignals[0]);
  console.log("  eligible:", publicSignals[1]);

  const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, "../build/verification_key.json"), "utf8"));
  const valid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  console.log("Proof valid:", valid);

  if (!valid) process.exit(1);
  console.log("✓ Circuit test passed");
}

main().catch((e) => { console.error(e); process.exit(1); });
