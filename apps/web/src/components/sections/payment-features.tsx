"use client";

import * as React from "react"
import { Users, Zap, Settings, Lock, Wallet, Shield } from "lucide-react";

const features = [
  {
    icon: React.createElement(Lock as any, { className: "w-6 h-6" }) as any,
    title: "FHE Confidential Payments",
    description: "Powered by Zama FHEVM, enabling fully homomorphic encryption for confidential payment amounts. Transaction amounts remain encrypted throughout the entire payment process, ensuring complete privacy."
  },
  {
    icon: React.createElement(Wallet as any, { className: "w-6 h-6" }) as any,
    title: "Gasless x402 Payments",
    description: "Powered by EVM x402 protocol, enabling gasless transactions and agent-driven micro-payments. Users pay zero gas fees while maintaining full control."
  },
  {
    icon: React.createElement(Zap as any, { className: "w-6 h-6" }) as any,
    title: "Real-time Processing",
    description: "Fast transaction processing on EVM networks with real-time status tracking. Payments are confirmed within seconds thanks to x402 facilitator sponsorship."
  },
  {
    icon: React.createElement(Shield as any, { className: "w-6 h-6" }) as any,
    title: "Homomorphic Computation",
    description: "Perform computations on encrypted data without decryption. FHE enables secure aggregation, rate conversion, and balance calculations while maintaining complete privacy."
  },
  {
    icon: React.createElement(Users as any, { className: "w-6 h-6" }) as any,
    title: "Dedicated Support",
    description: "Dedicated account manager providing full integration assistance and technical support for FHE and x402 integration."
  },
  {
    icon: React.createElement(Settings as any, { className: "w-6 h-6" }) as any,
    title: "Agentic Finance",
    description: "Enable autonomous agent-driven payments with RateAgent for automatic fee payments and FHE Agent for encrypted amount processing."
  }
];

export default function PaymentFeatures() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              What are PayAgent Gateway features?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Next-generation EVM payment platform powered by x402 protocol and FHE homomorphic encryption
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Key Statistics */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-extralight mb-2">Zero Gas Fees</div>
              <div className="text-sm text-muted-foreground">x402 powered</div>
            </div>
            <div>
              <div className="text-3xl font-extralight mb-2">Complete Privacy</div>
              <div className="text-sm text-muted-foreground">FHE encryption</div>
            </div>
            <div>
              <div className="text-3xl font-extralight mb-2">Instant Settlement</div>
              <div className="text-sm text-muted-foreground">Real-time processing</div>
            </div>
            <div>
              <div className="text-3xl font-extralight mb-2">&lt; 15s Confirmation</div>
              <div className="text-sm text-muted-foreground">EVM networks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
