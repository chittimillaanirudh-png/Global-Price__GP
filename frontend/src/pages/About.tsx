// src/pages/About.tsx
import React from "react";
import { motion } from "motion/react";
import { StaggeredFade } from "../components/StaggeredFade";
import { ShieldCheck, Heart, Eye, HelpCircle, Scale, Compass, Award } from "lucide-react";

export const About: React.FC = () => {
  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen pt-24 px-6 sm:px-10 pb-20 max-w-4xl mx-auto space-y-16">
      
      {/* ── HERO ── */}
      <div className="text-center space-y-4">
        <h1 className="font-bebas text-5xl sm:text-6xl tracking-widest text-white uppercase">ABOUT GLOBAL PRICE</h1>
        <div className="w-12 h-0.5 bg-amber-500 mx-auto" />
        <p className="font-geist text-sm sm:text-base font-light text-amber-500 uppercase tracking-[0.3em] leading-relaxed">
          A scientific standard for a borderless world
        </p>
      </div>

      {/* ── MISSION SECTION ── */}
      <section className="space-y-4">
        <div className="glass-card rounded-2xl p-6 sm:p-10 bg-white/2 backdrop-blur-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-bebas text-2xl tracking-widest text-white mb-4">OUR MISSION</h2>
          <div className="font-geist text-sm sm:text-base text-white/70 leading-loose space-y-4">
            <p>
              In an increasingly digital, globalized, and borderless world, currency remains strangely primitive. Exchange rates fluctuate wildly due to speculative trading, political announcements, and short-term interest rate adjustments. Yet, the physical labor and material resources required to assemble a laptop, manufacture medicine, or bake a loaf of bread remain fundamentally static.
            </p>
            <p>
              The **Global Price (GP)** standard was formulated to solve this core economic disconnect. We believe that economic value should be measured scientifically, not speculatively.
            </p>
            <p>
              By utilizing daily-updated commodities indices, national labor parameters, and purchasing power parity corrections, GP peels back the superficial layer of nominal pricing to reveal the **intrinsic physical effort** behind any product. Our standard operates like a universal lens, exposing exactly where goods are unfairly inflated or artificially subsidized.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE SI UNIT VISION SECTION ── */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-bebas text-3xl tracking-widest text-white">THE SI UNIT OF VALUE</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">HOW GP MAPS TO INTERNATIONAL METRICS</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
          <div className="p-5 border-b border-white/5 bg-white/2">
            <h4 className="font-bebas text-lg tracking-widest text-white">METROLOGICAL COMPARISONS</h4>
          </div>
          <div className="divide-y divide-white/5 font-geist text-sm">
            
            {/* Meter */}
            <div className="p-4 sm:p-5 flex justify-between items-center bg-white/0.5">
              <div>
                <span className="font-bebas text-base text-white tracking-widest block">METER (m)</span>
                <span className="text-xs text-white/40">Standard SI Unit</span>
              </div>
              <span className="text-amber-500 font-semibold text-right">Physical Length</span>
            </div>

            {/* Kilogram */}
            <div className="p-4 sm:p-5 flex justify-between items-center bg-transparent">
              <div>
                <span className="font-bebas text-base text-white tracking-widest block">KILOGRAM (kg)</span>
                <span className="text-xs text-white/40">Standard SI Unit</span>
              </div>
              <span className="text-amber-500 font-semibold text-right">Physical Mass</span>
            </div>

            {/* Second */}
            <div className="p-4 sm:p-5 flex justify-between items-center bg-white/0.5">
              <div>
                <span className="font-bebas text-base text-white tracking-widest block">SECOND (s)</span>
                <span className="text-xs text-white/40">Standard SI Unit</span>
              </div>
              <span className="text-amber-500 font-semibold text-right">Physical Time</span>
            </div>

            {/* GP Unit */}
            <div className="p-4 sm:p-5 flex justify-between items-center bg-amber-950/10 shadow-[inset_0_0_30px_rgba(245,158,11,0.03)] border-l-2 border-l-amber-500">
              <div>
                <span className="font-bebas text-lg text-white tracking-widest block text-amber-400">GLOBAL PRICE (GP)</span>
                <span className="text-xs text-amber-400/50 font-medium">Core Value Metric</span>
              </div>
              <span className="text-green-400 font-bebas text-lg tracking-wider text-right font-bold uppercase">Product Intrinsic Value</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── TECHNICAL PHILOSOPHIES ── */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-bebas text-3xl tracking-widest text-white">CORE PRINCIPLES</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">HOW WE PRESERVE METRIC INTEGRITY</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6 flex flex-col gap-3 group hover:border-amber-500/20 transition-colors">
            <Compass className="text-amber-400 w-6 h-6" />
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">Physical Anchor</h4>
            <p className="font-geist text-xs text-white/50 leading-relaxed">
              We tie valuation strictly to GFRB baseline indices. If raw energy and food become scarce, the standard scales accordingly.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 flex flex-col gap-3 group hover:border-amber-500/20 transition-colors">
            <Scale className="text-amber-400 w-6 h-6" />
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">Statistical Stability</h4>
            <p className="font-geist text-xs text-white/50 leading-relaxed">
              By utilizing EWMA smoothing filters, we ignore daily speculative noise and focus purely on underlying multi-year economic structures.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 flex flex-col gap-3 group hover:border-amber-500/20 transition-colors">
            <Award className="text-amber-400 w-6 h-6" />
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">Open Metrics</h4>
            <p className="font-geist text-xs text-white/50 leading-relaxed">
              No private keys, no subscription tiers, and no proprietary lock-ins. Every formula and source is fully open-source and free to replicate.
            </p>
          </div>
        </div>
      </section>

      {/* ── LIMITATIONS & HONESTY ── */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-bebas text-3xl tracking-widest text-white">LIMITATIONS & HONESTY</h2>
          <p className="font-geist text-xs text-red-400 uppercase tracking-widest">WHAT GP CANNOT ACCOUNT FOR YET</p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-red-500/10 bg-red-950/5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <HelpCircle className="text-red-400 w-5 h-5 shrink-0" />
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">TRANSPARENCY PROFILE</h4>
          </div>
          <ul className="space-y-3 font-geist text-xs sm:text-sm text-white/60 leading-relaxed list-disc list-inside">
            <li>
              <strong>Unmapped Import Sanctions:</strong> In countries with extreme financial embargoes or black-market forex corridors (e.g. Venezuela, Iran), nominal exchange rates are highly distorted. This can lead to low-confidence valuation outputs.
            </li>
            <li>
              <strong>Shipping Volatility:</strong> We utilize static logistics indicators derived from the World Bank LPI. During acute shipping crises (e.g. Suez Canal blocks, fuel spike crises), freight friction spikes dynamically and may exceed our static weights.
            </li>
            <li>
              <strong>Non-Standardized Local Sourcing:</strong> Products heavily reliant on hyper-localized agricultural ingredients (like local fresh foods) bypass international port duties and will show wider variance than global items like smartphones.
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
};
export default About;
