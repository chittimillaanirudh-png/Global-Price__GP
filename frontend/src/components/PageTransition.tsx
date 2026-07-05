// src/components/PageTransition.tsx
import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface PageTransitionProps {
  triggerKey: string; // Triggers transition when key changes
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ triggerKey, children }) => {
  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={triggerKey}
          initial={{ opacity: 0, filter: "blur(12px)", y: 15 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default PageTransition;
