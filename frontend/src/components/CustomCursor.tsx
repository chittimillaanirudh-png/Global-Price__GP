// src/components/CustomCursor.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Outer ring coordinates (with lag)
  const outerPos = useRef({ x: 0, y: 0 });
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on mobile / touch devices or small screens
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    if (isTouch) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Dynamic hovering check for all interactive controls
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .clickable'
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Watch DOM changes to wire up new dynamically rendered elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    addHoverListeners();

    // Lerp outer ring loop
    let reqId: number;
    const updateOuterRing = () => {
      const delay = 0.12; // Lerp factor
      outerPos.current.x += (position.x - outerPos.current.x) * delay;
      outerPos.current.y += (position.y - outerPos.current.y) * delay;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerPos.current.x - 16}px, ${outerPos.current.y - 16}px, 0)`;
      }
      reqId = requestAnimationFrame(updateOuterRing);
    };
    reqId = requestAnimationFrame(updateOuterRing);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
      cancelAnimationFrame(reqId);
    };
  }, [position.x, position.y]);

  if (!isVisible) return null;

  return (
    <>
      {/* snappier inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: position.x - 3,
          y: position.y - 3,
        }}
        animate={{
          scale: isClicked ? 0.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Lagging outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-50 mix-blend-difference transition-all duration-75"
        style={{
          width: isHovered ? "48px" : "32px",
          height: isHovered ? "48px" : "32px",
          backgroundColor: "transparent",
          borderColor: isHovered ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.3)",
          transform: `translate3d(${outerPos.current.x - 16}px, ${outerPos.current.y - 16}px, 0)`,
          marginTop: isHovered ? "-8px" : "0px",
          marginLeft: isHovered ? "-8px" : "0px",
        }}
      />
    </>
  );
};
export default CustomCursor;
