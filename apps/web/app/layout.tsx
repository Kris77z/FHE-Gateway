"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Toaster, { ToasterRef } from "@/components/ui/toast";
import { useRef, useEffect } from "react";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const toasterRef = useRef<ToasterRef | null>(null);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { title, message, variant } = event.detail;
      toasterRef.current?.show({
        title,
        message,
        variant,
        duration: 4000,
      });
    };

    window.addEventListener('show-toast', handleShowToast as EventListener);
    return () => {
      window.removeEventListener('show-toast', handleShowToast as EventListener);
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <title>PayAgent Gateway - Solana x402 Powered Payment Platform</title>
        <meta name="description" content="Gasless stablecoin payments powered by Solana x402 protocol and Grid custody infrastructure." />
        <link rel="icon" href="/images/onepay-dark.png" />
        <link rel="shortcut icon" href="/images/onepay-dark.png" />
        <link rel="apple-touch-icon" href="/images/onepay-dark.png" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster ref={toasterRef} defaultPosition="top-right" />
      </body>
    </html>
  );
}
