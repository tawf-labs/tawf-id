# tawf-did

Zero-Knowledge Decentralized Identity protocol for privacy-preserving mustahik verification in blockchain-based zakat management systems.

**Research paper:** *A Zero-Knowledge Decentralized Identity Protocol for Privacy-Preserving Mustahik Verification in Blockchain-Based Zakat Management Systems* — Muhammad Zidan Fatonie, Alexander Agung Santoso Gunawan, BINUS University.

---

## Architecture

```
tawf-id/
├── circuits/          # Circom ZK circuit + trusted setup scripts
├── contracts/         # Hardhat + Solidity (DIDRegistry, MustahikVerifier, ZakatDisbursement)
└── frontend/          # React + Vite + Tailwind CSS v4 + RainbowKit
```

**Contracts (Base Sepolia, chainId 84532):**
- `DIDRegistry.sol` — W3C DID Core-conformant on-chain identifier registry
- `Groth16Verifier.sol` — SnarkJS-generated Groth16 proof verifier
- `MustahikVerifier.sol` — Wraps verifier with nullifier-based double-claim prevention
- `ZakatDisbursement.sol` — Conditional ETH release upon verified ZK proof

---

## Setup

### 1. Install dependencies

```bash
npm install                    # root workspace
cd contracts && npm install
cd ../frontend && npm install
cd ../circuits && npm install
```

### 2. Compile & setup ZK circuit

```bash
cd circuits

# Download Powers of Tau (Phase 1 ceremony)
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -O pot12_final.ptau

# Compile circuit
npm run compile

# Phase 2 trusted setup
npm run setup
npm run contribute

# Export verification key + Solidity verifier
npm run export:vkey
npm run export:solidity   # writes real Groth16Verifier.sol to contracts/

# Copy WASM + zkey to frontend
mkdir -p ../frontend/public/circuits
npm run copy:frontend
```

### 3. Deploy contracts

```bash
cd contracts
cp .env.example .env
# Fill in DEPLOYER_PRIVATE_KEY and BASE_SEPOLIA_RPC

npm run deploy:sepolia
# Writes contract addresses to frontend/.env automatically
```

### 4. Configure frontend

```bash
cd frontend
cp .env.example .env
# Add VITE_WALLETCONNECT_PROJECT_ID (get from https://cloud.walletconnect.com)
# Contract addresses are auto-filled by deploy script
```

### 5. Run frontend

```bash
cd frontend
npm run dev
```

### 6. Run contract tests

```bash
cd contracts
npm test
```

---

## ZK Circuit

**Circuit:** `circuits/mustahik_eligibility.circom`

| Signal | Type | Description |
|--------|------|-------------|
| `income` | private | Monthly income in IDR |
| `assets` | private | Total non-exempt assets in IDR |
| `sk_did` | private | DID private key scalar |
| `nisab_threshold` | public | Current nisab value |
| `asset_ceiling` | public | Maximum asset value |
| `cycle_id` | public | Current zakat cycle ID |
| `commitment` | public | Poseidon(income, assets, sk_did) |
| `nullifier` | output | Poseidon(sk_did, cycle_id) |
| `eligible` | output | 1 if eligible, 0 otherwise |

---

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, features, stats |
| `/how-it-works` | 4-step protocol timeline |
| `/about` | Paper abstract, 5-actor model, equations, tech stack |
| `/claim` | 3-step claim flow: attributes → ZK proof → on-chain submit |
| `/dashboard` | Amil dashboard — real-time disbursement events |

---

## Integration with ziswaf.tawf.foundation

tawf-did serves as the identity layer for the ZISWAF ecosystem. Each mustahik receives a self-sovereign DID backed by a ZK-verified credential. The `DIDRegistry` contract is the canonical source of truth for mustahik identity across all Tawf products.

---

## Tech Stack

- **Circuit:** Circom 2.1.x + circomlib (Poseidon, LessThan, Num2Bits)
- **Proof system:** Groth16 (SnarkJS)
- **Contracts:** Solidity 0.8.x, Hardhat, OpenZeppelin
- **Network:** Base Sepolia (chainId 84532)
- **Frontend:** React 18, Vite, Tailwind CSS v4, RainbowKit, wagmi, viem, Framer Motion
- **Design:** Tawf design system (Cormorant Garamond + Inter, tawf-green/gold/sand)
