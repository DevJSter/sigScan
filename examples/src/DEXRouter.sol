// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract DEXRouter {
    address public owner;
    mapping(address => bool) public authorizedPairs;
    
    event PairCreated(address indexed token0, address indexed token1, address pair);
    event SwapExecuted(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    
    error Unauthorized();
    error InvalidPair(address pair);
    error SwapFailed(string reason);

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createPair(address token0, address token1) external onlyOwner returns (address pair) {
        // Mock pair creation
        pair = address(uint160(uint256(keccak256(abi.encodePacked(token0, token1)))));
        authorizedPairs[pair] = true;
        emit PairCreated(token0, token1, pair);
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        // Mock implementation
        amountA = amountADesired;
        amountB = amountBDesired;
        liquidity = (amountA * amountB) / 1e18;
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        if (path.length < 2) revert SwapFailed("Invalid path");
        
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        
        // Mock swap calculation
        for (uint i = 1; i < path.length; i++) {
            amounts[i] = amounts[i-1] * 99 / 100; // 1% fee
        }
        
        emit SwapExecuted(msg.sender, path[0], path[path.length-1], amountIn, amounts[amounts.length-1]);
    }

    function getAmountsOut(address[] calldata path, uint256 amountIn)
        external
        pure
        returns (uint256[] memory amounts)
    {
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        
        for (uint i = 1; i < path.length; i++) {
            amounts[i] = amounts[i-1] * 99 / 100;
        }
    }

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB)
        external
        pure
        returns (uint256 amountB)
    {
        return (amountA * reserveB) / reserveA;
    }

    function setOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
}
