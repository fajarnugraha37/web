"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check as CheckIcon, Info as InfoIcon, AlertCircle as AlertIcon, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "info" | "success" | "error" | "warning";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const variants = {
    info: {
      icon: <InfoIcon className="w-4 h-4" />,
      color: "text-accent border-accent/50 bg-accent/5",
      glow: "shadow-[0_0_15px_rgba(0,255,136,0.3)]",
    },
    success: {
      icon: <CheckIcon className="w-4 h-4" />,
      color: "text-green-400 border-green-500/50 bg-green-500/5",
      glow: "shadow-[0_0_15px_rgba(74,222,128,0.3)]",
    },
    error: {
      icon: <XIcon className="w-4 h-4" />,
      color: "text-destructive border-destructive/50 bg-destructive/5",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    },
    warning: {
      icon: <AlertIcon className="w-4 h-4" />,
      color: "text-accent-tertiary border-accent-tertiary/50 bg-accent-tertiary/5",
      glow: "shadow-[0_0_15px_rgba(255,215,0,0.3)]",
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={cn(
        "pointer-events-auto flex items-center gap-4 px-4 py-3 border cyber-chamfer-sm backdrop-blur-md min-w-[280px] max-w-md relative",
        variants.color,
        variants.glow
      )}
    >
      <div className="flex-shrink-0 p-1 bg-background/50 border border-current opacity-80">
        {variants.icon}
      </div>
      <div className="flex-1 font-mono text-[11px] uppercase tracking-wider font-bold">
        <div className="opacity-50 text-[8px] mb-0.5">SYSTEM_NOTIFICATION</div>
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:brightness-150 transition-all p-1"
      >
        <XIcon className="w-3 h-3 opacity-50" />
      </button>
      <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 w-full" />
      <div className="absolute bottom-0 left-0 h-0.5 bg-current animate-[shimmer_5s_linear_forwards] w-full" />
    </motion.div>
  );
};

let toastCount = 0;
let addToastFn: (msg: string, type: ToastType) => void = () => {};

export function toast(message: string, type: ToastType = "info") {
  addToastFn(message, type);
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  useEffect(() => {
    addToastFn = (message: string, type: ToastType) => {
      const id = `${Date.now()}-${toastCount++}`;
      setToasts((prev) => [...prev, { id, message, type }]);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
