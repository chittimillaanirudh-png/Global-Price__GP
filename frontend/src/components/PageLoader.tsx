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

    // Fast page loading transition
    const duration = 750;
    const intervalTime = 16;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
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
          className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center select-none pointer-events-auto"
        >
          {/* Central Bouncing Dollar Sign Animation */}
          <motion.div
            animate={{ 
              y: ["-15px", "15px", "-15px"],
              scale: [1, 1.1, 1],
              rotateY: [0, 180, 360]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-6xl md:text-7xl font-sans font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            $
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
