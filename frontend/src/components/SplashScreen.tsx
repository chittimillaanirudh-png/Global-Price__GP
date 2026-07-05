// src/components/SplashScreen.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [isZoomingOut, setIsZoomingOut] = useState(false);

  useEffect(() => {
    // Give it enough time to be very slow and clean
    const timer = setTimeout(() => {
      setIsZoomingOut(true);
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1000); // graceful fade
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={isZoomingOut ? {
          opacity: 0,
          transition: { duration: 1, ease: "easeOut" }
        } : {}}
        exit={{
          opacity: 0,
          transition: { duration: 0.5 }
        }}
        // Transparent background so the real 3D Globe from App.tsx shows through!
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden select-none"
      >
        <div className="absolute inset-0 bg-radial from-black/20 via-black/60 to-[#010101] pointer-events-none" />

        {/* ── GP LOGO CLEAN & SLOW REVEAL ── */}
        <div className="relative text-center z-10 space-y-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ letterSpacing: "0.1em", opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ letterSpacing: "0.25em", opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 2.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2
            }}
          >
            <h1 className="font-bebas text-5xl md:text-7xl text-white font-bold tracking-[0.25em] drop-shadow-lg">
              GLOBAL PRICE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 0.7, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
          >
            <p className="font-sans text-[11px] md:text-sm uppercase tracking-[0.4em] text-white font-light">
              STANDARDIZED VALUE
            </p>
          </motion.div>
        </div>

        {/* Very slow, elegant loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="absolute bottom-[20%] w-64 h-[1px] bg-white/10 overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
            className="h-full bg-white/70"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
