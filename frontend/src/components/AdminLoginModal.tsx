import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, User, X, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { loginAdmin } from '../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, adminId: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      setErrorMessage('Please enter both Admin ID and Password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await loginAdmin(adminId.trim(), password.trim());
      if (res.token) {
        onLoginSuccess(res.token, res.adminId || adminId);
        onClose();
      } else {
        throw new Error('Authentication token missing.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid Admin ID or Password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl glass-card border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bebas text-xl tracking-widest text-white">ADMIN AUTHENTICATION</h3>
              <p className="text-xs text-white/50 font-geist">Global Price MongoDB Management</p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-200">{errorMessage}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-geist text-white/70 mb-1">ADMIN ID</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-amber-400/60" />
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-geist text-white/70 mb-1">PASSWORD</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-amber-400/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl font-bebas text-lg tracking-[0.15em] liquid-glass bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  'VERIFYING...'
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" /> UNLOCK ADMIN PANEL <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[11px] text-center text-white/30 font-mono">
            Protected endpoint backed by MongoDB Atlas
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
