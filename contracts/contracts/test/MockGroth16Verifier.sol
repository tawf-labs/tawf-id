// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MockGroth16Verifier — for testing only
/// @notice Always returns true — lets MustahikVerifier handle eligibility logic
contract MockGroth16Verifier {
    function verifyProof(
        uint[2] calldata,
        uint[2][2] calldata,
        uint[2] calldata,
        uint[7] calldata
    ) external pure returns (bool) {
        return true;
    }
}
