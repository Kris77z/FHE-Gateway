"use client";

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const paymentMethods = [
  {
    id: "invoices",
    title: "Invoices",
    subtitle: "E-commerce choice",
    description: "This method is suitable for paying for goods or services. You can set the price in a fiat currency so the payer chooses a cryptocurrency and pays a corresponding amount, or specify the preferable cryptocurrency right away, and the cryptocurrency address will be generated after choosing a network.",
    mockContent: "invoice"
  },
  {
    id: "recurring",
    title: "Recurring payments", 
    subtitle: "Subscription businesses choice",
    description: "Subscription-based payments for your business. Your client needs to set it up just once to be charged regularly.",
    mockContent: "recurring"
  },
  {
    id: "host",
    title: "Host",
    subtitle: "Universal solution for any business", 
    description: "The most customizable option, suitable for any type of project. Allow your customers to top up their personal credit in any amount and use it without delay.",
    mockContent: "qr"
  },
  {
    id: "links",
    title: "Payment links",
    subtitle: "Single payment choice",
    description: "Create an invoice, share the link and get paid – it's an easy payment solution for your online business of any kind.",
    mockContent: "chat"
  }
];

const blockchains = [
  { name: "BNB Smart Chain", symbol: "BNB", standard: "BEP-20", logo: "/images/bsc-chain.png" },
  { name: "Ethereum", symbol: "ETH", standard: "ERC-20", logo: "/images/eth-chian.png" },
  { name: "Base", symbol: "BASE", standard: "ERC-20", logo: "/images/base-chain.png" },
  { name: "Arbitrum", symbol: "ARB", standard: "ERC-20", logo: "/images/arb-chain.png" }
];

export default function PaymentMethods() {
  const [activeMethod, setActiveMethod] = useState("invoices");
  const [selectedBlockchain, setSelectedBlockchain] = useState("BNB Smart Chain");
  const [showBlockchainDropdown, setShowBlockchainDropdown] = useState(false);

  const renderMockContent = (type: string) => {
    switch(type) {
      case "invoice":
        return (
          <Card className="w-full max-w-md border-white/10 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start mb-6">
                <Image 
                  src="/images/onepay-light.png" 
                  alt="OnePay" 
                  width={32} 
                  height={32} 
                  className="rounded"
                />
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold mb-2 text-left">20.00 USDT</div>
                <div className="text-sm text-muted-foreground text-left">{selectedBlockchain} ({blockchains.find(b => b.name === selectedBlockchain)?.standard || "BEP-20"})</div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full relative">
                  <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-muted"></div>
                  <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-green-500 border-r-transparent border-b-transparent transform rotate-45"></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expiration time</div>
                  <div className="text-sm font-mono text-green-500">02:34:54</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => setShowBlockchainDropdown(!showBlockchainDropdown)}
                  >
                    <div className="flex items-center gap-2">
                      <Image 
                        src={blockchains.find(b => b.name === selectedBlockchain)?.logo || "/images/bsc-chain.png"}
                        alt={selectedBlockchain}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                      <span>{selectedBlockchain}</span>
                    </div>
                    {React.createElement(ChevronDown as any, { className: `w-4 h-4 transition-transform ${showBlockchainDropdown ? 'rotate-180' : ''}` }) as any}
                  </Button>
                  
                  {showBlockchainDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-white/20 rounded-lg shadow-lg z-10">
                      {blockchains.map((blockchain) => (
                        <button
                          key={blockchain.name}
                          className="w-full px-3 py-2 text-left hover:bg-accent rounded-lg text-sm flex items-center gap-2"
                          onClick={() => {
                            setSelectedBlockchain(blockchain.name);
                            setShowBlockchainDropdown(false);
                          }}
                        >
                          <Image 
                            src={blockchain.logo}
                            alt={blockchain.name}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                          {blockchain.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                  Pay with OnePay
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      case "recurring":
        return (
          <Card className="w-full max-w-md border-white/10 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start mb-6">
                <Image 
                  src="/images/onepay-light.png" 
                  alt="OnePay" 
                  width={32} 
                  height={32} 
                  className="rounded"
                />
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">!</span>
                  </div>
                  <span className="text-sm font-medium">Confirm the recurring payment</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  The funds will be debited <span className="bg-amber-200 dark:bg-amber-800/50 px-1 rounded">Every month</span> cancel any time.
                </p>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold mb-2 text-left">20.00 USDT</div>
                <div className="text-sm text-muted-foreground text-left">Name • Crypto2</div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                Pay with OnePay
              </Button>
            </CardContent>
          </Card>
        );
        
      case "qr":
        return (
          <Card className="w-full max-w-md border-white/10 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                {/* QR Code */}
                <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/qrcode.png"
                    alt="Payment QR"
                    width={192}
                    height={192}
                    className="w-48 h-48 object-contain"
                  />
                </div>
                {/* Chain & Tokens */}
                <div className="text-xs text-muted-foreground mb-2">BNB Smart Chain (BEP-20)</div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/20 border border-white/10">
                    <Image src="/images/usdt.png" alt="USDT" width={16} height={16} />
                    <span className="text-xs font-medium">USDT</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/20 border border-white/10">
                    <Image src="/images/usdc.png" alt="USDC" width={16} height={16} />
                    <span className="text-xs font-medium">USDC</span>
                  </span>
                </div>
                {/* Amount */}
                <div className="text-2xl font-semibold mb-2">20.00</div>
                {/* Address */}
                <div className="text-sm text-muted-foreground mb-1">Recipient wallet address</div>
                <div className="text-xs font-mono bg-muted/20 p-2 rounded break-all">
                  0xF47557989018c45E6914d2080493F6C9Bbd42cEF
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "chat":
        return (
          <Card className="w-full max-w-md border-white/10 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="text-right text-xs text-muted-foreground mb-4">Today</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Image 
                  src="/avatar/jack.png" 
                  alt="User" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hi, where can i pay? <span className="text-xs text-muted-foreground">11:47</span></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-foreground text-background rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hi, check the invoice here <span className="text-xs opacity-70">11:47</span></p>
                </div>
                <Image 
                  src="/avatar/Albert Juan.png" 
                  alt="Support" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              </div>
              
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-foreground text-background rounded-lg p-3 max-w-[80%]">
                  <p className="text-xs font-mono">
                    https://pay.onepay.com/pay<br/>
                    ***************
                  </p>
                  <span className="text-xs opacity-70">11:47</span>
                </div>
                <Image 
                  src="/avatar/Albert Juan.png" 
                  alt="Support" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              </div>
              
              <div className="flex items-start gap-3">
                <Image 
                  src="/avatar/jack.png" 
                  alt="User" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Paid! <span className="text-xs text-muted-foreground">11:47</span></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-foreground text-background rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">I see, thanks😊 <span className="text-xs opacity-70">11:47</span></p>
                </div>
                <Image 
                  src="/avatar/Albert Juan.png" 
                  alt="Support" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              We make it easy for you to plug into digital payments
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple payment methods to meet different business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Payment Methods List */}
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card 
                  key={method.id} 
                  className="border-white/10 bg-card/50 backdrop-blur-sm cursor-pointer hover:bg-card/70 transition-all"
                  onClick={() => setActiveMethod(method.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-medium">{method.title}</CardTitle>
                      {activeMethod === method.id ? 
                        React.createElement(Minus as any, { className: "w-5 h-5 text-muted-foreground" }) as any : 
                        React.createElement(Plus as any, { className: "w-5 h-5 text-muted-foreground" }) as any
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                  </CardHeader>
                  {activeMethod === method.id && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {method.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Right Side - Payment Interface */}
            <div className="flex items-start justify-center">
              {renderMockContent(paymentMethods.find(m => m.id === activeMethod)?.mockContent || "invoice")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
