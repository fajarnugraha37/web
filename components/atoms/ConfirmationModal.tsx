"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning" | "accent";
}

export function ConfirmationModal({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "EXECUTE",
  cancelLabel = "ABORT",
  variant = "accent",
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        if (onCancel) onCancel();
        onClose();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, onCancel, isLoading]);

  const accentColor = {
    destructive: "text-destructive border-destructive/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    warning: "text-accent-tertiary border-accent-tertiary/50 shadow-[0_0_20px_rgba(255,215,0,0.2)]",
    accent: "text-accent border-accent/50 shadow-[0_0_20px_rgba(0,255,136,0.2)]",
  }[variant];

  const btnVariant = {
    destructive: "glitch" as const, // We'll use glitch for high impact
    warning: "default" as const,
    accent: "default" as const,
  }[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              if (isLoading) return;
              if (onCancel) onCancel();
              onClose();
            }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-md bg-card border p-8 cyber-chamfer overflow-hidden ${accentColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HUD Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-current opacity-20" />
            <div className="absolute inset-0 cyber-grid-bg opacity-5 pointer-events-none" />

            <div className="flex items-center gap-4 mb-6">
              <div className={`p-2 bg-current/10 border border-current/30`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                {title}
              </h2>
            </div>

            <p className="font-mono text-xs uppercase tracking-widest leading-loose mb-8 text-foreground/70">
              // {message}
            </p>

            <div className="flex justify-end gap-4 relative z-10">
              <Button
                variant="ghost"
                size="sm"
                disabled={isLoading}
                onClick={() => {
                  if (onCancel) onCancel();
                  onClose();
                }}
                className="hover:bg-white/5"
              >
                {cancelLabel}
              </Button>
              <Button
                variant={btnVariant}
                size="sm"
                disabled={isLoading}
                onClick={() => {
                  onConfirm();
                }}
                className={variant === "destructive" ? "bg-destructive text-white flex items-center gap-2" : "flex items-center gap-2"}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                {isLoading ? "PROCESSING..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
