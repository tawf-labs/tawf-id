// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IGroth16Verifier
/// @notice Interface matching the SnarkJS-generated Groth16Verifier.
///         pubSignals has 6 elements: [nullifier, eligible, nisab_threshold, asset_ceiling, cycle_id, commitment]
///         (circuit outputs come first, then public inputs)
interface IGroth16Verifier {
    function verifyProof(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[6] calldata pubSignals
    ) external view returns (bool);
}

/// @title MustahikVerifier
/// @notice Wraps the Groth16 verifier with nullifier-based double-claim prevention.
///
/// pubSignals layout (snarkjs output order — outputs first, then public inputs):
///   [0] nullifier
///   [1] eligible        (must be 1)
///   [2] nisab_threshold
///   [3] asset_ceiling
///   [4] cycle_id
///   [5] commitment
contract MustahikVerifier {
    IGroth16Verifier public immutable groth16Verifier;

    mapping(uint => bool) public isNullifierUsed;

    event ProofVerified(uint indexed nullifier, uint indexed cycleId, address indexed submitter);

    error InvalidProof();
    error NotEligible();
    error NullifierAlreadyUsed(uint nullifier);

    constructor(address _groth16Verifier) {
        groth16Verifier = IGroth16Verifier(_groth16Verifier);
    }

    /// @notice Verify a Groth16 proof and record the nullifier.
    /// @param pA  Proof component A
    /// @param pB  Proof component B
    /// @param pC  Proof component C
    /// @param pubSignals [nullifier, eligible, nisab_threshold, asset_ceiling, cycle_id, commitment]
    function verifyAndRecord(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[6] calldata pubSignals
    ) external returns (bool) {
        uint nullifier = pubSignals[0];
        uint eligible  = pubSignals[1];
        uint cycleId   = pubSignals[4];

        if (!groth16Verifier.verifyProof(pA, pB, pC, pubSignals)) revert InvalidProof();
        if (eligible != 1) revert NotEligible();
        if (isNullifierUsed[nullifier]) revert NullifierAlreadyUsed(nullifier);

        isNullifierUsed[nullifier] = true;
        emit ProofVerified(nullifier, cycleId, msg.sender);
        return true;
    }
}
