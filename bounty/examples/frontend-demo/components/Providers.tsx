'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { zamaFhevm } from '@/lib/chains';
import '@rainbow-me/rainbowkit/styles.css';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: 'FHE Payment Gateway',
  projectId: 'fhe-demo-project', // WalletConnect project ID (optional for testnet)
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [zamaFhevm],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          theme={lightTheme({
            accentColor: '#3b82f6',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
