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
    uint256 public disbursementAmount;

    event Disbursed(
        string did,
        address indexed recipient,
        uint256 amount,
        uint256 indexed cycleId,
        uint256 nullifier
    );
    event CycleAdvanced(uint256 newCycleId);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event DisbursementAmountSet(uint256 amount);

    error OnlyAmil();
    error InsufficientFunds(uint256 requested, uint256 available);
    error DisbursementAmountNotSet();

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

    /// @notice Set the fixed disbursement amount per claim (amil only).
    function setDisbursementAmount(uint256 amount) external onlyAmil {
        disbursementAmount = amount;
        emit DisbursementAmountSet(amount);
    }

    /// @notice Disburse zakat to a verified mustahik.
    ///         Anyone can call this — the ZK proof is the authorization.
    function disburse(
        string calldata did,
        address payable recipient,
        uint256, /* amount ignored — use disbursementAmount */
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[6] calldata pubSignals
    ) external {
        uint256 amount = disbursementAmount;
        if (amount == 0) revert DisbursementAmountNotSet();
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
