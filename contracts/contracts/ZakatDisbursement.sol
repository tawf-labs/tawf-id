// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MustahikVerifier.sol";

/// @title ZakatDisbursement
/// @notice Conditional zakat release upon successful ZK proof verification.
///         Holds ETH and disburses to verified mustahik recipients.
contract ZakatDisbursement {
    MustahikVerifier public immutable verifier;
    address public immutable amil;

    uint256 public currentCycleId;
    uint256 public totalDisbursed;
    uint256 public claimCount;

    event Disbursed(
        string did,
        address indexed recipient,
        uint256 amount,
        uint256 indexed cycleId,
        uint256 nullifier
    );
    event CycleAdvanced(uint256 newCycleId);
    event FundsDeposited(address indexed depositor, uint256 amount);

    error OnlyAmil();
    error InsufficientFunds(uint256 requested, uint256 available);
    error ZeroAmount();

    modifier onlyAmil() {
        if (msg.sender != amil) revert OnlyAmil();
        _;
    }

    constructor(address _verifier) {
        verifier = MustahikVerifier(_verifier);
        amil = msg.sender;
        currentCycleId = 1;
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /// @notice Disburse zakat to a verified mustahik.
    ///         Verifies the ZK proof inline before releasing funds.
    function disburse(
        string calldata did,
        address payable recipient,
        uint256 amount,
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[6] calldata pubSignals
    ) external onlyAmil {
        if (amount == 0) revert ZeroAmount();
        if (address(this).balance < amount) revert InsufficientFunds(amount, address(this).balance);

        verifier.verifyAndRecord(pA, pB, pC, pubSignals);

        uint256 nullifier = pubSignals[0];
        totalDisbursed += amount;
        claimCount += 1;

        recipient.transfer(amount);
        emit Disbursed(did, recipient, amount, currentCycleId, nullifier);
    }

    /// @notice Advance to the next zakat cycle (amil only).
    function advanceCycle() external onlyAmil {
        currentCycleId += 1;
        emit CycleAdvanced(currentCycleId);
    }

    /// @notice Withdraw remaining funds (amil only, emergency).
    function withdraw(uint256 amount) external onlyAmil {
        payable(amil).transfer(amount);
    }
}
