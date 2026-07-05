// src/components/Toast.tsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ 
  toasts, 
  onDismiss
}) => {
  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {/* Stack of toasts */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const { id, type, title, message, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const config = {
    success: {
      border: "border-green-500/20",
      bg: "bg-green-950/10",
      glow: "shadow-[0_0_30px_rgba(0,255,120,0.08)]",
      icon: <CheckCircle className="text-green-400 w-5 h-5 shrink-0" />
    },
    error: {
      border: "border-red-500/20",
      bg: "bg-red-950/10",
      glow: "shadow-[0_0_30px_rgba(255,60,60,0.08)]",
      icon: <XCircle className="text-red-400 w-5 h-5 shrink-0" />
    },
    warning: {
      border: "border-amber-500/20",
      bg: "bg-amber-950/10",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.08)]",
      icon: <AlertTriangle className="text-amber-400 w-5 h-5 shrink-0" />
    }
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`glass-card pointer-events-auto p-4 rounded-xl flex gap-3 items-start backdrop-blur-xl ${config.border} ${config.bg} ${config.glow}`}
    >
      {config.icon}
      <div className="flex-1 min-w-0">
        <h4 className="font-bebas text-sm text-white tracking-widest">{title}</h4>
        <p className="font-geist text-xs text-white/60 mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-white/30 hover:text-white/80 transition-colors p-0.5 hover:bg-white/5 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
