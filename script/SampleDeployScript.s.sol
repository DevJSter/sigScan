// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SampleDeployScript {
    event DeploymentCompleted(address indexed contractAddress, uint256 timestamp);
    error InvalidConfiguration(string message);

    struct Config {
        string name;
        address owner;
        uint256 value;
    }

    function deploy(Config memory config) external payable returns (address) {
        if (bytes(config.name).length == 0) {
            revert InvalidConfiguration("Name cannot be empty");
        }

        address deployedContract = address(uint160(uint256(keccak256(abi.encodePacked(config.name, block.timestamp)))));
        emit DeploymentCompleted(deployedContract, block.timestamp);
        
        return deployedContract;
    }

    function batchDeploy(Config[] memory configs) external returns (address[] memory) {
        address[] memory deployed = new address[](configs.length);
        
        for (uint i = 0; i < configs.length; i++) {
            deployed[i] = this.deploy(configs[i]);
        }
        
        return deployed;
    }

    function estimateGas(Config memory config) external pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(config.name))) % 500000 + 100000;
    }
}
