// src/components/PageLoader.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PageLoaderProps {
  isVisible: boolean;
  onTransitionComplete: () => void;
  targetPageName: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  isVisible, 
  onTransitionComplete,
  targetPageName
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    // High fidelity progress line sweep
    const duration = 750; // 0.75s duration for ultra-smooth fast page loading
    const intervalTime = 16;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Delay completion slightly for maximum visual smoothness
        setTimeout(() => {
          onTransitionComplete();
        }, 150);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible, onTransitionComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.35, ease: "easeOut" }
          }}
          className="fixed inset-0 z-40 bg-[#010101]/92 backdrop-blur-md flex flex-col items-center justify-center select-none pointer-events-auto"
        >
          {/* Subtle Golden Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] bg-radial from-amber-500/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />

          {/* Central Rotating Globe Icon (Micro scale) */}
          <div className="relative mb-6">
            {/* Outer spinning orbital outline ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-dashed border-amber-500/15"
            />
            {/* Inner orbital ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-amber-400/10"
            />
            
            {/* 3D sphere globe representation */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.08)] bg-black">
              <motion.div
                className="absolute inset-y-0 left-0 w-[200%] h-full flex"
                style={{
                  filter: "sepia(0.8) saturate(2) hue-rotate(345deg) brightness(0.85) contrast(1.15)"
                }}
                animate={{
                  x: ["0%", "-50%"]
                }}
                transition={{
                  duration: 45, // very slow rotating globe representation
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div 
                  className="w-1/2 h-full shrink-0"
                  style={{
                    backgroundImage: "url('/textures/earth/day.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                <div 
                  className="w-1/2 h-full shrink-0"
                  style={{
                    backgroundImage: "url('/textures/earth/day.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
              </motion.div>
              {/* Spherical Shadow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,transparent_35%,rgba(1,1,1,0.9)_85%)] pointer-events-none" />
            </div>
          </div>

          {/* Transition details */}
          <div className="text-center space-y-2 max-w-xs px-4">
            <h3 className="font-bebas text-lg md:text-xl text-white tracking-[0.25em] uppercase">
              LOADING {targetPageName}
            </h3>
            <p className="font-mono text-[9px] text-amber-200/40 uppercase tracking-[0.2em] h-4">
              {progress < 40 ? "resolving assets..." : progress < 85 ? "aligning matrix..." : "rendering viewport..."}
            </p>
          </div>

          {/* Progress bar container */}
          <div className="mt-6 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
