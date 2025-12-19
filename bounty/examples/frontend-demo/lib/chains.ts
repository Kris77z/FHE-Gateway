import { defineChain } from 'viem';

// Zama FHEVM runs on Sepolia Testnet
export const zamaFhevm = defineChain({
  id: 11155111,
  name: 'Sepolia (Zama FHEVM)',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'SEP',
  },
  rpcUrls: {
    default: { http: ['https://eth-sepolia.g.alchemy.com/v2/c-wQVc_Rljga0EGJTrbcdr3cPgeUmoQX'] },
    public: { http: ['https://eth-sepolia.g.alchemy.com/v2/c-wQVc_Rljga0EGJTrbcdr3cPgeUmoQX'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
});

// Keep local for development/testing if needed
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
