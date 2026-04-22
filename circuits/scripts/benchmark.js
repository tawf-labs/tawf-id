#!/usr/bin/env node
/**
 * Benchmark script for MustahikEligibility ZK circuit.
 * Measures: constraint count, proof generation time, proof size,
 * verification time, across eligible and ineligible witness cases.
 */
const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD = path.join(__dirname, "../build");
const WASM  = path.join(BUILD, "mustahik_eligibility_js/mustahik_eligibility.wasm");
const ZKEY  = path.join(BUILD, "mustahik_eligibility_final.zkey");
const VKEY  = JSON.parse(fs.readFileSync(path.join(BUILD, "verification_key.json"), "utf8"));

// Get constraint count from r1cs info
function getConstraints() {
  try {
    const out = execSync(
      `node ${path.join(__dirname, "../node_modules/.bin/snarkjs")} r1cs info ${BUILD}/mustahik_eligibility.r1cs 2>&1`,
      { encoding: "utf8" }
    );
    const m = out.match(/# of Constraints:\s*(\d+)/);
    return m ? parseInt(m[1]) : null;
  } catch(e) { return null; }
}

// Compute Poseidon commitment using snarkjs built-in
async function poseidon(inputs) {
  const { buildPoseidon } = require("circomlibjs");
  const p = await buildPoseidon();
  const h = p(inputs.map(BigInt));
  return p.F.toString(h);
}

async function bench(label, input, runs = 5) {
  const times = [];
  let proof, publicSignals;

  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    ({ proof, publicSignals } = await snarkjs.groth16.fullProve(input, WASM, ZKEY));
    times.push(performance.now() - t0);
  }

  const proofJson = JSON.stringify(proof);
  const proofBytes = Buffer.byteLength(proofJson, "utf8");

  // Verification time (10 runs)
  const vtimes = [];
  for (let i = 0; i < 10; i++) {
    const t0 = performance.now();
    await snarkjs.groth16.verify(VKEY, publicSignals, proof);
    vtimes.push(performance.now() - t0);
  }

  const avg = arr => arr.reduce((a,b) => a+b, 0) / arr.length;
  const min = arr => Math.min(...arr);
  const max = arr => Math.max(...arr);

  return {
    label,
    nullifier: publicSignals[0],
    eligible: publicSignals[1],
    proofGenAvgMs: avg(times).toFixed(1),
    proofGenMinMs: min(times).toFixed(1),
    proofGenMaxMs: max(times).toFixed(1),
    proofSizeBytes: proofBytes,
    verifyAvgMs: avg(vtimes).toFixed(2),
    verifyMinMs: min(vtimes).toFixed(2),
  };
}

async function main() {
  console.log("=== MustahikEligibility Circuit Benchmark ===\n");

  // Constraint count
  const constraints = getConstraints();
  console.log(`Constraints: ${constraints ?? "see r1cs info"}`);
  console.log(`WASM size:   ${(fs.statSync(WASM).size / 1024).toFixed(1)} KB`);
  console.log(`zkey size:   ${(fs.statSync(ZKEY).size / 1024).toFixed(1)} KB`);
  console.log(`nPublic:     ${VKEY.nPublic}`);
  console.log(`Curve:       ${VKEY.curve}\n`);

  // Build inputs — compute real Poseidon commitments
  const income_eligible  = "2000000";   // 2M IDR < 5M nisab → eligible
  const assets_eligible  = "10000000";  // 10M < 50M ceiling → eligible
  const income_ineligible = "6000000";  // 6M IDR > 5M nisab → ineligible
  const assets_ineligible = "10000000";
  const sk_did = "12345678901234567890";
  const nisab  = "5000000";
  const ceiling = "50000000";
  const cycle  = "1";

  const comm_eligible   = await poseidon([income_eligible, assets_eligible, sk_did]);
  const comm_ineligible = await poseidon([income_ineligible, assets_ineligible, sk_did]);
  const recipient = "206925289455418925888489591503969082765836765371"; // uint160 of tawf-deployer

  const cases = [
    {
      label: "Eligible (income < nisab, assets < ceiling)",
      input: { income: income_eligible, assets: assets_eligible, sk_did,
               nisab_threshold: nisab, asset_ceiling: ceiling, cycle_id: cycle,
               commitment: comm_eligible, recipient }
    },
    {
      label: "Ineligible (income > nisab)",
      input: { income: income_ineligible, assets: assets_ineligible, sk_did,
               nisab_threshold: nisab, asset_ceiling: ceiling, cycle_id: cycle,
               commitment: comm_ineligible, recipient }
    },
  ];

  const results = [];
  for (const c of cases) {
    process.stdout.write(`Benchmarking: ${c.label} ... `);
    try {
      const r = await bench(c.label, c.input, 5);
      results.push(r);
      console.log(`done (avg ${r.proofGenAvgMs} ms)`);
    } catch(e) {
      console.log(`FAILED: ${e.message}`);
      results.push({ label: c.label, error: e.message });
    }
  }

  console.log("\n=== RESULTS ===");
  console.log(JSON.stringify({ constraints, results }, null, 2));

  fs.writeFileSync(
    path.join(__dirname, "../benchmark_results.json"),
    JSON.stringify({ constraints, wasmKB: (fs.statSync(WASM).size/1024).toFixed(1),
                     zkeyKB: (fs.statSync(ZKEY).size/1024).toFixed(1),
                     nPublic: VKEY.nPublic, curve: VKEY.curve, results }, null, 2)
  );
  console.log("\nSaved to circuits/benchmark_results.json");
}

main().catch(e => { console.error(e); process.exit(1); });
