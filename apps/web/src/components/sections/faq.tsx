import { CONTACT_URL } from "@/lib/links";

export default function Faq() {
  const items = [
    {
      q: "Which cryptocurrencies do you support?",
      a: "We support major cryptocurrencies including BTC, ETH, USDT, USDC, and more across multiple EVM chains like Ethereum, Base, Polygon, and BSC. Our platform leverages the x402 protocol for gasless payments and FHE for confidential transactions.",
    },
    {
      q: "What is x402 protocol and how does it enable gasless payments?",
      a: "x402 is an EVM-based protocol that enables gasless transactions through facilitator sponsorship. Users sign payment requests, and facilitators (like PayAI or Coinbase CDP) pay the transaction fees on their behalf. This eliminates gas fees for end users while maintaining security and decentralization.",
    },
    {
      q: "What is FHE (Fully Homomorphic Encryption) and how does it protect payment privacy?",
      a: "FHE allows computations to be performed on encrypted data without decrypting it. In our platform, payment amounts are encrypted using Zama FHEVM before being sent to the blockchain. The encrypted amounts can be processed and stored on-chain while remaining completely private, ensuring transaction amounts are never exposed.",
    },
    {
      q: "How quickly are payments processed?",
      a: "On EVM networks like Base and Polygon, payments are confirmed within seconds. Our x402-powered payments are processed immediately after user signature, with facilitator settlement happening in real-time. FHE encryption adds minimal overhead while providing complete privacy.",
    },
    {
      q: "Do users need ETH or native tokens to pay gas fees?",
      a: "No! With x402 protocol, users pay zero gas fees. The facilitator sponsors all transaction costs, so users only need USDC tokens for payments. This makes our platform ideal for users new to crypto.",
    },
    {
      q: "How does FHE + x402 combined payment work?",
      a: "The combined payment flow first uses x402 for gasless USDC transfer, then stores the encrypted payment amount in the FHEVM contract. This provides both gasless convenience and complete payment privacy. Users get two transaction records: the x402 payment hash and the FHE storage hash.",
    },
    {
      q: "Is the integration difficult?",
      a: "No. We provide comprehensive documentation and SDKs. Most developers can integrate within hours. Our EVM wallet integration makes connecting wallets straightforward, and our API handles all FHE encryption and x402 complexity.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 space-y-8">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 font-extralight text-3xl tracking-tight md:mb-4 lg:mb-6 lg:text-4xl">Frequently asked questions</h2>
          <p className="text-white/75 lg:text-lg font-light leading-relaxed tracking-tight">
            Find answers to common questions about our crypto payment platform.
          </p>
        </div>
        <div className="mx-auto w-full lg:max-w-3xl divide-y divide-white/10">
          {items.map((item, idx) => (
            <details key={idx} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-left text-lg font-light tracking-tight">
                {item.q}
                <span className="ml-4">+</span>
              </summary>
              <div className="mt-2 text-black/75 dark:text-white/75 lg:text-lg font-light leading-relaxed tracking-tight">
                {item.a}
              </div>
            </details>
          ))}
        </div>
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-lg bg-accent p-6 text-center md:rounded-xl lg:p-8">
          <div className="relative flex items-center justify-center gap-6">
            <img className="size-16 rounded-full bg-white border" src="/avatar/2.png" alt="Avatar 2" />
            <img className="size-16 rounded-full bg-white border" src="/avatar/5.png" alt="Avatar 5" />
            <img className="size-16 rounded-full bg-white border" src="/avatar/4.png" alt="Avatar 4" />
          </div>
          <h3 className="mt-4 mb-2 max-w-3xl font-light lg:text-lg tracking-tight">Need more support?</h3>
          <p className="mb-6 max-w-3xl text-black/75 dark:text-white/75 lg:text-lg font-light leading-relaxed tracking-tight">
            Our dedicated support team is here to help you with integration questions and technical concerns.
          </p>
          <a className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90" href={CONTACT_URL}>Contact Support</a>
        </div>
      </div>
    </section>
  );
}


