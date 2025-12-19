"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as React from "react"
import { ArrowRight, MoveRight } from "lucide-react";

const MoveRightComp = MoveRight as any;
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           formData.company.trim() && 
           formData.message.trim();
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    toast.success("Message sent successfully!", "Thank you for your interest. We'll get back to you within 24 hours.");
    
    // 重置表单
    setFormData({
      name: "",
      email: "",
      company: "",
      message: ""
    });
  };
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Contact Section */}
          <div className="bg-card/50 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-light tracking-tight mb-4">
                  Discover new opportunities with our crypto payment solution
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our expert team is ready to provide you with personalized crypto payment solutions,
                  whether you&apos;re a small business or a large enterprise, we can meet your specific needs.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Custom integration solutions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Priority technical support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Flexible rate negotiation</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:border-primary focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:border-primary focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Please describe your requirements... *"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:border-primary focus:outline-none resize-none"
                  required
                />
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                >
                  {isSubmitting ? "Sending..." : "Contact OnePay team"}
                  {React.createElement(ArrowRight as any, { className: "ml-2 w-4 h-4" }) as any}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
