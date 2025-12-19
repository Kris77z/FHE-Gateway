/**
 * x402 Payment Test Client
 * Tests the x402 payment flow with PayAI Facilitator
 */

import dotenv from 'dotenv';
import { ethers } from 'ethers';

// Load environment variables
dotenv.config({ path: new URL('../apps/x402-server-evm/.env', import.meta.url).pathname });

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://facilitator.payai.network';
const NETWORK = process.env.NETWORK || 'base-sepolia';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || 'https://sepolia.base.org';

// Test endpoints
const TEST_ENDPOINTS = [
  { path: '/api/premium', amount: '0.01', description: 'Premium content' },
  { path: '/api/data', amount: '0.05', description: 'Data endpoint' },
];

/**
 * Create payment payload for x402 protocol
 * This is a simplified version - in production, use @payai-network/x402-client
 */
async function createPaymentPayload(paymentRequirements, privateKey) {
  console.log('\n📝 Creating payment payload...');
  
  // Initialize wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log(`   Wallet: ${wallet.address}`);
  
  // Extract payment requirement
  const requirement = paymentRequirements.accepts[0];
  const amount = BigInt(requirement.maxAmountRequired);
  
  console.log(`   Amount: ${ethers.formatUnits(amount, 6)} USDC`);
  console.log(`   Pay To: ${requirement.payTo}`);
  console.log(`   Asset: ${requirement.asset}`);
  
  // TODO: Implement actual x402 payment payload creation
  // This requires:
  // 1. Create EIP-712 message for payment
  // 2. Sign message with wallet
  // 3. Format as x402 payment payload
  // 4. Encode as base64 for X-PAYMENT header
  
  // For now, return a placeholder
  // In production, use @payai-network/x402-client package
  const paymentPayload = {
    x402Version: 1,
    scheme: requirement.scheme,
    network: requirement.network,
    payload: {
      // TODO: Add actual payment signature and message
      signature: '0x...',
      message: {
        payTo: requirement.payTo,
        amount: requirement.maxAmountRequired,
        asset: requirement.asset,
        nonce: Date.now().toString(),
      },
    },
  };
  
  return Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
}

/**
 * Test payment flow for an endpoint
 */
async function testPayment(endpoint) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing: ${endpoint.path}`);
  console.log(`   Description: ${endpoint.description}`);
  console.log(`   Amount: $${endpoint.amount} USDC`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    // Step 1: Initial request (should get 402)
    console.log('\n📤 Step 1: Requesting protected resource...');
    const initialResponse = await fetch(`${SERVER_URL}${endpoint.path}`);
    
    if (initialResponse.status !== 402) {
      console.error(`   ❌ Expected 402, got ${initialResponse.status}`);
      return;
    }
    
    console.log('   ✅ Received 402 Payment Required');
    
    // Step 2: Parse payment requirements
    const paymentRequirements = await initialResponse.json();
    console.log('\n📋 Step 2: Payment requirements received');
    console.log(`   Network: ${paymentRequirements.accepts[0].network}`);
    console.log(`   Amount: ${paymentRequirements.accepts[0].maxAmountRequired} (atomic units)`);
    
    if (!PRIVATE_KEY) {
      console.error('\n   ❌ PRIVATE_KEY not set in environment variables');
      console.log('   💡 Set PRIVATE_KEY in .env file to test payment');
      return;
    }
    
    // Step 3: Create payment payload
    console.log('\n🔐 Step 3: Creating payment payload...');
    const xPayment = await createPaymentPayload(paymentRequirements, PRIVATE_KEY);
    
    // Step 4: Retry request with payment
    console.log('\n🚀 Step 4: Sending request with payment...');
    const paidResponse = await fetch(`${SERVER_URL}${endpoint.path}`, {
      headers: {
        'X-PAYMENT': xPayment,
      },
    });
    
    if (paidResponse.ok) {
      const data = await paidResponse.json();
      console.log('   ✅ Payment successful!');
      console.log('   📦 Response:', JSON.stringify(data, null, 2));
    } else {
      console.error(`   ❌ Payment failed: ${paidResponse.status}`);
      const error = await paidResponse.text();
      console.error('   Error:', error);
    }
    
  } catch (error) {
    console.error('\n   ❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         x402 Payment Test Client (EVM)                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  console.log('\n📋 Configuration:');
  console.log(`   Server URL: ${SERVER_URL}`);
  console.log(`   Facilitator: ${FACILITATOR_URL}`);
  console.log(`   Network: ${NETWORK}`);
  console.log(`   RPC URL: ${RPC_URL}`);
  
  if (!PRIVATE_KEY) {
    console.log('\n⚠️  Warning: PRIVATE_KEY not set');
    console.log('   Payment creation will be skipped');
    console.log('   Set PRIVATE_KEY in .env to test full payment flow\n');
  }
  
  // Test health endpoint
  try {
    console.log('\n🏥 Testing health endpoint...');
    const healthResponse = await fetch(`${SERVER_URL}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('   ✅ Server is healthy:', health);
    } else {
      console.error('   ❌ Server health check failed');
      return;
    }
  } catch (error) {
    console.error('   ❌ Cannot connect to server:', error.message);
    console.log('\n💡 Make sure the server is running:');
    console.log('   cd apps/x402-server-evm && npm run dev\n');
    return;
  }
  
  // Test payment endpoints
  for (const endpoint of TEST_ENDPOINTS) {
    await testPayment(endpoint);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed!');
  console.log('='.repeat(60) + '\n');
}

// Run
main().catch(console.error);



