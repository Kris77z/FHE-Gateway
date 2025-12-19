#!/bin/bash
set -e

# Configuration
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BOUNTY_DIR="$ROOT_DIR/bounty"
EXAMPLES_DIR="$BOUNTY_DIR/examples"
FRONTEND_DIR="$EXAMPLES_DIR/frontend-demo"
PAYMENT_GATEWAY_ARTIFACT="$EXAMPLES_DIR/payment-gateway/artifacts/contracts/FHECounter.sol/FHEPaymentGateway.json"

echo "🚀 Setting up Payment Gateway Frontend Demo..."

# 1. Create Next.js App
if [ -d "$FRONTEND_DIR" ]; then
    echo "⚠️  Directory $FRONTEND_DIR already exists. Skipping create-next-app."
else
    echo "📦 Creating Next.js app..."
    mkdir -p "$EXAMPLES_DIR"
    cd "$EXAMPLES_DIR"
    # strict flags to avoid prompts
    npx create-next-app@latest frontend-demo \
        --typescript \
        --tailwind \
        --eslint \
        --app \
        --no-src-dir \
        --import-alias "@/*" \
        --use-npm \
        --no-git # We are already in a git repo
fi

cd "$FRONTEND_DIR"

# 2. Install Dependencies
echo "⬇️  Installing dependencies..."
npm install ethers@6 fhevmjs wagmi viem @tanstack/react-query @rainbow-me/rainbowkit lucide-react clsx tailwind-merge framer-motion encoding

# 3. Setup ABI
echo "📄 Copying ABI..."
mkdir -p abi
# We use node to extract just the abi array to keep it clean
node -e "
    const fs = require('fs');
    try {
        const artifact = JSON.parse(fs.readFileSync('$PAYMENT_GATEWAY_ARTIFACT', 'utf8'));
        fs.writeFileSync('abi/FHEPaymentGateway.json', JSON.stringify(artifact.abi, null, 2));
        console.log('ABI extracted successfully.');
    } catch (e) {
        console.error('Error extracting ABI:', e);
        process.exit(1);
    }
"

# 4. Create Utility Files

mkdir -p lib components app

# --- lib/chains.ts ---
cat > lib/chains.ts << 'EOF'
import { defineChain } from 'viem';

export const localFhevm = defineChain({
  id: 31337,
  name: 'Local FHEVM',
  network: 'local-fhevm',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
});
EOF

# --- lib/fhevm.ts ---
cat > lib/fhevm.ts << 'EOF'
import { createInstance, FhevmInstance } from 'fhevmjs';

let instance: FhevmInstance | null = null;

export const createFhevmInstance = async (): Promise<FhevmInstance> => {
  if (instance) return instance;
  
  // Initialize for localhost (Hardhat FHEVM)
  instance = await createInstance({
    chainId: 31337,
    networkUrl: 'http://127.0.0.1:8545',
    gatewayUrl: 'http://127.0.0.1:8545',
  });
  
  return instance;
};

export const getInstance = () => instance;
EOF

# --- components/Providers.tsx ---
cat > components/Providers.tsx << 'EOF'
'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  action,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { localFhevm } from '@/lib/chains';
import '@rainbow-me/rainbowkit/styles.css';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: 'FHE Demo',
  projectId: 'YOUR_PROJECT_ID', // Not needed for local dev usually
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [localFhevm],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
EOF

# --- app/layout.tsx ---
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FHE Payment Gateway Demo',
  description: 'Confidential Blockchain Payments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
EOF

# --- app/page.tsx ---
# This is the core logic
cat > app/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { createFhevmInstance } from '@/lib/fhevm.ts';
import ABI from '@/abi/FHEPaymentGateway.json';
import { ethers } from 'ethers';
import { Loader2, Lock, Unlock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Replace with your deployed contract address
// You should update this after deploying!
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  
  const [balance, setBalance] = useState<string | null>(null);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [payAmount, setPayAmount] = useState('10');
  const [rateAmount, setRateAmount] = useState('2');

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  useEffect(() => {
    // Init FHEVM
    createFhevmInstance().then(() => {
      console.log('FHEVM instance initialized');
    });
  }, []);

  // Effect to reset state when account changes
  useEffect(() => {
    setBalance(null);
    setIsDecrypted(false);
    setLogs([]);
  }, [address]);
  
  // 1. Decrypt Balance
  const handleDecrypt = async () => {
    if (!address || !window.ethereum) return;
    setLoading(true);
    addLog('Initiating decryption...');
    
    try {
      const instance = await createFhevmInstance();
      
      // Get ciphertext from contract
      // We use a raw call or wagmi read. For simplicity, let's use ethers to read the view function which returns the handle
      // But wait! getEncryptedBalance returns euint32 (handle).
      // We need to re-encrypt it using the key generated by generatePublicKey.
      
      // Standard flow:
      // 1. Generate Token (Signature)
      addLog('Requesting signature for re-encryption key...');
      const { publicKey, signature } = await instance.generateToken({
        verifyingContract: CONTRACT_ADDRESS
      });
      
      // 2. Fetch the handle from the contract
      // We need an ethers provider for easy contract reading or use wagmi useReadContract
      // Let's use vanilla ethers provider wrapper around window.ethereum or standard JSON RPC
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      addLog('Fetching encrypted balance handle from chain...');
      const balanceHandle = await contract.getEncryptedBalance(address);
      addLog(`Encrypted Handle: ${balanceHandle.toString()}`);

      // 3. Decrypt
      addLog('Decrypting with private key...');
      // Reencrypt is usually done via a gateway or view function re-encryption, 
      // but simpler for local dev: The view function returns the handle, but we need the ciphertext.
      // Wait, in FHEVM, we usually use instance.reencrypt (connecting to the gateway)
      // to re-encrypt the on-chain value (handle) to the user's public key.
      
      const decrypted = await instance.reencrypt(
        balanceHandle, // The handle on-chain
        publicKey,
        signature,
        CONTRACT_ADDRESS,
        address
      );
      
      setBalance(decrypted.toString());
      setIsDecrypted(true);
      addLog(`✅ Decrypted successfully! Balance: ${decrypted}`);
      
    } catch (e: any) {
      console.error(e);
      addLog(`❌ Error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Payment (Write)
  const handleAddPayment = async () => {
    if (!address) return;
    setLoading(true);
    addLog(`Encrypting Payment Amount: ${payAmount}...`);
    
    try {
      const instance = await createFhevmInstance();
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(Number(payAmount));
      const encryptedInput = input.encrypt();
      
      addLog('Submitting transaction with Proof...');
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'addPayment',
        args: [encryptedInput.handles[0], encryptedInput.inputProof],
      });
      
      addLog(`Transaction Sent! Hash: ${tx}`);
      setBalance(null); // Invalidated
      setIsDecrypted(false);
    } catch (e: any) {
       addLog(`❌ Error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Apply Rate (Write)
  const handleApplyRate = async () => {
    if (!address) return;
    setLoading(true);
    addLog(`Encrypting Rate: ${rateAmount}...`);
    
    try {
      const instance = await createFhevmInstance();
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(Number(rateAmount));
      const encryptedInput = input.encrypt();
      
      addLog('Submitting transaction with Proof...');
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'applyRate',
        args: [encryptedInput.handles[0], encryptedInput.inputProof],
      });
      
      addLog(`Transaction Sent! Hash: ${tx}`);
      setBalance(null); // Invalidated
      setIsDecrypted(false);
    } catch (e: any) {
       addLog(`❌ Error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 font-mono">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tighter">FHE Payment Gateway</h1>
        </div>
        <ConnectButton />
      </div>

      {/* Main Dashboard */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Balance Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💰</div>
          <h2 className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Private Balance</h2>
          
          <div className="h-24 flex items-center">
            <AnimatePresence mode="wait">
              {isConnected ? (
                isDecrypted ? (
                  <motion.div 
                    key="decrypted"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-bold text-green-400 font-mono"
                  >
                    {balance} USDC
                  </motion.div>
                ) : (
                  <motion.div 
                    key="encrypted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-start gap-4"
                  >
                    <div className="text-4xl font-mono text-zinc-600 blur-sm select-none">
                      0x7Fb...3a1
                    </div>
                    <button 
                      onClick={handleDecrypt}
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
                    >
                      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      Decrypt Balance
                    </button>
                  </motion.div>
                )
              ) : (
                 <div className="text-xl text-zinc-600">Please connect wallet</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-4">
          
          {/* Add Payment */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-zinc-800 text-zinc-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Add Payment
            </h3>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="bg-black border border-zinc-700 rounded p-2 flex-1 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Amount"
              />
              <button 
                onClick={handleAddPayment}
                disabled={loading || !isConnected}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                Encrypt & Send
              </button>
            </div>
          </div>

          {/* Apply Rate */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-zinc-800 text-zinc-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Apply Multiplier
            </h3>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={rateAmount}
                onChange={e => setRateAmount(e.target.value)}
                className="bg-black border border-zinc-700 rounded p-2 flex-1 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Rate (e.g. 2)"
              />
               <button 
                onClick={handleApplyRate}
                disabled={loading || !isConnected}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                Encrypt & Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Logs */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-black border border-zinc-800 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs">
          <div className="text-zinc-500 mb-2 border-b border-zinc-900 pb-2">Console Output</div>
          {logs.length === 0 && <span className="text-zinc-700">Waiting for actions...</span>}
          {logs.map((log, i) => (
            <div key={i} className="text-green-500/80 mb-1 font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
EOF

echo "✅ Setup complete! To run the demo:"
echo "cd $FRONTEND_DIR"
echo "npm run dev"
echo ""
echo "NOTE: Make sure your hardhat node is running and the contract deployed."
echo "Update CONTRACT_ADDRESS in app/page.tsx with your actual deployed address."
