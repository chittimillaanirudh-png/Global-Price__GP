// src/pages/Home.tsx
import React from "react";
import { motion } from "motion/react";
import { StaggeredFade } from "../components/StaggeredFade";
import { Ruler, Globe, TrendingUp, ArrowRight, Shield, RefreshCw, Layers } from "lucide-react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  // Stagger item variants for a cinematic, high-end reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen pt-20">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center w-full max-w-6xl mx-auto px-6 sm:px-10 pb-12 pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full text-left">
          <div className="space-y-8 max-w-xl">
            
            {/* Main Title lines with clean, modern typography */}
            <div className="space-y-4">
              <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wide uppercase leading-[0.9] flex flex-col sm:flex-row sm:gap-x-5 items-start sm:items-center">
                <span>GLOBAL</span>
                <span>PRICE</span>
              </h1>
              <h2 className="font-sans text-xs sm:text-sm md:text-base font-light text-white/50 tracking-[0.25em] uppercase">
                the universal value standard
              </h2>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
              animate={{ opacity: 0.6, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-xs sm:text-sm md:text-base font-light text-white/80 tracking-wider max-w-md leading-relaxed"
            >
              One metrics standard.
              <br className="block sm:hidden" />
              {" "}Clear of sovereign frictions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto"
            >
              <button
                onClick={() => onNavigate("calculator")}
                className="relative group cursor-pointer rounded-xl px-8 py-4 bg-white/2 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2.5 tracking-[0.15em] text-xs text-white font-sans uppercase font-semibold overflow-hidden"
              >
                CALCULATE NOW
                <span className="text-white/60 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => onNavigate("how-it-works")}
                className="cursor-pointer px-8 py-4 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/3 transition-all text-white/60 hover:text-white tracking-[0.15em] text-xs font-sans uppercase font-medium flex items-center justify-center"
              >
                HOW IT WORKS
              </button>
            </motion.div>
          </div>
          
          {/* Empty second grid column on desktop to let the 3D Globe Background show through beautifully */}
          <div className="hidden md:block" />
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="px-6 sm:px-10 max-w-6xl mx-auto py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] hover:border-white/10 relative flex flex-col justify-between overflow-hidden transition-all duration-500 group min-h-[160px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
            <div>
              <span className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-normal">195</span>
              <p className="font-sans text-[10px] text-white/40 tracking-wider uppercase mt-1">Countries Covered</p>
            </div>
            <p className="font-sans text-xs text-white/50 mt-3 leading-relaxed font-light">
              Every recognized global sovereignty mapped with fallback purchase parity indexes.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] hover:border-white/10 relative flex flex-col justify-between overflow-hidden transition-all duration-500 group min-h-[160px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
            <div>
              <span className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-normal">3</span>
              <p className="font-sans text-[10px] text-white/40 tracking-wider uppercase mt-1">Live Data APIs</p>
            </div>
            <p className="font-sans text-xs text-white/50 mt-3 leading-relaxed font-light">
              World Bank economic databases, commodities indices, and Frankfurter exchange rates.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] hover:border-white/10 relative flex flex-col justify-between overflow-hidden transition-all duration-500 group min-h-[160px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
            <div>
              <span className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-normal">Real-Time</span>
              <p className="font-sans text-[10px] text-white/40 tracking-wider uppercase mt-1">Daily Price Sync</p>
            </div>
            <p className="font-sans text-xs text-white/50 mt-3 leading-relaxed font-light">
              Constant currency valuations and inflation adjustments compiled mathematically inside the client.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── WHAT IS GP SECTION ── */}
      <section className="px-6 sm:px-10 max-w-6xl mx-auto py-12">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest text-white uppercase">What is GP?</h2>
          <div className="w-8 h-[1px] bg-white/20 mx-auto" />
          <p className="font-sans text-[9px] text-white/40 uppercase tracking-[0.2em] font-medium">The metric system for monetary value</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/5 bg-white/[0.005] hover:bg-white/[0.08] group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:border-white/20 transition-all duration-300">
              <Ruler className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-semibold text-base text-white tracking-wide">Like a Meter for Value</h3>
            <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
              Just like meters measure distance and kilograms measure weight, the GP standard measures intrinsic global value independent of local currencies or pricing anomalies.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/5 bg-white/[0.005] hover:bg-white/[0.08] group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:border-white/20 transition-all duration-300">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-semibold text-base text-white tracking-wide">Currency Independent</h3>
            <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
              By removing exchange rate bias, localized retail markups, VAT, and logistics duty markups, we uncover the exact baseline valuation of any item anywhere.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-white/5 bg-white/[0.005] hover:bg-white/[0.08] group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:border-white/20 transition-all duration-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-semibold text-base text-white tracking-wide">Physically Anchored</h3>
            <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
              Every value is calculated relative to the GFRB Physical Anchor Basket (comprising local median labor cost, energy indicators, metal materials, and base grains).
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS PREVIEW SECTION ── */}
      <section className="px-6 sm:px-10 max-w-6xl mx-auto py-12 overflow-hidden">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest text-white uppercase">The Engine Pipeline</h2>
          <div className="w-8 h-[1px] bg-white/20 mx-auto" />
          <p className="font-sans text-[9px] text-white/40 uppercase tracking-[0.2em] font-medium">Our four-step calculation sequence</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 border-t border-dashed border-white/5 -translate-y-1/2 z-0" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] relative group text-center md:text-left transition-all duration-500">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-sans font-semibold text-white text-[10px] mb-3 mx-auto md:mx-0">
                01
              </div>
              <h4 className="font-sans text-xs text-white tracking-wider uppercase mb-1 font-semibold">Enter Price</h4>
              <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                Provide local market currency value of any standard product.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] relative group text-center md:text-left transition-all duration-500">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-sans font-semibold text-white text-[10px] mb-3 mx-auto md:mx-0">
                02
              </div>
              <h4 className="font-sans text-xs text-white tracking-wider uppercase mb-1 font-semibold">Strip Frictions</h4>
              <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                Remove regional VAT taxes, local import tariffs, margins, and logistics scores.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] relative group text-center md:text-left transition-all duration-500">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-sans font-semibold text-white text-[10px] mb-3 mx-auto md:mx-0">
                03
              </div>
              <h4 className="font-sans text-xs text-white tracking-wider uppercase mb-1 font-semibold">Compute GP</h4>
              <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                Normalize against the physical basket and apply PPP/CPI inflation correction indexes.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.08] relative group text-center md:text-left transition-all duration-500">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-sans font-semibold text-white text-[10px] mb-3 mx-auto md:mx-0">
                04
              </div>
              <h4 className="font-sans text-xs text-white tracking-wider uppercase mb-1 font-semibold">Get 195 Prices</h4>
              <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                Project predicted purchase cost across 195 nations in native currencies instantly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER SECTION ── */}
      <footer className="w-full bg-black border-t border-white/5 py-10 px-6 sm:px-10 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <h4 className="font-sans font-semibold text-sm tracking-wider text-white uppercase">GP — Global Price Standard</h4>
            <p className="font-sans text-[11px] text-white/40 font-light">Measuring baseline value across a borderless, interconnected world.</p>
          </div>

          <div className="flex gap-4">
            <button onClick={() => onNavigate("home")} className="font-sans text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">Home</button>
            <button onClick={() => onNavigate("calculator")} className="font-sans text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">Calculator</button>
            <button onClick={() => onNavigate("how-it-works")} className="font-sans text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">How It Works</button>
            <button onClick={() => onNavigate("about")} className="font-sans text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">About</button>
          </div>

          <div className="text-right flex flex-col md:items-end">
            <p className="font-sans text-[8px] text-white/30 tracking-wider">DATA ENGINE CORE</p>
            <p className="font-sans text-[10px] text-white/50 tracking-wide font-light">World Bank Metrics & Frankfurter Indexes</p>
          </div>

        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-6 pt-4 text-center">
          <p className="font-sans text-[9px] text-white/20 tracking-[0.2em] uppercase font-light">Built for a borderless world. © {new Date().getFullYear()} GP Inc.</p>
        </div>
      </footer>

    </div>
  );
};
export default Home;
