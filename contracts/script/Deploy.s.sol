// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/Groth16Verifier.sol";
import "../contracts/DIDRegistry.sol";
import "../contracts/MustahikVerifier.sol";
import "../contracts/ZakatDisbursement.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        Groth16Verifier groth16 = new Groth16Verifier();
        DIDRegistry didRegistry = new DIDRegistry();
        MustahikVerifier verifier = new MustahikVerifier(address(groth16));
        ZakatDisbursement disbursement = new ZakatDisbursement(address(verifier));

        vm.stopBroadcast();

        console.log("Groth16Verifier:   ", address(groth16));
        console.log("DIDRegistry:       ", address(didRegistry));
        console.log("MustahikVerifier:  ", address(verifier));
        console.log("ZakatDisbursement: ", address(disbursement));
    }
}
