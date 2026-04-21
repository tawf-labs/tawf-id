export const DID_REGISTRY_ABI = [
  {
    name: "registerDID",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "did", type: "string" }, { name: "docHash", type: "bytes32" }],
    outputs: [],
  },
  {
    name: "updateDID",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "did", type: "string" }, { name: "docHash", type: "bytes32" }],
    outputs: [],
  },
  {
    name: "deactivateDID",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "did", type: "string" }],
    outputs: [],
  },
  {
    name: "resolve",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "did", type: "string" }],
    outputs: [{ name: "docHash", type: "bytes32" }, { name: "active", type: "bool" }, { name: "owner", type: "address" }],
  },
  {
    name: "DIDRegistered",
    type: "event",
    inputs: [{ name: "did", type: "string", indexed: true }, { name: "owner", type: "address", indexed: true }],
  },
] as const;

export const VERIFIER_ABI = [
  {
    name: "verifyAndRecord",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "pA", type: "uint256[2]" },
      { name: "pB", type: "uint256[2][2]" },
      { name: "pC", type: "uint256[2]" },
      { name: "pubSignals", type: "uint256[6]" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "isNullifierUsed",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "nullifier", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const DISBURSEMENT_ABI = [
  {
    name: "disburse",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "did", type: "string" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "pA", type: "uint256[2]" },
      { name: "pB", type: "uint256[2][2]" },
      { name: "pC", type: "uint256[2]" },
      { name: "pubSignals", type: "uint256[6]" },
    ],
    outputs: [],
  },
  {
    name: "currentCycleId",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalDisbursed",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "claimCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "Disbursed",
    type: "event",
    inputs: [
      { name: "did", type: "string", indexed: false },
      { name: "recipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "cycleId", type: "uint256", indexed: true },
      { name: "nullifier", type: "uint256", indexed: false },
    ],
  },
] as const;
