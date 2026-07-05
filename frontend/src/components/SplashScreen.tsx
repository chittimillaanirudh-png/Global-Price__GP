// src/components/SplashScreen.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);

  // ARIA Live announcements to fulfill "immediate animations to be announced" semantically and programmatically
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    // Check if user has already seen the splash screen in this tab session
    const hasSeen = sessionStorage.getItem("gp_has_loaded");
    if (hasSeen === "true") {
      onComplete();
      setVisible(false);
      return;
    }

    // Instantly queue immediate system announcements on render
    setAnnouncements([
      "Atmospheric planetary coordinate rotation initiated.",
      "Universal metric calibration standard active."
    ]);

    // Preload Local Earth texture - loads instantly because it's stored locally in /public
    const img = new Image();
    img.src = "/textures/earth/day.jpg";
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      // Fallback: load standard image if local is somehow unavailable
      setImageLoaded(true);
    };

    // Fast but incredibly smooth progress animation
    // Fulfills "The loading page is very slow" fix by shortening the forced wait
    // while keeping the visual assets extremely slow and smooth.
    const duration = 1600; 
    const intervalTime = 16;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsZoomingOut(true);
        sessionStorage.setItem("gp_has_loaded", "true");
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 800); // graceful fade and zoom-out transition
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!visible) return null;

  const titleText = "GLOBAL PRICE";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={isZoomingOut ? { 
          scale: 1.15, 
          opacity: 0,
          filter: "blur(20px)",
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        } : {}}
        exit={{
          opacity: 0,
          scale: 1.05,
          transition: { duration: 0.5 }
        }}
        className="fixed inset-0 z-50 bg-[#010101] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* ARIA live region for announcing the immediate animations */}
        <div className="sr-only" aria-live="polite">
          {announcements.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>

        {/* Ambient Cosmic Stars with slow twinkle */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {Array.from({ length: 45 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-amber-100/80 rounded-full"
              style={{
                top: `${(i * 19) % 100}%`,
                left: `${(i * 29) % 100}%`,
                width: `${(i % 3) * 0.4 + 0.4}px`,
                height: `${(i % 3) * 0.4 + 0.4}px`,
              }}
              animate={{ opacity: [0.15, 0.85, 0.15] }}
              transition={{ duration: 6 + (i % 6), repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>

        {/* 
          IMMEDIATE ANIMATION 1: Cinematic Orbital Compass Ripple (Announced / Visualized immediately on load)
          This expands outwards slowly from the center, conveying an ambient data scan.
        */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 2.2, opacity: [0, 0.35, 0] }}
          transition={{
            duration: 5.5,
            ease: "easeOut",
            repeat: Infinity,
          }}
          className="absolute w-96 h-96 border border-amber-500/15 rounded-full pointer-events-none"
        />

        {/* 
          IMMEDIATE ANIMATION 2: Second ring expanding at a offset speed
        */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1.6, opacity: [0, 0.25, 0] }}
          transition={{
            duration: 7.0,
            ease: "easeOut",
            repeat: Infinity,
            delay: 1.2,
          }}
          className="absolute w-96 h-96 border border-amber-400/10 rounded-full pointer-events-none"
        />

        {/* ── CENTRAL ROTATING GLOBE BACKGROUND (Very, very slow animation) ── */}
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center opacity-70 scale-95 md:scale-100">
          
          {/* Deep celestial gold ambient nebula bloom */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.2, 0.35, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[120%] h-[120%] bg-radial from-amber-500/15 via-amber-950/5 to-transparent blur-3xl rounded-full pointer-events-none"
          />

          {/* Golden scanning laser sweep line overlay */}
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent blur-[1px] pointer-events-none z-20"
          />

          {/* Three-Dimensional Rotating Sphere Mask */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border border-amber-500/15 shadow-[0_0_100px_rgba(245,158,11,0.15)] bg-black">
            {imageLoaded ? (
              <motion.div
                className="absolute inset-y-0 left-0 w-[200%] h-full flex"
                style={{
                  filter: "sepia(0.9) saturate(2.2) hue-rotate(345deg) brightness(0.85) contrast(1.15)"
                }}
                animate={{
                  x: ["0%", "-50%"]
                }}
                transition={{
                  duration: 180, // Majestic, very very slow rotation speed as requested
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
            ) : (
              /* High quality fallback holographic grid */
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <motion.div 
                  className="w-[110%] h-[110%] border border-dashed border-amber-500/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}

            {/* Earth shadow gradient to render high-contrast 3D volume */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,transparent_30%,rgba(1,1,1,0.92)_85%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-amber-400/25 pointer-events-none" />
          </div>

          {/* Soft outer atmospheric rim outline */}
          <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border border-amber-400/10 shadow-[0_0_40px_rgba(245,158,11,0.1)] pointer-events-none scale-[1.025]" />
        </div>

        {/* ── GP LOGO IMMEDIATE TRACKING & REVEAL ANIMATION ── */}
        <div className="absolute top-[44%] text-center z-10 space-y-4">
          <motion.div 
            initial={{ letterSpacing: "0.15em", opacity: 0, filter: "blur(10px)" }}
            animate={{ letterSpacing: "0.32em", opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 2.2,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="flex justify-center"
          >
            <h1 className="font-bebas text-5xl md:text-6xl text-white font-bold text-shadow-md tracking-[0.32em]">
              {titleText}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 0.55, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] text-amber-200/90 font-light"
          >
            Universal Value Metric
          </motion.p>
        </div>

        {/* Progress Tracker Section */}
        <div className="absolute bottom-[16%] w-72 text-center space-y-4">
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-amber-200/40 uppercase">
            <span>SYS_INIT</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
