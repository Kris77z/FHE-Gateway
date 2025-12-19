/**
 * Server Configuration
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';

dotenv.config();

interface Config {
  facilitatorUrl: string;
  network: string;
  payToAddress: string;
  usdcContractAddress: string;
  rpcUrl: string;
  chainId: number;
  port: number;
  logLevel: string;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || defaultValue!;
}

export const config: Config = {
  facilitatorUrl: getEnvVar('FACILITATOR_URL', 'https://facilitator.payai.network'),
  network: getEnvVar('NETWORK', 'base-sepolia'),
  payToAddress: getEnvVar('PAY_TO_ADDRESS'),
  usdcContractAddress: getEnvVar('USDC_CONTRACT_ADDRESS', '0x036CbD53842c5426634e7929541eC2318f3dCF7e'),
  rpcUrl: getEnvVar('RPC_URL', 'https://sepolia.base.org'),
  chainId: parseInt(getEnvVar('CHAIN_ID', '84532'), 10),
  port: parseInt(getEnvVar('PORT', '3001'), 10),
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
};

// Validate configuration
if (!config.payToAddress || !config.payToAddress.startsWith('0x')) {
  throw new Error('PAY_TO_ADDRESS must be a valid EVM address (starts with 0x)');
}

console.log('✅ Configuration loaded:');
console.log(`   Facilitator: ${config.facilitatorUrl}`);
console.log(`   Network: ${config.network}`);
console.log(`   Pay To: ${config.payToAddress}`);
console.log(`   Port: ${config.port}`);



