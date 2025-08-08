// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library MathUtils {
    function multiply(uint256 a, uint256 b) external pure returns (uint256) {
        return a * b;
    }
    
    function divide(uint256 a, uint256 b) external pure returns (uint256) {
        require(b > 0, "Division by zero");
        return a / b;
    }
    
    function sqrt(uint256 y) external pure returns (uint256) {
        if (y > 3) {
            uint256 x = y;
            uint256 z = (x + 1) / 2;
            while (z < x) {
                x = z;
                z = (x + y / x) / 2;
            }
            return x;
        } else if (y != 0) {
            return 1;
        }
        return 0;
    }
    
    event CalculationPerformed(uint256 result);
    error InvalidOperation(string reason);
}
