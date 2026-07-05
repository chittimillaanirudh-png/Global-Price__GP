// src/components/AnimatedCounter.tsx
import React, { useEffect, useState } from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatAsCurrency?: boolean;
  currencyCode?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 1.5,
  decimals = 3,
  prefix = "",
  suffix = "",
  formatAsCurrency = false,
  currencyCode = "USD"
}) => {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      const currentVal = from + (to - from) * eased;
      setValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [from, to, duration]);

  if (formatAsCurrency) {
    try {
      const formatted = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: decimals === 0 ? 0 : 2
      }).format(value);
      return <span>{formatted}</span>;
    } catch (e) {
      return <span>{prefix}{value.toFixed(2)}{suffix}</span>;
    }
  }

  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
export default AnimatedCounter;
