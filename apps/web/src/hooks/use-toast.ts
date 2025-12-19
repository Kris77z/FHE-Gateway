"use client";

import { useRef } from "react";
import { ToasterRef } from "@/components/ui/toast";

let toasterRef: React.RefObject<ToasterRef | null> | null = null;

export function useToast() {
  const ref = useRef<ToasterRef | null>(null);
  
  if (!toasterRef) {
    toasterRef = ref;
  }

  const toast = {
    success: (title: string, message: string) => {
      // 使用全局的toaster实例
      if (typeof window !== 'undefined') {
        // 简单的全局调用方式
        const event = new CustomEvent('show-toast', {
          detail: { title, message, variant: 'success' }
        });
        window.dispatchEvent(event);
      }
    },
    error: (title: string, message: string) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: { title, message, variant: 'error' }
        });
        window.dispatchEvent(event);
      }
    },
    info: (title: string, message: string) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: { title, message, variant: 'default' }
        });
        window.dispatchEvent(event);
      }
    }
  };

  return { toast };
}
