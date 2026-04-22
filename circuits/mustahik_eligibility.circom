pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/bitify.circom";

/*
 * MustahikEligibility
 *
 * Private inputs (witness):
 *   income        - monthly income in IDR (integer, scaled)
 *   assets        - total non-exempt assets in IDR (integer, scaled)
 *   sk_did        - DID private key scalar
 *
 * Public inputs:
 *   nisab_threshold  - current nisab value in IDR
 *   asset_ceiling    - maximum asset value for eligibility
 *   cycle_id         - current zakat cycle identifier
 *   commitment       - Poseidon(income, assets, sk_did) — binds witness to DID
 *   recipient        - claimant's ETH address as field element (binds proof to recipient)
 *
 * Public outputs:
 *   nullifier        - Poseidon(sk_did, cycle_id) — prevents double-claiming
 *   eligible         - 1 if income <= nisab AND assets <= ceiling, else 0
 */
template MustahikEligibility() {
    // Private witness
    signal input income;
    signal input assets;
    signal input sk_did;

    // Public inputs
    signal input nisab_threshold;
    signal input asset_ceiling;
    signal input cycle_id;
    signal input commitment;
    signal input recipient;  // ETH address as uint160 field element

    // Public outputs
    signal output nullifier;
    signal output eligible;

    // -------------------------------------------------------
    // 1. Commitment check: verify witness is bound to DID
    // -------------------------------------------------------
    component com = Poseidon(3);
    com.inputs[0] <== income;
    com.inputs[1] <== assets;
    com.inputs[2] <== sk_did;
    com.out === commitment;

    // -------------------------------------------------------
    // 2. Range proof: income <= nisab_threshold
    // -------------------------------------------------------
    component incomeCheck = LessEqThan(64);
    incomeCheck.in[0] <== income;
    incomeCheck.in[1] <== nisab_threshold;

    // -------------------------------------------------------
    // 3. Asset bound: assets <= asset_ceiling
    // -------------------------------------------------------
    component assetCheck = LessEqThan(64);
    assetCheck.in[0] <== assets;
    assetCheck.in[1] <== asset_ceiling;

    // -------------------------------------------------------
    // 4. Eligibility: both conditions must hold
    // -------------------------------------------------------
    eligible <== incomeCheck.out * assetCheck.out;

    // -------------------------------------------------------
    // 5. Nullifier: Poseidon(sk_did, cycle_id)
    // -------------------------------------------------------
    component nul = Poseidon(2);
    nul.inputs[0] <== sk_did;
    nul.inputs[1] <== cycle_id;
    nullifier <== nul.out;
}

component main {public [nisab_threshold, asset_ceiling, cycle_id, commitment, recipient]} = MustahikEligibility();
