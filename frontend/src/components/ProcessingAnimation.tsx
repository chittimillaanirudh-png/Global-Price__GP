// src/components/ProcessingAnimation.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Check } from "lucide-react";

interface ProcessingAnimationProps {
  onComplete: () => void;
}

const steps = [
  "Fetching live exchange rates...",
  "Computing GFRB basket cost...",
  "Applying regional adjustments...",
  "Calculating GP value...",
  "Predicting 195 country prices..."
];

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      if (currentStep >= steps.length - 1) {
        clearInterval(timer);
        // Add a slight hold for dramatic timing before declaring complete
        const finishTimer = setTimeout(onComplete, 500);
        return () => clearTimeout(finishTimer);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, 450); // 450ms per calculation tick

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="glass-card max-w-xl mx-auto rounded-2xl p-8 md:p-10 text-center shadow-[0_0_80px_rgba(245,158,11,0.1)] border border-amber-500/10 flex flex-col items-center gap-8 bg-black/60 backdrop-blur-2xl">
      {/* Central spinning loader with glowing background */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20 rounded-full border border-amber-500/20 flex items-center justify-center bg-[#010101]"
        >
          <Globe className="text-amber-500 w-10 h-10 animate-pulse" />
          {/* External satellite ring */}
          <div className="absolute inset-[-4px] rounded-full border border-dashed border-amber-400/30 animate-[spin_10s_linear_infinite]" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bebas text-2xl tracking-widest text-white">GP SOLVER SOLVING</h3>
        <p className="font-geist text-xs text-white/50 tracking-wider">RESOLVING MULTIVARIATE LOCAL FRICTIONS</p>
      </div>

      {/* Steps List */}
      <div className="w-full max-w-md text-left space-y-4">
        {steps.map((step, i) => {
          const isDone = completedSteps.includes(i);
          const isCurrent = i === currentStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 py-1"
            >
              {/* Status Indicator */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.div
                      key="done"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center text-green-400"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                       key="current"
                       className="w-4 h-4 rounded-full border border-amber-500 border-t-transparent animate-spin"
                     />
                  ) : (
                    <motion.div
                       key="pending"
                       className="w-4 h-4 rounded-full border border-white/10"
                     />
                  )}
                </AnimatePresence>
              </div>

              {/* Step Text */}
              <span
                className={`font-geist text-sm tracking-wide transition-all duration-300 ${
                  isDone
                    ? "text-green-400 font-medium"
                    : isCurrent
                    ? "text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    : "text-white/20"
                }`}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default ProcessingAnimation;
