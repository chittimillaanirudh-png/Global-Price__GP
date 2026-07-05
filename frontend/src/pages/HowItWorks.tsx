// src/pages/HowItWorks.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertCircle, ArrowRight, Zap, ShieldAlert, Cpu, Layers, HelpCircle, 
  Workflow, ArrowDownRight, Globe, TrendingUp, Sparkles, BookOpen, ChevronDown, Ruler 
} from "lucide-react";
import { StaggeredFade } from "../components/StaggeredFade";

export const HowItWorks: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [activeAnchorCountry, setActiveAnchorCountry] = useState("USA");

  // Accordion toggle helper
  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  // Physical Anchor Basket cost updating per country
  const countryBasketCosts: { [key: string]: { label: string; rate: number; currency: string; total: number } } = {
    USA: { label: "United States", rate: 1.0, currency: "$", total: 53.10 },
    India: { label: "India", rate: 84.0, currency: "₹", total: 4460.40 },
    Germany: { label: "Germany (Eurozone)", rate: 0.92, currency: "€", total: 48.85 },
    Japan: { label: "Japan", rate: 155.0, currency: "¥", total: 8230.50 },
    Brazil: { label: "Brazil", rate: 5.25, currency: "R$", total: 278.78 },
    UK: { label: "United Kingdom", rate: 0.78, currency: "£", total: 41.42 }
  };

  const selectedBasket = countryBasketCosts[activeAnchorCountry];

  return (
    <div className="relative z-10 w-full min-h-screen pt-24 px-6 sm:px-10 pb-20 max-w-6xl mx-auto space-y-24">
      
      {/* ── HEADER ── */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-bebas text-5xl sm:text-6xl tracking-widest text-white uppercase">HOW GP WORKS</h1>
        <div className="w-12 h-0.5 bg-amber-500 mx-auto" />
        <p className="font-geist text-sm sm:text-base font-light text-white/55 leading-relaxed">
          The mathematical and economic science behind universal, borderless product value measurement.
        </p>
      </div>

      {/* ── SECTION 1: WHY EXCHANGE RATES FAIL ── */}
      <section className="space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-bebas text-3xl tracking-widest text-white">1. WHY NOMINAL EXCHANGE RATES FAIL</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">THE CURRENCY PREDICTION DISCONNECT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-white/20">
            <div>
              <span className="font-bebas text-xs tracking-wider text-white/40 uppercase block">REFERENCE PRICE</span>
              <h4 className="font-bebas text-2xl text-white tracking-wider mt-1">iPhone 16 Pro · USA</h4>
            </div>
            <div className="py-8 text-center font-bebas text-5xl text-white font-bold tracking-widest">
              $999
            </div>
            <p className="font-geist text-xs text-white/40">
              The baseline commercial cost representing nominal value in the core reference market.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-amber-500/20">
            <div>
              <span className="font-bebas text-xs tracking-wider text-amber-400 uppercase block">NOMINAL PREDICTION</span>
              <h4 className="font-bebas text-2xl text-amber-400 tracking-wider mt-1">NATIVE EXCHANGE CONVERSION</h4>
            </div>
            <div className="py-8 text-center font-bebas text-4xl text-amber-400 tracking-widest">
              ₹83,900
            </div>
            <p className="font-geist text-xs text-white/40">
              Typical value if converting strictly via today's standard forex exchange rate (1 USD = 84.00 INR).
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-red-500/20 bg-red-950/5">
            <div>
              <span className="font-bebas text-xs tracking-wider text-red-400 uppercase block">REAL MARKET REALITY</span>
              <h4 className="font-bebas text-2xl text-red-400 tracking-wider mt-1">ACTUAL INDIAN PRICE</h4>
            </div>
            <div className="py-8 text-center font-bebas text-5xl text-red-400 tracking-widest">
              ₹1,34,900
            </div>
            <p className="font-geist text-xs text-white/40">
              The actual retail price in Indian markets, featuring heavy local import taxes, margins, and duties.
            </p>
          </div>
        </div>

        {/* Comparison Indicator */}
        <div className="glass-card rounded-xl p-5 border border-red-500/10 bg-red-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-red-400 w-6 h-6 shrink-0" />
            <p className="font-geist text-sm text-white/80 leading-relaxed text-center sm:text-left">
              Standard forex conversions are <span className="text-red-400 font-semibold">-38% wrong</span> when projecting real-world retail value. Local fiscal and structural barriers completely break simple multiplier conversions.
            </p>
          </div>
          <div className="font-bebas text-xl text-red-400 tracking-widest uppercase border border-red-500/20 px-3.5 py-1.5 rounded-lg shrink-0">
            FOREX IS DEFICIENT
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PHYSICAL ANCHOR ── */}
      <section className="space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-bebas text-3xl tracking-widest text-white">2. THE PHYSICAL ANCHOR (GFRB)</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">GLOBAL FUNDAMENTAL RESOURCE BASKET</p>
        </div>

        <p className="font-geist text-sm text-white/60 leading-relaxed max-w-3xl">
          To create currency-independent value mapping, GP standardizes price relative to a physical basket of basic global inputs: GFRB (Global Fundamental Resource Basket). The physical basket represents basic industrial, agricultural, energy, and labor inputs.
        </p>

        {/* 4 Commodity Anchor Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card rounded-xl p-5 text-center flex flex-col items-center gap-2 border-t-2 border-t-amber-500">
            <Zap className="text-amber-400 w-6 h-6" />
            <h5 className="font-bebas text-base tracking-wider text-white">ENERGY</h5>
            <span className="font-bebas text-2xl text-amber-400">1 MWh</span>
            <p className="font-geist text-[11px] text-white/40 leading-relaxed">Natural Gas index proxy ($50.00 base value)</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center flex flex-col items-center gap-2 border-t-2 border-t-amber-500">
            <Layers className="text-amber-400 w-6 h-6" />
            <h5 className="font-bebas text-base tracking-wider text-white">FOOD</h5>
            <span className="font-bebas text-2xl text-amber-400">1000 kCal</span>
            <p className="font-geist text-[11px] text-white/40 leading-relaxed">Wheat grain commodity proxy ($0.30 base value)</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center flex flex-col items-center gap-2 border-t-2 border-t-amber-500">
            <Cpu className="text-amber-400 w-6 h-6" />
            <h5 className="font-bebas text-base tracking-wider text-white">METALS</h5>
            <span className="font-bebas text-2xl text-amber-400">1 kg Steel</span>
            <p className="font-geist text-[11px] text-white/40 leading-relaxed">Iron ore materials proxy ($0.80 base value)</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center flex flex-col items-center gap-2 border-t-2 border-t-amber-500">
            <Ruler className="text-amber-400 w-6 h-6" />
            <h5 className="font-bebas text-base tracking-wider text-white">LABOR</h5>
            <span className="font-bebas text-2xl text-amber-400">1 Hour</span>
            <p className="font-geist text-[11px] text-white/40 leading-relaxed">Global median labor cost ($2.00 base hourly wages)</p>
          </div>
        </div>

        {/* Formula Block */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <h4 className="font-bebas text-lg tracking-widest text-white">GFRB BASKET CALCULATION</h4>
              <p className="font-geist text-xs text-white/55 leading-relaxed">
                We compute the daily basket cost <span className="font-semibold text-amber-400">V_c</span> inside any nation's native currency. Select a country to see GFRB update:
              </p>
              
              {/* Country Selection Pill Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.keys(countryBasketCosts).map((code) => (
                  <button
                    key={code}
                    onClick={() => setActiveAnchorCountry(code)}
                    className={`px-3 py-1 text-xs rounded-full border cursor-pointer font-geist transition-colors ${
                      activeAnchorCountry === code
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                        : "bg-white/3 text-white/60 border-white/5 hover:text-white"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 w-full md:w-auto text-center md:text-right shrink-0">
              <div className="font-bebas text-[11px] text-white/30 tracking-[0.2em]">BASKET EQUATION</div>
              <div className="bg-black/50 border border-white/8 px-6 py-4 rounded-xl font-mono text-sm text-amber-400 shadow-inner">
                V_c = (Energy + Food + Steel + Labor) × E_c
              </div>
              <div className="font-bebas text-2xl text-white tracking-widest">
                GFRB ({selectedBasket.label}): <span className="text-green-400">{selectedBasket.currency}{selectedBasket.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: STEP-BY-STEP SOLVER PIPELINE ── */}
      <section className="space-y-12">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-bebas text-3xl tracking-widest text-white">3. THE SOLVER MATHEMATICS</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">STEP-BY-STEP ALGORITHM WALKTHROUGH</p>
        </div>

        <div className="space-y-8 relative">
          {/* Vertical connecting bar */}
          <div className="absolute left-6 md:left-1/2 top-10 bottom-10 w-0.5 border-l border-dashed border-amber-500/15 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center font-bebas text-amber-500 text-xl shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              01
            </div>
            <div className="glass-card rounded-2xl p-6 flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <h4 className="font-bebas text-xl text-white tracking-widest uppercase">STRIP LOCAL FRICTIONS</h4>
                <code className="text-amber-400 font-mono text-xs">P_clean = P(p,c) ÷ θ(p,c)</code>
              </div>
              <p className="font-geist text-sm text-white/60 leading-relaxed">
                We collect the local commercial price and divide it by the country's specific regional friction score <span className="font-semibold text-white/80">θ(p,c)</span>. This completely strips away import duties, local GST/VAT taxes, logistics overhead penalties, and average retail margins, restoring the product back to its pure pre-distribution cost.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center font-bebas text-amber-500 text-xl shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              02
            </div>
            <div className="glass-card rounded-2xl p-6 flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <h4 className="font-bebas text-xl text-white tracking-widest uppercase">NORMALIZE AGAINST BASKET</h4>
                <code className="text-amber-400 font-mono text-xs">PPNP = P_clean ÷ V_c</code>
              </div>
              <p className="font-geist text-sm text-white/60 leading-relaxed">
                The stripped clean price is then divided by <span className="font-semibold text-white/80">V_c</span> (the native currency cost of our global commodity GFRB basket). This completely eliminates the native currency symbol and nominal unit scaling, transforming the price into a pure coefficient of raw physical effort.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center font-bebas text-amber-500 text-xl shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              03
            </div>
            <div className="glass-card rounded-2xl p-6 flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <h4 className="font-bebas text-xl text-white tracking-widest uppercase">APPLY PURCHASING POWER CORRECTION</h4>
                <code className="text-amber-400 font-mono text-xs">PPNP_adjusted = PPNP × (PPP_c ÷ E_c) × (CPI_0 ÷ CPI_c)</code>
              </div>
              <p className="font-geist text-sm text-white/60 leading-relaxed">
                Next, we correct the PPNP by multiplying it by the ratio of the country's World Bank Purchasing Power Parity (PPP) factor to its nominal exchange rate, alongside an inflation adjustment (CPI ratio). This maps the absolute raw price coefficient to equivalent global economic purchase power.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center font-bebas text-amber-500 text-xl shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              04
            </div>
            <div className="glass-card rounded-2xl p-6 flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <h4 className="font-bebas text-xl text-white tracking-widest uppercase">COMPUTE & SMOOTH GP</h4>
                <code className="text-amber-400 font-mono text-xs">GP = 0.15 × GP_raw + 0.85 × GP_previous</code>
              </div>
              <p className="font-geist text-sm text-white/60 leading-relaxed">
                We run an Exponentially Weighted Moving Average (EWMA) using a smoothing parameter of <span className="font-semibold text-white/80">0.15</span>. This filter stabilizes short-term exchange rate shocks and pricing spikes, preserving the slow-moving structural baseline of the product's actual global price standard.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center font-bebas text-amber-500 text-xl shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              05
            </div>
            <div className="glass-card rounded-2xl p-6 flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <h4 className="font-bebas text-xl text-white tracking-widest uppercase">REVERSE TO EVERY NATION</h4>
                <code className="text-amber-400 font-mono text-xs">P_predicted(c) = P_base(c) × θ(p,c)</code>
              </div>
              <p className="font-geist text-sm text-white/60 leading-relaxed">
                Finally, we can reverse the process for any target destination. We project the stabilized GP unit back, calculate the destination's custom GFRB basket conversion cost, inject local country tariffs, local VAT rates, retail markups, and logistics scores, predicting a highly realistic local purchase price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: LIVE WORKED MATHEMATICAL EXAMPLE ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-bebas text-3xl tracking-widest text-white">4. LIVE CALCULATED EXAMPLE</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">PRODUCT UNDER TEST: iPhone 16 Pro (India, ₹1,34,900)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Box 1 */}
          <div className="glass-card rounded-xl p-5 space-y-2">
            <span className="font-bebas text-xs text-white/40 tracking-wider">STEP 1</span>
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">V_INDIA BASKET COST</h4>
            <div className="bg-black/30 border border-white/5 p-2 rounded text-xs font-mono text-amber-400">
              ($50 + $0.30 + $0.80 + $2) × 84
            </div>
            <p className="font-bebas text-xl text-white">GFRB = <span className="text-amber-500">₹4,460</span></p>
          </div>

          {/* Box 2 */}
          <div className="glass-card rounded-xl p-5 space-y-2">
            <span className="font-bebas text-xs text-white/40 tracking-wider">STEP 2</span>
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">INDIA NATIONAL WEIGHT</h4>
            <div className="bg-black/30 border border-white/5 p-2 rounded text-xs font-mono text-amber-400">
              3700^0.5 × 0.82 × exp(-0.003)
            </div>
            <p className="font-bebas text-xl text-white">Weight = <span className="text-amber-500">49.9</span></p>
          </div>

          {/* Box 3 */}
          <div className="glass-card rounded-xl p-5 space-y-2">
            <span className="font-bebas text-xs text-white/40 tracking-wider">STEP 3</span>
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">INDIA ADJUSTMENT θ</h4>
            <div className="bg-black/30 border border-white/5 p-2 rounded text-xs font-mono text-amber-400">
              1.20 × 1.18 × 1.40 × 1.28
            </div>
            <p className="font-bebas text-xl text-white">θ Coefficient = <span className="text-amber-500">2.537</span></p>
          </div>

          {/* Box 4 */}
          <div className="glass-card rounded-xl p-5 space-y-2">
            <span className="font-bebas text-xs text-white/40 tracking-wider">STEP 4</span>
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">STRIP LOCAL FRICTIONS</h4>
            <div className="bg-black/30 border border-white/5 p-2 rounded text-xs font-mono text-amber-400">
              ₹1,34,900 ÷ 2.537
            </div>
            <p className="font-bebas text-xl text-white">Clean Base = <span className="text-amber-500">₹53,173</span></p>
          </div>

          {/* Box 5 */}
          <div className="glass-card rounded-xl p-5 space-y-2">
            <span className="font-bebas text-xs text-white/40 tracking-wider">STEP 5</span>
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">NORMALIZE TO BASKET</h4>
            <div className="bg-black/30 border border-white/5 p-2 rounded text-xs font-mono text-amber-400">
              ₹53,173 ÷ ₹4,460
            </div>
            <p className="font-bebas text-xl text-white">PPNP Coefficient = <span className="text-amber-500">11.92</span></p>
          </div>

          {/* Box 6 */}
          <div className="glass-card rounded-xl p-5 space-y-2">
            <span className="font-bebas text-xs text-white/40 tracking-wider">STEP 6</span>
            <h4 className="font-bebas text-lg text-white tracking-widest uppercase">APPLY PPP AND CPI</h4>
            <div className="bg-black/30 border border-white/5 p-2 rounded text-xs font-mono text-amber-400">
              11.92 × (25÷84) × (100÷172)
            </div>
            <p className="font-bebas text-xl text-white">Raw GP = <span className="text-amber-500">2.062</span></p>
          </div>
        </div>

        {/* EWMA Display & final GP value */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/20 bg-amber-950/10 text-center space-y-4">
          <div className="space-y-1">
            <span className="font-geist text-xs text-amber-400 tracking-[0.2em] uppercase font-semibold">STEP 7: EXPONENTIALLY WEIGHTED MOVING AVERAGE</span>
            <div className="font-mono text-sm text-white/70">0.15 × 2.062 (Raw GP) + 0.85 × 2.050 (Previous historical smooth factor)</div>
          </div>
          <div className="font-bebas text-5xl md:text-6xl text-white font-bold tracking-widest drop-shadow-[0_0_30px_rgba(245,158,11,0.4)] pt-2">
            FINAL COMPUTATION: <span className="text-amber-500 animate-pulse">2.052 GP</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: THETA REGIONAL ADJUSTMENT ACCORDION ── */}
      <section className="space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-bebas text-3xl tracking-widest text-white">5. REGIONAL FRICTIONS (θ) EXPLAINED</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">BREAKDOWN OF LOCAL COST PENALTY MULTIPLIERS</p>
        </div>

        <div className="space-y-3">
          {/* Accordion 1: VAT / GST */}
          <div className="glass-card rounded-xl overflow-hidden border border-white/5">
            <button
              onClick={() => toggleAccordion("vat")}
              className="w-full flex items-center justify-between p-5 text-left font-bebas text-lg tracking-widest text-white hover:bg-white/2 cursor-pointer focus:outline-none"
            >
              <span>LOCAL SALES TAXES (VAT / GST)</span>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${activeAccordion === "vat" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeAccordion === "vat" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-5 font-geist text-sm text-white/60 space-y-2 border-t border-white/3 pt-3 bg-black/25"
                >
                  <p>
                    <strong>Definition:</strong> Local fiscal taxes added to commercial products on checkout (VAT, GST, State Taxes).
                  </p>
                  <p>
                    <strong>Data Source:</strong> World Bank Fiscal Systems directory and static fallbacks per country.
                  </p>
                  <p>
                    <strong>Example:</strong> India adds 18% GST to general consumer electronics, whereas Germany adds a flat 19% Mehrwertsteuer (MwSt).
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 2: Custom Duties */}
          <div className="glass-card rounded-xl overflow-hidden border border-white/5">
            <button
              onClick={() => toggleAccordion("duties")}
              className="w-full flex items-center justify-between p-5 text-left font-bebas text-lg tracking-widest text-white hover:bg-white/2 cursor-pointer focus:outline-none"
            >
              <span>CUSTOMS & IMPORT DUTY TARIFFS</span>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${activeAccordion === "duties" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeAccordion === "duties" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-5 font-geist text-sm text-white/60 space-y-2 border-t border-white/3 pt-3 bg-black/25"
                >
                  <p>
                    <strong>Definition:</strong> Direct protectionist or luxury tax tariffs slapped on items during port-of-entry clearance.
                  </p>
                  <p>
                    <strong>Data Source:</strong> WTO (World Trade Organization) duty profiles database.
                  </p>
                  <p>
                    <strong>Example:</strong> Developing nations apply custom duties of 20% to 35% on smartphones and vehicles to encourage localized industrial assembly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 3: Logistics friction */}
          <div className="glass-card rounded-xl overflow-hidden border border-white/5">
            <button
              onClick={() => toggleAccordion("logistics")}
              className="w-full flex items-center justify-between p-5 text-left font-bebas text-lg tracking-widest text-white hover:bg-white/2 cursor-pointer focus:outline-none"
            >
              <span>LOGISTICS INFRASTRUCTURE FRICTION SCORE</span>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${activeAccordion === "logistics" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeAccordion === "logistics" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-5 font-geist text-sm text-white/60 space-y-2 border-t border-white/3 pt-3 bg-black/25"
                >
                  <p>
                    <strong>Definition:</strong> General transport and supply chain penalty multiplier ranging from 1.0 (perfectly optimized) to 2.0 (high physical friction).
                  </p>
                  <p>
                    <strong>Data Source:</strong> World Bank LPI (Logistics Performance Index).
                  </p>
                  <p>
                    <strong>Example:</strong> Landlocked nations, islands, or countries with underdeveloped freight rail networks incur a higher logistics friction score.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 4: Retail Margin */}
          <div className="glass-card rounded-xl overflow-hidden border border-white/5">
            <button
              onClick={() => toggleAccordion("margin")}
              className="w-full flex items-center justify-between p-5 text-left font-bebas text-lg tracking-widest text-white hover:bg-white/2 cursor-pointer focus:outline-none"
            >
              <span>RETAIL DISTRIBUTION MARKUP MARGINS</span>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${activeAccordion === "margin" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeAccordion === "margin" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-5 font-geist text-sm text-white/60 space-y-2 border-t border-white/3 pt-3 bg-black/25"
                >
                  <p>
                    <strong>Definition:</strong> Local retailer margin fraction representing localized retail rent, customer acquisition costs, and competitive benchmarks.
                  </p>
                  <p>
                    <strong>Data Source:</strong> Industry retail indexes and category specific standard baselines.
                  </p>
                  <p>
                    <strong>Example:</strong> High-end luxury brands have margins exceeding 150%, whereas fuel and raw energy operate on extremely thin retail margin coefficients (5-15%).
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: DATA SOURCES ── */}
      <section className="space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-bebas text-3xl tracking-widest text-white">6. DATABASE DIRECTORY CREDITS</h2>
          <p className="font-geist text-xs text-amber-500 uppercase tracking-widest">LIVE FREE PUBLIC DATA FEED SOURCES</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6 space-y-3">
            <h4 className="font-bebas text-lg text-white tracking-widest">Frankfurter API</h4>
            <p className="font-geist text-xs text-white/50 leading-relaxed">
              Provides daily base exchange rates against USD for 30+ major currencies, allowing immediate live price translation.
            </p>
            <span className="inline-block px-2.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 font-bebas tracking-wider rounded uppercase">
              UPDATES DAILY · ZERO KEY
            </span>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3">
            <h4 className="font-bebas text-lg text-white tracking-widest">World Bank PPP/CPI Indicators</h4>
            <p className="font-geist text-xs text-white/50 leading-relaxed">
              Serves as our primary index of domestic purchasing power coefficients and consumer inflation weights for 195 countries.
            </p>
            <span className="inline-block px-2.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 font-bebas tracking-wider rounded uppercase">
              UPDATES MONTHLY/ANNUALLY
            </span>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3">
            <h4 className="font-bebas text-lg text-white tracking-widest">World Bank Commodities Feed</h4>
            <p className="font-geist text-xs text-white/50 leading-relaxed">
              Provides daily and monthly index values for Natural Gas, Wheat grain, and Iron ore to represent our physical anchor inputs.
            </p>
            <span className="inline-block px-2.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 font-bebas tracking-wider rounded uppercase">
              UPDATES MONTHLY
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
export default HowItWorks;
