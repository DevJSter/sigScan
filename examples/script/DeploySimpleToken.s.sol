// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SimpleToken.sol";

contract DeploySimpleToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SimpleToken
        SimpleToken token = new SimpleToken(
            "Test Token",
            "TEST",
            1000000 * 10**18
        );

        console.log("SimpleToken deployed at:", address(token));
        console.log("Total supply:", token.totalSupply());

        vm.stopBroadcast();
    }

    function setUp() external {
        // Setup function for testing the deployment script
    }

    function deployWithCustomParams(
        string memory name,
        string memory symbol,
        uint256 supply
    ) external returns (address) {
        SimpleToken token = new SimpleToken(name, symbol, supply);
        return address(token);
    }
}
