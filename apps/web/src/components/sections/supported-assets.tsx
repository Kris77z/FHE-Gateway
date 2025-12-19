"use client";

import * as React from "react"
import { Lock } from "lucide-react";

const cryptocurrencies = [
  { name: "Bitcoin", symbol: "BTC", logo: "/images/btc.png" },
  { name: "Ethereum", symbol: "ETH", logo: "/images/eth.png" },
  { name: "Tether", symbol: "USDT", logo: "/images/usdt.png" },
  { name: "USD Coin", symbol: "USDC", logo: "/images/usdc.png" },
  { name: "BNB", symbol: "BNB", logo: "/images/bnb.png" },
  { name: "XRP", symbol: "XRP", logo: "/images/xrp.png" },
  { name: "TRON", symbol: "TRX", logo: "/images/trx.png" },
];

const blockchains = [
  {
    name: "Ethereum",
    description: "Ethereum Mainnet",
    logo: "/images/eth-chian.png"
  },
  {
    name: "TRON",
    description: "TRON Network", 
    logo: "/images/trx-chain.png"
  },
  {
    name: "BSC",
    description: "Binance Smart Chain",
    logo: "/images/bsc-chain.png"
  },
  {
    name: "Arbitrum",
    description: "Arbitrum Network",
    logo: "/images/arb-chain.png"
  },
  {
    name: "Base",
    description: "Base Network",
    logo: "/images/base-chain.png"
  }
];

export default function SupportedAssets() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Supported Coins */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6">
              Supported Coins
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Support major cryptocurrencies for seamless payments
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              {React.createElement(Lock as any, { className: "w-5 h-5 text-primary" }) as any}
              <span className="text-sm font-medium text-primary">
                Powered by FHE (Fully Homomorphic Encryption) for confidential payments
              </span>
            </div>
          </div>
          
          {/* Horizontal Scrolling Container */}
          <div className="scroll-container overflow-hidden">
            <div className="flex animate-scroll gap-8 whitespace-nowrap">
              {/* Multiple sets for continuous content */}
              {[...Array(4)].map((_, setIndex) => (
                cryptocurrencies.map((crypto, index) => (
                  <div
                    key={`set-${setIndex}-${index}`}
                    className="flex-shrink-0 p-2"
                  >
                    <img 
                      src={crypto.logo} 
                      alt={crypto.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                ))
              )).flat()}
            </div>
          </div>
        </div>

        {/* Supported Blockchains */}
        <div>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6">
              Supported Blockchains
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Multi-chain architecture design providing optimal performance and cost solutions for different scenarios
            </p>
          </div>
          
          {/* Horizontal Scrolling Container */}
          <div className="scroll-container overflow-hidden">
            <div className="flex animate-scroll gap-6 whitespace-nowrap">
              {/* Multiple sets for continuous content */}
              {[...Array(3)].map((_, setIndex) => (
                blockchains.map((blockchain, index) => (
                  <div
                    key={`set-${setIndex}-${index}`}
                    className="group flex-shrink-0 p-6 rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 min-w-[280px]"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={blockchain.logo} 
                        alt={blockchain.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium">{blockchain.name}</h3>
                        <p className="text-muted-foreground text-sm">{blockchain.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )).flat()}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extralight mb-2">20+</div>
            <div className="text-sm text-muted-foreground">Supported Currencies</div>
          </div>
          <div>
            <div className="text-3xl font-extralight mb-2">6+</div>
            <div className="text-sm text-muted-foreground">Blockchain Networks</div>
          </div>
          <div>
            <div className="text-3xl font-extralight mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-extralight mb-2">&lt; 15s</div>
            <div className="text-sm text-muted-foreground">Average Confirmation</div>
          </div>
        </div>
      </div>
    </section>
  );
}
