import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

describe("DIDRegistry", () => {
  async function deploy() {
    const [owner, other] = await ethers.getSigners();
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const registry = await DIDRegistry.deploy();
    return { registry, owner, other };
  }

  it("registers a DID", async () => {
    const { registry, owner } = await deploy();
    const did = "did:ethr:baseSepolia:0xabc";
    const hash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
    await expect(registry.registerDID(did, hash)).to.emit(registry, "DIDRegistered").withArgs(did, owner.address, hash);
    const [docHash, active, addr] = await registry.resolve(did);
    expect(docHash).to.equal(hash);
    expect(active).to.be.true;
    expect(addr).to.equal(owner.address);
  });

  it("reverts on duplicate registration", async () => {
    const { registry } = await deploy();
    const did = "did:ethr:baseSepolia:0xabc";
    const hash = ethers.keccak256(ethers.toUtf8Bytes("doc"));
    await registry.registerDID(did, hash);
    await expect(registry.registerDID(did, hash)).to.be.revertedWithCustomError(registry, "DIDAlreadyExists");
  });

  it("updates DID document hash", async () => {
    const { registry } = await deploy();
    const did = "did:ethr:baseSepolia:0xabc";
    await registry.registerDID(did, ethers.keccak256(ethers.toUtf8Bytes("v1")));
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("v2"));
    await registry.updateDID(did, newHash);
    const [docHash] = await registry.resolve(did);
    expect(docHash).to.equal(newHash);
  });

  it("deactivates DID", async () => {
    const { registry } = await deploy();
    const did = "did:ethr:baseSepolia:0xabc";
    await registry.registerDID(did, ethers.keccak256(ethers.toUtf8Bytes("doc")));
    await registry.deactivateDID(did);
    const [, active] = await registry.resolve(did);
    expect(active).to.be.false;
  });

  it("reverts update by non-owner", async () => {
    const { registry, other } = await deploy();
    const did = "did:ethr:baseSepolia:0xabc";
    await registry.registerDID(did, ethers.keccak256(ethers.toUtf8Bytes("doc")));
    await expect(registry.connect(other).updateDID(did, ethers.keccak256(ethers.toUtf8Bytes("hack")))).to.be.revertedWithCustomError(registry, "NotDIDOwner");
  });
});

describe("MustahikVerifier + ZakatDisbursement", () => {
  async function deploy() {
    const [amil, recipient, other] = await ethers.getSigners();

    const Verifier = await ethers.getContractFactory("MockGroth16Verifier");
    const groth16 = await Verifier.deploy();

    const MustahikVerifier = await ethers.getContractFactory("MustahikVerifier");
    const verifier = await MustahikVerifier.deploy(await groth16.getAddress());

    const ZakatDisbursement = await ethers.getContractFactory("ZakatDisbursement");
    const disbursement = await ZakatDisbursement.deploy(await verifier.getAddress());

    // Fund the disbursement contract
    await amil.sendTransaction({ to: await disbursement.getAddress(), value: ethers.parseEther("1.0") });

    return { groth16, verifier, disbursement, amil, recipient, other };
  }

  // pubSignals: [nullifier, eligible, nisab_threshold, asset_ceiling, cycle_id, commitment, recipient]
  const validSignals = (recipientAddr: string): [bigint, bigint, bigint, bigint, bigint, bigint, bigint] =>
    [BigInt(999), BigInt(1), BigInt(5000000), BigInt(50000000), BigInt(1), BigInt(123), BigInt(recipientAddr)];
  const invalidSignals = (recipientAddr: string): [bigint, bigint, bigint, bigint, bigint, bigint, bigint] =>
    [BigInt(888), BigInt(0), BigInt(5000000), BigInt(50000000), BigInt(1), BigInt(123), BigInt(recipientAddr)];
  const dummyProof = {
    pA: [BigInt(0), BigInt(0)] as [bigint, bigint],
    pB: [[BigInt(0), BigInt(0)], [BigInt(0), BigInt(0)]] as [[bigint, bigint], [bigint, bigint]],
    pC: [BigInt(0), BigInt(0)] as [bigint, bigint],
  };

  it("accepts valid proof and disburses", async () => {
    const { disbursement, amil, recipient } = await deploy();
    const amount = ethers.parseEther("0.01");
    await disbursement.connect(amil).setDisbursementAmount(amount);
    const balBefore = await ethers.provider.getBalance(recipient.address);

    await expect(
      disbursement.connect(amil).disburse(
        "did:ethr:baseSepolia:0xabc",
        recipient.address,
        amount,
        dummyProof.pA, dummyProof.pB, dummyProof.pC,
        validSignals(recipient.address)
      )
    ).to.emit(disbursement, "Disbursed");

    const balAfter = await ethers.provider.getBalance(recipient.address);
    expect(balAfter - balBefore).to.equal(amount);
  });

  it("rejects ineligible proof", async () => {
    const { disbursement, amil, recipient, verifier } = await deploy();
    await disbursement.connect(amil).setDisbursementAmount(ethers.parseEther("0.01"));
    await expect(
      disbursement.connect(amil).disburse(
        "did:ethr:baseSepolia:0xabc",
        recipient.address,
        ethers.parseEther("0.01"),
        dummyProof.pA, dummyProof.pB, dummyProof.pC,
        invalidSignals(recipient.address)
      )
    ).to.be.revertedWithCustomError(verifier, "NotEligible");
  });

  it("prevents double-claiming with same nullifier", async () => {
    const { disbursement, amil, recipient, verifier } = await deploy();
    const amount = ethers.parseEther("0.01");
    await disbursement.connect(amil).setDisbursementAmount(amount);
    const signals = validSignals(recipient.address);

    await disbursement.connect(amil).disburse("did:ethr:baseSepolia:0xabc", recipient.address, amount, dummyProof.pA, dummyProof.pB, dummyProof.pC, signals);
    await expect(
      disbursement.connect(amil).disburse("did:ethr:baseSepolia:0xabc", recipient.address, amount, dummyProof.pA, dummyProof.pB, dummyProof.pC, signals)
    ).to.be.revertedWithCustomError(verifier, "NullifierAlreadyUsed");
  });

  it("rejects proof with mismatched recipient (front-running attack)", async () => {
    const { disbursement, amil, recipient, other, verifier } = await deploy();
    await disbursement.connect(amil).setDisbursementAmount(ethers.parseEther("0.01"));
    // Proof was generated for `recipient` but attacker tries to redirect funds to `other`
    await expect(
      disbursement.connect(amil).disburse(
        "did:ethr:baseSepolia:0xabc",
        other.address,
        ethers.parseEther("0.01"),
        dummyProof.pA, dummyProof.pB, dummyProof.pC,
        validSignals(recipient.address)  // proof bound to recipient, not other
      )
    ).to.be.revertedWithCustomError(verifier, "RecipientMismatch");
  });

  it("allows any caller with valid proof to disburse (ZK is the authorization)", async () => {
    const { disbursement, amil, recipient, other } = await deploy();
    await disbursement.connect(amil).setDisbursementAmount(ethers.parseEther("0.01"));
    await expect(
      disbursement.connect(other).disburse("did:ethr:baseSepolia:0xabc", recipient.address, ethers.parseEther("0.01"), dummyProof.pA, dummyProof.pB, dummyProof.pC, validSignals(recipient.address))
    ).to.emit(disbursement, "Disbursed");
  });
});
