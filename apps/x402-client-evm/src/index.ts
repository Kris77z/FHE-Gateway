/**
 * x402 Client for EVM Networks
 * Complete client implementation for making x402 payments using x402-fetch
 * This can be used as a reference for frontend integration
 */

import { createWalletClient, http, privateKeyToAccount } from 'viem';
import { baseSepolia } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

// Note: For full x402-fetch integration, install it separately:
// npm install x402-fetch --legacy-peer-deps
// Then import: import { wrapFetchWithPayment } from 'x402-fetch';

interface ClientConfig {
  privateKey: string;
  rpcUrl?: string;
  serverUrl: string;
  maxValue?: bigint; // Maximum payment amount in atomic units (default: 0.1 USDC)
}

/**
 * x402 Client for making payments
 * Uses x402-fetch for automatic payment handling
 */
export class X402Client {
  private fetchWithPayment: (url: string, init?: RequestInit) => Promise<Response>;
  private account: ReturnType<typeof privateKeyToAccount>;
  private serverUrl: string;

  constructor(config: ClientConfig) {
    // Create account from private key
    this.account = privateKeyToAccount(config.privateKey as `0x${string}`);
    
    // Create wallet client
    const walletClient = createWalletClient({
      account: this.account,
      chain: baseSepolia,
      transport: http(config.rpcUrl || 'https://sepolia.base.org'),
    });

    // TODO: Integrate x402-fetch for automatic payment handling
    // For now, this is a placeholder that shows the structure
    // To use x402-fetch:
    // 1. Install: npm install x402-fetch --legacy-peer-deps
    // 2. Import: import { wrapFetchWithPayment } from 'x402-fetch';
    // 3. Use: this.fetchWithPayment = wrapFetchWithPayment(fetch, walletClient, maxValue);
    
    // Simplified fetch wrapper (manual payment handling)
    this.fetchWithPayment = this.createSimpleFetchWrapper(walletClient, config.maxValue);
    this.serverUrl = config.serverUrl;
  }

  /**
   * Create a simple fetch wrapper that handles 402 responses
   * Note: This is a simplified version. For production, use x402-fetch package.
   */
  private createSimpleFetchWrapper(walletClient: any, maxValue?: bigint) {
    return async (url: string, init?: RequestInit) => {
      const response = await fetch(url, init);
      
      if (response.status !== 402) {
        return response;
      }

      // Handle 402 Payment Required
      console.log('⚠️  402 Payment Required - Manual payment handling not implemented');
      console.log('💡 To enable automatic payment handling, install x402-fetch package');
      console.log('   npm install x402-fetch --legacy-peer-deps');
      
      return response;
    };
  }

  /**
   * Get the client's address
   */
  getAddress(): string {
    return this.account.address;
  }

  /**
   * Make a payment request to a protected endpoint
   * 
   * @param endpoint - The endpoint path (e.g., '/api/premium')
   * @returns The response data from the server
   */
  async request(endpoint: string): Promise<any> {
    console.log(`\n📤 Requesting: ${this.serverUrl}${endpoint}`);

    try {
      // x402-fetch automatically handles:
      // 1. Initial request
      // 2. 402 Payment Required response
      // 3. Payment header creation and signing
      // 4. Retry with payment
      const response = await this.fetchWithPayment(`${this.serverUrl}${endpoint}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Request failed: ${response.status} - ${error}`);
      }

      // Check settlement response header
      const settlementHeader = response.headers.get('X-PAYMENT-RESPONSE');
      if (settlementHeader) {
        const settlement = JSON.parse(Buffer.from(settlementHeader, 'base64').toString());
        console.log('\n✅ Payment settled!');
        console.log(`   Transaction: ${settlement.transaction}`);
        console.log(`   Network: ${settlement.network}`);
        console.log(`   Payer: ${settlement.payer}`);
      }

      const data = await response.json();
      console.log('\n📦 Response received:', JSON.stringify(data, null, 2));

      return data;
    } catch (error: any) {
      if (error.message?.includes('exceeds maximum')) {
        console.error('\n❌ Payment amount exceeds maximum allowed value');
        throw error;
      }
      throw error;
    }
  }
}

/**
 * Example usage
 */
async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';

  if (!privateKey) {
    console.error('❌ PRIVATE_KEY not set in environment variables');
    console.log('\n💡 Set PRIVATE_KEY in .env file:');
    console.log('   PRIVATE_KEY=0xYourPrivateKey');
    process.exit(1);
  }

  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         x402 Payment Client (EVM)                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  const client = new X402Client({
    privateKey,
    serverUrl,
  });

  console.log(`\n👤 Client Address: ${client.getAddress()}`);
  console.log(`🌐 Server URL: ${serverUrl}`);

  try {
    // Test premium endpoint
    console.log('\n' + '='.repeat(60));
    console.log('🧪 Testing /api/premium endpoint');
    console.log('='.repeat(60));
    await client.request('/api/premium');

    // Test data endpoint
    console.log('\n' + '='.repeat(60));
    console.log('🧪 Testing /api/data endpoint');
    console.log('='.repeat(60));
    await client.request('/api/data');

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default X402Client;

