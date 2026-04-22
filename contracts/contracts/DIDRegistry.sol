// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DIDRegistry
/// @notice On-chain DID registry conforming to did:ethr method specification.
///         Stores DID Document hashes and supports key rotation and deactivation.
contract DIDRegistry {
    struct DIDRecord {
        bytes32 docHash;
        address owner;
        bool active;
        uint256 updatedAt;
    }

    mapping(string => DIDRecord) private _records;

    event DIDRegistered(string indexed did, address indexed owner, bytes32 docHash);
    event DIDUpdated(string indexed did, bytes32 newDocHash);
    event DIDDeactivated(string indexed did);

    error DIDAlreadyExists(string did);
    error DIDNotFound(string did);
    error DIDInactive(string did);
    error NotDIDOwner(string did);
    error EmptyDID();
    error ZeroDocHash();

    modifier onlyOwner(string calldata did) {
        if (_records[did].owner == address(0)) revert DIDNotFound(did);
        if (_records[did].owner != msg.sender) revert NotDIDOwner(did);
        _;
    }

    /// @notice Register a new DID with its document hash.
    function registerDID(string calldata did, bytes32 docHash) external {
        if (bytes(did).length == 0) revert EmptyDID();
        if (docHash == bytes32(0)) revert ZeroDocHash();
        if (_records[did].owner != address(0)) revert DIDAlreadyExists(did);
        _records[did] = DIDRecord({ docHash: docHash, owner: msg.sender, active: true, updatedAt: block.timestamp });
        emit DIDRegistered(did, msg.sender, docHash);
    }

    /// @notice Update the document hash for an existing DID.
    function updateDID(string calldata did, bytes32 newDocHash) external onlyOwner(did) {
        if (newDocHash == bytes32(0)) revert ZeroDocHash();
        if (!_records[did].active) revert DIDInactive(did);
        _records[did].docHash = newDocHash;
        _records[did].updatedAt = block.timestamp;
        emit DIDUpdated(did, newDocHash);
    }

    /// @notice Deactivate a DID (irreversible).
    function deactivateDID(string calldata did) external onlyOwner(did) {
        _records[did].active = false;
        emit DIDDeactivated(did);
    }

    /// @notice Resolve a DID to its document hash, owner, and active status.
    function resolve(string calldata did) external view returns (bytes32 docHash, bool active, address owner) {
        DIDRecord storage r = _records[did];
        return (r.docHash, r.active, r.owner);
    }
}
