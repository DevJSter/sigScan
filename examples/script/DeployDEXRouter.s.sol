// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/DEXRouter.sol";

contract DeployDEXRouter is Script {
    address constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    event RouterDeployed(address indexed router, address indexed weth, address indexed factory);
    error DeploymentFailed(string reason);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        try this.deployRouter() returns (address router) {
            emit RouterDeployed(router, WETH, FACTORY);
            console.log("DEXRouter deployed at:", router);
        } catch {
            revert DeploymentFailed("Failed to deploy DEXRouter");
        }

        vm.stopBroadcast();
    }

    function deployRouter() external returns (address) {
        DEXRouter router = new DEXRouter(FACTORY, WETH);
        return address(router);
    }

    function verifyDeployment(address router) external view returns (bool) {
        if (router == address(0)) return false;
        try DEXRouter(router).factory() returns (address factory) {
            return factory == FACTORY;
        } catch {
            return false;
        }
    }
}
