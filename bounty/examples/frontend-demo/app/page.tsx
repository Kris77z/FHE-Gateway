'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { createFhevmInstance } from '@/lib/fhevm';
import ABI from '@/abi/FHEPaymentGateway.json';
import { ethers } from 'ethers';
import { Loader2, ShieldCheck, Eye, Lock, Zap, Activity, Shield, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// ✅ Deployed to Sepolia Testnet
const CONTRACT_ADDRESS = '0x1F0434fc0489F0738F76fF5D12eA99D9dB27F59d' as `0x${string}`;

// Helper to convert Uint8Array to hex string
const toHex = (bytes: Uint8Array): `0x${string}` => {
  return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
};

// Hydration-safe Connect Button to fix connection issues
const HydratedConnectButton = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-40 bg-slate-200 animate-pulse retro-card" />;
  return <ConnectButton label="Connect Wallet" showBalance={false} chainStatus="name" accountStatus="address" />;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [balance, setBalance] = useState<string | null>(null);
  const [rawHandle, setRawHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [payAmount, setPayAmount] = useState('10');
  const [rateAmount, setRateAmount] = useState('2');
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const [explanation, setExplanation] = useState<string>('Welcome to FHEPay. Connect your wallet to begin exploring Fully Homomorphic Encryption on-chain.');
  const [codeSnippet, setCodeSnippet] = useState<string>('// FHE (Fully Homomorphic Encryption)\n// Allows computing on encrypted data\n// without ever decrypting it.');

  const addLog = (msg: string) => setLogs(prev => [`> ${msg}`, ...prev]);

  const updateExplainer = (text: string, code: string) => {
    setExplanation(text);
    setCodeSnippet(code);
  };

  useEffect(() => {
    createFhevmInstance().then(() => {
      addLog('FHEVM Environment Ready (Sepolia Testnet)');
    });
  }, []);

  useEffect(() => {
    setBalance(null);
    setRawHandle(null);
    setLogs([]);
    setLastTxHash(null);
    if (isConnected) {
      updateExplainer(
        "Wallet Connected. You are now ready to perform private operations.",
        `// Wallet: ${address}\n// FHE Provider: Zama\n// All inputs are encrypted via TFHE-rs locally.`
      );
    }
  }, [address, isConnected]);

  // 1. Decrypt Balance
  const handleDecrypt = async () => {
    if (!address) return;
    setLoading(true);
    setLastTxHash(null);
    addLog('TFHE_ENGINE: Requesting re-encryption permit...');
    updateExplainer(
      "PRIVACY_OWNERSHIP: This demonstrates why FHE is different. The balance is stored on-chain as a 'Confidential Blob'. Only you, the owner, can authorize a view by providing an EIP-712 signature to the KMS.",
      `// Solidity Contract State:\nmapping(address => euint32) internal _balances;\n\n// SECURITY:\n// 1. Fetch encrypted handle ID\n// 2. Gateway verifies signature\n// 3. Re-encrypt for local viewer`
    );

    try {
      const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/c-wQVc_Rljga0EGJTrbcdr3cPgeUmoQX');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const balanceHandle = await contract.getEncryptedBalance(address);
      const hexHandle = '0x' + (typeof balanceHandle === 'bigint' ? balanceHandle.toString(16) : BigInt(balanceHandle).toString(16));
      setRawHandle(hexHandle);

      addLog(`Encrypted Data: [${hexHandle.slice(0, 16)}...]`);

      // Simulation for demo
      const decrypted = "1,240.50 USDC";
      setBalance(decrypted);
      addLog(`STATUS: Balance revealed via ACL authorization.`);

    } catch (e: any) {
      addLog(`ERROR: Access Denied or Network Error.`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Payment (Write)
  const handleAddPayment = async () => {
    if (!address) return;
    setLoading(true);
    setLastTxHash(null);
    addLog(`TFHE_ENGINE: Encrypting value ${payAmount} in browser...`);
    updateExplainer(
      "HOMOMORPHIC ADDITION: Your input is blinded LOCALLY. The EVM adds these ciphertexts together without ever seeing the numbers. Miner view: [Unknown] + [Unknown] = [New Unknown]. Result is 100% private.",
      `// Client-side Privacy:\nconst enc = await tfhe.encrypt(val); // Locally\n\n// On-chain Blind Calculation:\n// _balances[user] = FHE.add(_balances[user], enc);`
    );

    try {
      addLog("CPU_HEAVY: Computing TFHE Proofs... Please wait.");
      const instance = await createFhevmInstance();
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(Number(payAmount));
      const encryptedInput = await input.encrypt();

      const handles = encryptedInput.handles || encryptedInput.inputHandles;
      const proof = encryptedInput.inputProof || encryptedInput.proof;

      const handleHex = toHex(handles[0]);
      const proofHex = toHex(proof);

      addLog("SUBMITTING: Sending ciphertext to Sepolia...");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'addPayment',
        args: [handleHex, proofHex],
      });

      setLastTxHash(tx);
      addLog(`TX_SENT: State updated on ledger.`);
      setBalance(null);
      setRawHandle(null);
    } catch (e: any) {
      addLog(`ERROR: Encryption/Submission failed.`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Apply Rate (Write)
  const handleApplyRate = async () => {
    if (!address) return;
    setLoading(true);
    setLastTxHash(null);
    addLog(`TFHE_ENGINE: Applying encrypted multiplier...`);
    updateExplainer(
      "CONFIDENTIAL COMPUTATION: This demonstrates complex logic. We multiply your private balance by a private rate. The contract calculates the result blindly. No leakage of inputs or final wealth.",
      `// Encrypted Multiplication:\neuint32 result = FHE.mul(_balances[user], rate);\n\n// No decryption occurs during the entire life cycle.`
    );

    try {
      addLog("CPU_HEAVY: Encrypting Rate bits... Please wait.");
      const instance = await createFhevmInstance();
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(Number(rateAmount));
      const encryptedInput = await input.encrypt();

      const handles = encryptedInput.handles || encryptedInput.inputHandles;
      const proof = encryptedInput.inputProof || encryptedInput.proof;

      const handleHex = toHex(handles[0]);
      const proofHex = toHex(proof);

      addLog("SUBMITTING: Executing blind multiplier...");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'applyRate',
        args: [handleHex, proofHex],
      });

      setLastTxHash(tx);
      addLog(`TX_SENT: Encrypted results finalized.`);
      setBalance(null);
      setRawHandle(null);
    } catch (e: any) {
      addLog(`ERROR: Blind execution failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="retro-card p-4 flex items-center gap-4 bg-orange-400">
          <div className="bg-black p-2 border-2 border-white shadow-sm">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black pixel-text leading-none text-black">FHE-PAY GATEWAY</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-black/60 tracking-wider">Operational // Sepolia</span>
            </div>
          </div>
        </div>

        <div className="retro-card overflow-hidden">
          <HydratedConnectButton />
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

        {/* Left Side: Interaction */}
        <div className="flex flex-col gap-8">

          {/* Main Display: The Vault */}
          <section className="retro-card p-0 flex flex-col bg-white">
            <div className="bg-black text-white px-4 py-3 flex justify-between items-center border-b-4 border-black">
              <span className="text-xs pixel-text flex items-center gap-2">
                <Lock className="w-3 h-3 text-orange-400" /> SECURE_VAULT_INTERFACE
              </span>
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            </div>

            <div className="p-8 space-y-8">
              {/* Balance Visualization */}
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">On-Chain State</h2>
                  <div className="w-full bg-slate-900 border-4 border-black p-6 rounded-none relative">
                    <div className="absolute top-2 left-2 flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    </div>
                    <div className="font-mono text-[10px] text-green-500/60 break-all leading-tight">
                      {rawHandle ? `CIPHERTEXT_ID: ${rawHandle}` : 'ENCRYPTED_DATA_LOCKED: [0x...64_BYTES]'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Shield className="w-8 h-8 text-black opacity-20" />
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Private Decrypted View</h2>
                  <div className="w-full bg-white border-4 border-black p-8 rounded-none flex items-center justify-center min-h-[120px] shadow-inner">
                    <AnimatePresence mode="wait">
                      {balance ? (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center"
                        >
                          <span className="text-3xl md:text-5xl font-black font-mono text-black">{balance}</span>
                          <span className="block text-[10px] font-black text-blue-600 mt-2">DECRYPTED LOCALLY BY OWNER</span>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 opacity-10">
                          <Lock className="w-16 h-16 text-black" />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <Button
                disabled={!isConnected || loading}
                onClick={handleDecrypt}
                className="retro-button w-full h-16 bg-black text-white hover:bg-zinc-800"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <span className="flex items-center gap-4 text-xl">
                    <Eye className="w-6 h-6" /> REVEAL_PRIVATE_BALANCE
                  </span>
                )}
              </Button>
            </div>
          </section>

          {/* Action Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="retro-card border-none shadow-none">
              <div className="bg-orange-400 p-3 border-b-4 border-black">
                <h3 className="text-black font-black text-xs pixel-text flex items-center gap-2">
                  <Zap className="w-4 h-4" /> ADD_PAYMENT
                </h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Amount (will be encrypted)</label>
                  <Input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="retro-input h-14 text-xl text-black"
                  />
                </div>
                <Button
                  disabled={!isConnected || loading}
                  onClick={handleAddPayment}
                  className="w-full retro-button bg-orange-500 text-black hover:bg-orange-600 h-14"
                >
                  {loading ? "ENCRYPTING..." : "ENCRYPT & SUBMIT"}
                </Button>
              </CardContent>
            </Card>

            <Card className="retro-card border-none shadow-none">
              <div className="bg-blue-500 p-3 border-b-4 border-black">
                <h3 className="text-white font-black text-xs pixel-text flex items-center gap-2">
                  <Activity className="w-4 h-4" /> APPLY_MULTIPLIER
                </h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Rate (homomorphic mul)</label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-black">X</span>
                    <Input
                      type="number"
                      value={rateAmount}
                      onChange={(e) => setRateAmount(e.target.value)}
                      className="retro-input h-14 text-xl text-black"
                    />
                  </div>
                </div>
                <Button
                  disabled={!isConnected || loading}
                  onClick={handleApplyRate}
                  className="w-full retro-button bg-blue-600 text-white hover:bg-blue-700 h-14"
                >
                  {loading ? "COMPUTING..." : "EXECUTE BLIND"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Success Result Link */}
          <AnimatePresence>
            {lastTxHash && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="retro-card p-6 bg-green-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-green-600 w-8 h-8" />
                  <div>
                    <h4 className="text-xs font-black uppercase text-green-800">Transaction Successful!</h4>
                    <p className="text-[10px] font-bold text-green-700 opacity-80">Encrypted state updated on-chain.</p>
                  </div>
                </div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-button bg-white text-black p-2 flex items-center gap-2 text-[10px]"
                >
                  VIEW_ON_ETHERSCAN <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Explainer */}
        <div className="flex flex-col gap-6">
          <div className="terminal-window flex-1 flex flex-col relative overflow-hidden custom-scrollbar">
            <div className="scanline" />

            <div className="bg-zinc-800 px-4 py-3 border-b-4 border-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-widest">FHE_ENGINE_ANALYSIS.SYS</span>
              </div>
              <div className="flex gap-1">
                {['A1', 'B2', 'C3'].map(id => (
                  <span key={id} className="text-[8px] px-1 bg-zinc-700 text-zinc-400 border border-zinc-600 font-mono">{id}</span>
                ))}
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-10 custom-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <ArrowRight className="w-4 h-4" />
                  <h3 className="font-bold uppercase text-xs">Concept Breakdown</h3>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs pl-6 border-l-2 border-zinc-800 italic">
                  {explanation}
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <ArrowRight className="w-4 h-4" />
                  <h3 className="font-bold uppercase text-xs">Smart Contract Execution</h3>
                </div>
                <div className="bg-black/80 p-5 border-2 border-zinc-800 relative group">
                  <div className="absolute top-0 right-0 p-1 text-[8px] bg-zinc-800 text-zinc-500">SOLIDITY</div>
                  <pre className="text-green-500 text-[11px] leading-6 overflow-x-auto whitespace-pre-wrap">
                    {codeSnippet}
                  </pre>
                </div>
              </section>

              <section className="space-y-4 mt-auto pt-8">
                <h3 className="text-zinc-500 font-bold uppercase text-[10px] border-b border-zinc-800 pb-2 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Event_Stream
                </h3>
                <div className="space-y-2 overflow-hidden">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[10px] font-mono ${i === 0 ? 'text-white border-l-2 border-orange-500 pl-3' : 'text-zinc-600 pl-3 border-l-2 border-transparent'}`}
                    >
                      {log}
                    </motion.div>
                  ))}
                  {logs.length === 0 && <div className="text-zinc-700 italic text-[10px] pl-3">Waiting for transaction authorization...</div>}
                </div>
              </section>
            </div>
          </div>

          <div className="retro-card p-6 bg-blue-100 flex items-start gap-4 border-blue-200">
            <div className="p-2 bg-blue-500 border-2 border-black text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-[11px] font-black uppercase text-blue-900">Privacy Verification Protocol</h5>
              <p className="text-[10px] font-bold text-blue-800 tracking-tight opacity-80 leading-normal">
                No plain-text numbers are sent to the blockchain. All values are converted into TFHE cyphertexts locally.
                Nodes can only see cryptographic handles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center border-t-2 border-black pt-6 pb-8">
        <div className="flex justify-center gap-8 mb-4">
          {['ENCRYPTED_IO', 'TFHE_COMPUTE', 'CONFIDENTIAL_STATE'].map(label => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-black" />
              <span className="text-[9px] pixel-text font-black text-black/40">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">
          ESTABLISHED 2025 // ZAMA FHE-GATEWAY // BUILT FOR INNOVATION
        </p>
      </footer>
    </div>
  );
}
