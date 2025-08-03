#!/usr/bin/env node

// Simple test script to demonstrate core functionality
const { generateFunctionSelector, generateEventSignature } = require('./src/utils/helpers');

console.log('SigScan Core Functionality Test');
console.log('================================');

// Test function signatures
const functionSignatures = [
  'transfer(address,uint256)',
  'approve(address,uint256)',
  'transferFrom(address,address,uint256)',
  'createPair(address,address)',
  'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)'
];

console.log('\nFunction Signatures:');
functionSignatures.forEach(sig => {
  const selector = generateFunctionSelector(sig);
  console.log(`${sig.padEnd(50)} --> ${selector}`);
});

// Test event signatures
const eventSignatures = [
  'Transfer(address,address,uint256)',
  'Approval(address,address,uint256)',
  'PairCreated(address,address,address)',
  'SwapExecuted(address,address,address,uint256,uint256)'
];

console.log('\nEvent Signatures:');
eventSignatures.forEach(sig => {
  const hash = generateEventSignature(sig);
  console.log(`${sig.padEnd(50)} --> ${hash}`);
});

console.log('\nTest completed successfully! ✅');
console.log('\nNext steps:');
console.log('1. npm run build - Build the project');
console.log('2. npm run cli scan -- --path ./examples - Test CLI scanner');
console.log('3. Install as VS Code extension for full functionality');
