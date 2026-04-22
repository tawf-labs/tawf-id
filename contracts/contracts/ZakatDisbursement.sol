// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MustahikVerifier.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ZakatDisbursement
/// @notice Conditional zakat release upon successful ZK proof verification.
///         Holds ETH and disburses to verified mustahik recipients.
contract ZakatDisbursement is ReentrancyGuard, Pausable, Ownable {
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
    error InvalidRecipient();
    error TransferFailed();

    modifier onlyAmil() {
        if (msg.sender != amil) revert OnlyAmil();
        _;
    }

    constructor(address _verifier) Ownable(msg.sender) {
        if (_verifier == address(0)) revert InvalidRecipient();
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
    /// @dev Follows CEI pattern: Checks → Effects → Interactions
    function disburse(
        string calldata did,
        address payable recipient,
        uint256, /* amount ignored — use disbursementAmount */
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[7] calldata pubSignals
    ) external nonReentrant whenNotPaused {
        // CHECKS
        if (recipient == address(0)) revert InvalidRecipient();
        uint256 amount = disbursementAmount;
        if (amount == 0) revert DisbursementAmountNotSet();
        if (address(this).balance < amount) revert InsufficientFunds(amount, address(this).balance);

        // Verify proof (external call to verifier)
        verifier.verifyAndRecord(pA, pB, pC, pubSignals, recipient);

        // EFFECTS
        uint256 nullifier = pubSignals[0];
        totalDisbursed += amount;
        claimCount += 1;

        // INTERACTIONS (use call instead of transfer for compatibility)
        (bool success, ) = recipient.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Disbursed(did, recipient, amount, currentCycleId, nullifier);
    }

    /// @notice Advance to the next zakat cycle (amil only).
    function advanceCycle() external onlyAmil {
        currentCycleId += 1;
        emit CycleAdvanced(currentCycleId);
    }

    /// @notice Withdraw remaining funds (amil only, emergency).
    function withdraw(uint256 amount) external onlyAmil nonReentrant {
        (bool success, ) = payable(amil).call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    /// @notice Emergency pause (owner only).
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause (owner only).
    function unpause() external onlyOwner {
        _unpause();
    }
}
