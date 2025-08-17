// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HardhatDeployScript {
    event ContractDeployed(address indexed contractAddress, string name);
    error DeploymentError(string message);

    struct DeploymentConfig {
        string name;
        string symbol;
        uint256 initialSupply;
        address owner;
    }

    function deployToken(DeploymentConfig memory config) external returns (address) {
        if (bytes(config.name).length == 0) {
            revert DeploymentError("Token name cannot be empty");
        }

        // Simulate token deployment
        address tokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(config.name, block.timestamp)))));
        emit ContractDeployed(tokenAddress, config.name);
        
        return tokenAddress;
    }

    function deployMultipleContracts(
        string[] memory names,
        string[] memory symbols,
        uint256[] memory supplies
    ) external returns (address[] memory) {
        require(names.length == symbols.length && symbols.length == supplies.length, "Arrays length mismatch");
        
        address[] memory deployedContracts = new address[](names.length);
        
        for (uint256 i = 0; i < names.length; i++) {
            DeploymentConfig memory config = DeploymentConfig({
                name: names[i],
                symbol: symbols[i],
                initialSupply: supplies[i],
                owner: msg.sender
            });
            
            deployedContracts[i] = this.deployToken(config);
        }
        
        return deployedContracts;
    }

    function getDeploymentGas(string memory contractName) external pure returns (uint256) {
        // Simulate gas estimation
        return uint256(keccak256(abi.encodePacked(contractName))) % 1000000 + 200000;
    }
}
