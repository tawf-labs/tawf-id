import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy Groth16Verifier
  // NOTE: Replace Groth16Verifier.sol with the real SnarkJS-generated verifier before deploying to production
  const Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  console.log("Groth16Verifier:", await verifier.getAddress());

  // 2. Deploy DIDRegistry
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
  const didRegistry = await DIDRegistry.deploy();
  await didRegistry.waitForDeployment();
  console.log("DIDRegistry:", await didRegistry.getAddress());

  // 3. Deploy MustahikVerifier
  const MustahikVerifier = await ethers.getContractFactory("MustahikVerifier");
  const mustahikVerifier = await MustahikVerifier.deploy(await verifier.getAddress());
  await mustahikVerifier.waitForDeployment();
  console.log("MustahikVerifier:", await mustahikVerifier.getAddress());

  // 4. Deploy ZakatDisbursement
  const ZakatDisbursement = await ethers.getContractFactory("ZakatDisbursement");
  const disbursement = await ZakatDisbursement.deploy(await mustahikVerifier.getAddress());
  await disbursement.waitForDeployment();
  console.log("ZakatDisbursement:", await disbursement.getAddress());

  // Write addresses to frontend .env
  const envPath = path.join(__dirname, "../../frontend/.env");
  const envContent = `VITE_WALLETCONNECT_PROJECT_ID=${process.env.VITE_WALLETCONNECT_PROJECT_ID || ""}
VITE_DID_REGISTRY_ADDRESS=${await didRegistry.getAddress()}
VITE_VERIFIER_ADDRESS=${await mustahikVerifier.getAddress()}
VITE_DISBURSEMENT_ADDRESS=${await disbursement.getAddress()}
VITE_BASE_SEPOLIA_RPC=https://sepolia.base.org
VITE_AMIL_ADDRESS=${deployer.address}
`;
  fs.writeFileSync(envPath, envContent);
  console.log("\n✓ Addresses written to frontend/.env");
}

main().catch((e) => { console.error(e); process.exit(1); });
