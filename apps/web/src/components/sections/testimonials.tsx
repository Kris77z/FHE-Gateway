"use client";

import * as React from "react"
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Tisha Norton",
    title: "CTO, TechFlow",
    content: "OnePay's integration was seamless. We went from concept to accepting crypto payments in just 2 days. The real-time tracking is a game-changer.",
    rating: 5,
    avatar: "/avatar/Tisha Norton.png"
  },
  {
    name: "Lawrence",
    title: "Founder, Digital Marketplace",
    content: "The multi-chain support is incredible. Our customers love having options, and the transaction fees are the lowest we've found in the market.",
    rating: 5,
    avatar: "/avatar/Lawrence.png"
  },
  {
    name: "Neha Mayumi",
    title: "CFO, Global E-commerce",
    content: "Security was our main concern, but OnePay's enterprise-grade protection gives us peace of mind. Zero issues in 6 months of operation.",
    rating: 5,
    avatar: "/avatar/Neha Mayumi.png"
  },
  {
    name: "Jack",
    title: "Product Manager, FinTech Startup",
    content: "The dedicated support team is outstanding. They guided us through every step and continue to help us optimize our payment flows.",
    rating: 5,
    avatar: "/avatar/jack.png"
  },
  {
    name: "Albert Juan",
    title: "CEO, SaaS Company",
    content: "OnePay helped us expand globally by accepting crypto payments. The auto-conversion feature protects us from volatility perfectly.",
    rating: 5,
    avatar: "/avatar/Albert Juan.png"
  },
  {
    name: "Avatar Memoji",
    title: "Operations Director, Online Store",
    content: "Fast, reliable, and transparent. Our customers appreciate the quick confirmation times and we love the detailed analytics dashboard.",
    rating: 5,
    avatar: "/avatar/Avatar Memoji.png"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6">
            Trusted by Users
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of businesses that trust OnePay for their cryptocurrency payment needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 flex flex-col h-full"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  React.createElement(Star as any, { key: i, className: "w-4 h-4 fill-yellow-400 text-yellow-400" }) as any
                ))}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              {/* Author - Always at bottom */}
              <div className="flex items-center gap-3 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-sm">{testimonial.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
