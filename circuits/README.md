# Circuit Setup Guide

## Prerequisites

```bash
npm install -g circom
npm install
```

## Steps

### 1. Download Powers of Tau (Phase 1)
```bash
# Download a pre-existing ceremony (12 constraints sufficient for this circuit)
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -O pot12_final.ptau
```

### 2. Compile the circuit
```bash
npm run compile
# Output: build/mustahik_eligibility.r1cs, build/mustahik_eligibility_js/
```

### 3. Phase 2 trusted setup
```bash
npm run setup
npm run contribute
```

### 4. Export verification key + Solidity verifier
```bash
npm run export:vkey
npm run export:solidity
```

### 5. Copy artifacts to frontend
```bash
mkdir -p ../frontend/public/circuits
npm run copy:frontend
```

### 6. Test proof generation
```bash
npm run test:proof
```

## Circuit Inputs

| Signal | Type | Description |
|--------|------|-------------|
| `income` | private | Monthly income in IDR (integer) |
| `assets` | private | Total non-exempt assets in IDR |
| `sk_did` | private | DID private key scalar |
| `nisab_threshold` | public | Current nisab value in IDR |
| `asset_ceiling` | public | Maximum asset value for eligibility |
| `cycle_id` | public | Current zakat cycle ID |
| `commitment` | public | Poseidon(income, assets, sk_did) |

## Circuit Outputs

| Signal | Description |
|--------|-------------|
| `nullifier` | Poseidon(sk_did, cycle_id) — prevents double-claiming |
| `eligible` | 1 if eligible, 0 otherwise |
