// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title IGroth16Verifier
/// @notice Interface matching the SnarkJS-generated Groth16Verifier.
///         pubSignals has 7 elements: [nullifier, eligible, nisab_threshold, asset_ceiling, cycle_id, commitment, recipient]
interface IGroth16Verifier {
    function verifyProof(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[7] calldata pubSignals
    ) external view returns (bool);
}

/// @title MustahikVerifier
/// @notice Wraps the Groth16 verifier with nullifier-based double-claim prevention.
///
/// pubSignals layout:
///   [0] nullifier
///   [1] eligible        (must be 1)
///   [2] nisab_threshold
///   [3] asset_ceiling
///   [4] cycle_id
///   [5] commitment
///   [6] recipient       (ETH address as uint160 — proof is bound to this address)
contract MustahikVerifier is ReentrancyGuard {
    IGroth16Verifier public immutable groth16Verifier;

    mapping(uint => bool) public isNullifierUsed;

    event ProofVerified(uint indexed nullifier, uint indexed cycleId, address indexed submitter);

    error InvalidProof();
    error NotEligible();
    error NullifierAlreadyUsed(uint nullifier);
    error RecipientMismatch();
    error ZeroAddress();

    constructor(address _groth16Verifier) {
        if (_groth16Verifier == address(0)) revert ZeroAddress();
        groth16Verifier = IGroth16Verifier(_groth16Verifier);
    }

    /// @notice Verify a Groth16 proof and record the nullifier.
    /// @dev Follows CEI: recipient check → proof verify → nullifier check → state write
    /// @param pA  Proof component A
    /// @param pB  Proof component B
    /// @param pC  Proof component C
    /// @param pubSignals [nullifier, eligible, nisab_threshold, asset_ceiling, cycle_id, commitment, recipient]
    /// @param recipient  The address that will receive funds — must match pubSignals[6]
    function verifyAndRecord(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[7] calldata pubSignals,
        address recipient
    ) external nonReentrant returns (bool) {
        uint nullifier = pubSignals[0];
        uint eligible  = pubSignals[1];
        uint cycleId   = pubSignals[4];

        // CHECKS
        if (uint160(recipient) != pubSignals[6]) revert RecipientMismatch();
        if (!groth16Verifier.verifyProof(pA, pB, pC, pubSignals)) revert InvalidProof();
        if (eligible != 1) revert NotEligible();
        if (isNullifierUsed[nullifier]) revert NullifierAlreadyUsed(nullifier);

        // EFFECTS
        isNullifierUsed[nullifier] = true;
        emit ProofVerified(nullifier, cycleId, msg.sender);
        return true;
    }
}
