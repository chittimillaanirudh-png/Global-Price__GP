// src/components/Navigation.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Home, Calculator, HelpCircle, Info, ArrowRight } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const NAV_LINKS = [
  { id: "home", label: "Home", desc: "The Universal Value Standard overview", icon: Home },
  { id: "calculator", label: "Calculator", desc: "Formulate product valuations", icon: Calculator },
  { id: "how-it-works", label: "How It Works", desc: "The physical basket mathematics", icon: HelpCircle },
  { id: "about", label: "About", desc: "The metrological SI metric vision", icon: Info }
];

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onPageChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    onPageChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 h-20 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sm:px-10">
        {/* Left: Logo */}
        <button
          onClick={() => handleLinkClick("home")}
          className="flex items-center text-left focus:outline-none group cursor-pointer"
        >
          <span className="font-bebas text-lg sm:text-xl tracking-[0.2em] text-white font-semibold uppercase">
            GLOBAL PRICE
          </span>
        </button>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative font-geist text-xs font-light uppercase tracking-[0.2em] transition-colors py-2 cursor-pointer ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleLinkClick("calculator")}
            className="liquid-glass rounded-full px-6 py-2.5 font-bebas text-xs text-white tracking-[0.15em] border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer font-medium"
          >
            TRY CALCULATOR
          </button>
        </div>

        {/* Mobile menu hamburger toggle with micro-animations */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative z-50 text-white/70 hover:text-white transition-colors focus:outline-none p-2 cursor-pointer rounded-full bg-white/3 border border-white/5"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Re-architected High-End Mobile Navigation Overlay matching the uploaded design */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Full screen elegant complete-fade overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-[#040404] flex flex-col p-6 sm:p-10 md:hidden overflow-y-auto"
            >
              {/* Header inside menu */}
              <div className="flex items-center justify-between w-full pb-8">
                {/* Brand / Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white">
                    <span className="font-bebas text-xs tracking-widest text-white">GP</span>
                  </div>
                  <span className="font-geist text-xs tracking-[0.2em] text-white uppercase font-semibold">GP SYSTEM</span>
                </div>

                {/* Circular elegant close button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer focus:outline-none bg-transparent"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              {/* Spacious Navigation links matching visual hierarchy */}
              <div className="flex flex-col gap-2 mb-8">
                {NAV_LINKS.map((link, i) => {
                  const isActive = currentPage === link.id;
                  const LinkIcon = link.icon;
                  return (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      key={link.id}
                      onClick={() => handleLinkClick(link.id)}
                      className={`group w-full flex items-center gap-4 px-5 py-4 rounded-r-3xl transition-all text-left cursor-pointer focus:outline-none relative overflow-hidden ${
                        isActive 
                          ? "bg-gradient-to-r from-white/10 to-transparent text-white" 
                          : "bg-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {/* Active indicator bar on the left */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-r-full" />
                      )}
                      
                      {/* Active curved left border on the item wrapper itself if we want to follow the image exactly. 
                          The image has a white glowing left border, and a slight rounded box look. */}
                      
                      <LinkIcon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? "text-white scale-110" : "text-white/40 group-hover:text-white/70"}`} />
                      <span className="font-geist text-xs tracking-[0.2em] uppercase font-medium">
                        {link.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Primary Action Button inside Mobile menu */}
              <div className="mt-auto pt-6 border-t border-white/5">
                <button
                  onClick={() => handleLinkClick("calculator")}
                  className="w-full text-center py-4 font-bebas tracking-[0.2em] text-xs text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer font-bold mt-2"
                >
                  GO TO VALUATION ENGINE
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navigation;
