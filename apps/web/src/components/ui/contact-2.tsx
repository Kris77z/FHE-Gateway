"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

export const Contact2 = ({
  title = "Contact Us",
  description = "",
  email,
}: Omit<Contact2Props, 'phone' | 'web'>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.email.trim() && 
           formData.subject.trim() && 
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
    
    toast.success("Message sent successfully!", "Thank you for contacting us. We'll respond to you within 24 hours.");
    
    // 重置表单
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {email && (
              <div className="mx-auto w-fit lg:mx-0">
                <ul className="ml-4 list-disc">
                  <li>
                    <span className="font-bold">Email: </span>
                    <a href={`mailto:${email}`} className="underline">
                      {email}
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">First Name *</Label>
                <Input 
                  type="text" 
                  id="firstname" 
                  placeholder="First Name" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Last Name *</Label>
                <Input 
                  type="text" 
                  id="lastname" 
                  placeholder="Last Name" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Subject *</Label>
              <Input 
                type="text" 
                id="subject" 
                placeholder="Subject" 
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                required
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Message *</Label>
              <Textarea 
                placeholder="Type your message here." 
                id="message" 
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                required
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
