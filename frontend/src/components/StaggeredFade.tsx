// src/components/StaggeredFade.tsx
import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

interface StaggeredFadeProps {
  text: string;
  className?: string;
}

export const StaggeredFade: React.FC<StaggeredFadeProps> = ({ text, className = "" }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <h1 ref={ref} className={`font-bebas tracking-wider ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: i * 0.05,
            ease: "easeOut",
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </motion.span>
      ))}
    </h1>
  );
};
export default StaggeredFade;
