// src/pages/GPExplanation.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Globe, Layers, ArrowRight, ArrowDown, Zap, Wheat, Box, User,
  CheckCircle2, AlertTriangle, Activity, Database, ShieldAlert, Cpu, 
  TrendingUp, RefreshCw, Layers3, ChevronDown, ChevronUp, Info, HelpCircle,
  Calculator, Check, ExternalLink, Sliders, Play, Scale, DollarSign, PieChart, BarChart3, Tag
} from "lucide-react";
import { COUNTRIES } from "../data/countries";
import { CountryData } from "../types";

interface GPExplanationProps {
  onNavigate?: (page: string) => void;
}

// Country Nodes for Interactive Data Wall / Map
const DEMO_MAP_COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹", exRate: 83.5, ppp: 25.0, cpi: 182.4, gdp: 3700, tax: 0.18, duty: 0.20, log: 1.40, margin: 0.28, dq: 0.82, gfrbCost: 4850, weight: 0.084 },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$", exRate: 1.0, ppp: 1.0, cpi: 310.2, gdp: 27000, tax: 0.07, duty: 0.00, log: 1.00, margin: 0.35, dq: 0.98, gfrbCost: 58.2, weight: 0.235 },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", symbol: "€", exRate: 0.92, ppp: 0.76, cpi: 118.5, gdp: 5500, tax: 0.19, duty: 0.00, log: 1.05, margin: 0.30, dq: 0.96, gfrbCost: 54.1, weight: 0.112 },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", symbol: "¥", exRate: 155.0, ppp: 102.0, cpi: 106.1, gdp: 6200, tax: 0.10, duty: 0.00, log: 1.15, margin: 0.30, dq: 0.95, gfrbCost: 8900, weight: 0.118 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£", exRate: 0.78, ppp: 0.69, cpi: 131.2, gdp: 3800, tax: 0.20, duty: 0.00, log: 1.08, margin: 0.32, dq: 0.95, gfrbCost: 47.8, weight: 0.089 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", symbol: "R$", exRate: 5.45, ppp: 2.75, cpi: 165.0, gdp: 4100, tax: 0.30, duty: 0.16, log: 1.50, margin: 0.35, dq: 0.75, gfrbCost: 315, weight: 0.076 },
  { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY", symbol: "¥", exRate: 7.24, ppp: 4.20, cpi: 103.5, gdp: 30000, tax: 0.13, duty: 0.00, log: 1.15, margin: 0.22, dq: 0.78, gfrbCost: 265, weight: 0.205 },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", symbol: "A$", exRate: 1.52, ppp: 1.45, cpi: 135.2, gdp: 1700, tax: 0.10, duty: 0.05, log: 1.20, margin: 0.32, dq: 0.94, gfrbCost: 89.4, weight: 0.045 },
];

// Sample Products for Interactive Reverse Conversion Simulator
const SIMULATOR_PRODUCTS = [
  { name: "Flagship Mobile Phone", category: "Mobile Phones", defaultGP: 84.5, baseUSD: 1199 },
  { name: "High-Performance Laptop", category: "Laptops", defaultGP: 128.2, baseUSD: 1799 },
  { name: "Mid-Range Smartphone", category: "Mobile Phones", defaultGP: 38.4, baseUSD: 499 },
  { name: "Ultralight Productivity Laptop", category: "Laptops", defaultGP: 72.0, baseUSD: 999 },
];

export const GPExplanation: React.FC<GPExplanationProps> = ({ onNavigate }) => {
  // Navigation Section Highlighting
  const [activeSection, setActiveSection] = useState("inputs");
  
  // Interactive Map State
  const [selectedMapCountry, setSelectedMapCountry] = useState(DEMO_MAP_COUNTRIES[0]);
  
  // Active Interactive Formula Variable Inspector
  const [inspectedVar, setInspectedVar] = useState<string | null>(null);
  
  // Reverse Converter Simulator State
  const [simProduct, setSimProduct] = useState(SIMULATOR_PRODUCTS[0]);
  const [customGP, setCustomGP] = useState(SIMULATOR_PRODUCTS[0].defaultGP);

  // Expandable Advantages/Limitations cards
  const [expandedAdv, setExpandedAdv] = useState<number | null>(null);
  const [expandedLim, setExpandedLim] = useState<number | null>(null);

  // Currency Crash Simulation state
  const [crashAlpha, setCrashAlpha] = useState(1.5); // 50% currency depreciation

  useEffect(() => {
    setCustomGP(simProduct.defaultGP);
  }, [simProduct]);

  // Scroll tracking to update sticky nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inputs", "local-to-gp", "gp-to-local", "feasibility", "advantages-limitations", "system-flow", "cheat-sheet"];
      const scrollPos = window.scrollY + 200;
      
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full text-white bg-[#030303] min-h-screen font-sans pb-24">
      {/* ─────────────────────────────────────────────────────────────
          STORYTELLING PRESENTATION HEADER / HERO
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 space-y-6"
        >
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>INTERACTIVE HACKATHON PRESENTATION GUIDE</span>
          </div>

          {/* Main Title */}
          <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400 uppercase drop-shadow-sm">
            GP — GLOBAL PRICE UNIT
          </h1>

          {/* Subtitle */}
          <h2 className="font-geist text-sm sm:text-base lg:text-lg text-white/80 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
            How the System Works: <span className="text-amber-400 font-semibold">Inputs</span> → <span className="text-amber-400 font-semibold">Calculation</span> → <span className="text-amber-400 font-semibold">Conversion</span> → <span className="text-amber-400 font-semibold">Validation</span> → <span className="text-amber-400 font-semibold">Advantages & Limitations</span>
          </h2>

          {/* Small Tagline */}
          <p className="font-mono text-xs sm:text-sm text-amber-300/70 max-w-2xl mx-auto italic bg-white/3 border border-white/5 py-2.5 px-6 rounded-xl">
            “A physical-basket-anchored experimental framework for comparing product prices across countries.”
          </p>

          {/* Animated System Journey Pipeline Banner */}
          <div className="pt-6">
            <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 bg-white/2 max-w-5xl mx-auto overflow-x-auto">
              <div className="flex items-center justify-between min-w-[760px] gap-2 text-center text-xs font-mono">
                {[
                  { label: "Country Data", icon: Database },
                  { label: "GFRB Anchor", icon: Layers },
                  { label: "Regional Friction", icon: Sliders },
                  { label: "Local Price", icon: Tag },
                  { label: "GP Engine", icon: Cpu },
                  { label: "Predicted Price", icon: TrendingUp },
                  { label: "Validation", icon: Activity },
                  { label: "Pros & Cons", icon: Scale },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all cursor-pointer">
                      <item.icon className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] text-white/90 whitespace-nowrap">{item.label}</span>
                    </div>
                    {idx < 7 && (
                      <ArrowRight className="w-3.5 h-3.5 text-amber-500/50 shrink-0 animate-pulse" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          STICKY SECTION NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4 text-xs font-mono">
          {[
            { id: "inputs", label: "01. Inputs" },
            { id: "local-to-gp", label: "02. Local → GP" },
            { id: "gp-to-local", label: "03. GP → Local" },
            { id: "feasibility", label: "04. Feasibility & Validity" },
            { id: "advantages-limitations", label: "05. Advantages & Limitations" },
            { id: "system-flow", label: "06. Architecture Flow" },
            { id: "cheat-sheet", label: "07. 30-Sec Pitch" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollTo(nav.id)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeSection === nav.id
                  ? "bg-amber-500 text-black font-semibold shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-28 pt-12">

        {/* ─────────────────────────────────────────────────────────────
            SECTION 1 — PERSON 2: INPUTS & DATA SOURCES
        ───────────────────────────────────────────────────────────── */}
        <section id="inputs" className="scroll-mt-36 space-y-12">
          {/* Section Header */}
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">PERSON 2 PRESENTATION SCOPE</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              01 — INPUTS & DATA SOURCES
            </h2>
            <p className="font-geist text-sm sm:text-base text-white/70 font-light">
              “Before calculating GP, the system collects economic, market, physical-basket, and country-specific data.”
            </p>
          </div>

          {/* Interactive Input Data Wall - 4 Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* GROUP A — MARKET INPUT */}
            <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <h3 className="font-bebas text-xl tracking-wider text-amber-400 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" /> GROUP A — MARKET INPUT
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">OBSERVED PRICE</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-amber-400">P(p,c)</span>
                  <span className="text-xs font-mono text-white/60">Local Retail Price</span>
                </div>
                <p className="text-xs text-white/80 font-light">
                  <strong className="text-white">Definition:</strong> The observed selling price of product <code className="text-amber-300">p</code> in country <code className="text-amber-300">c</code>.
                </p>
                <div className="pt-2 border-t border-white/5 flex flex-wrap justify-between text-[11px] font-mono text-white/60">
                  <span>Example: <strong>iPhone 17 Pro — India — ₹134,900</strong></span>
                  <span>Source: <strong>User / Market Data</strong></span>
                  <span>Update: <strong>Per query</strong></span>
                </div>
              </div>
            </div>

            {/* GROUP B — ECONOMIC DATA */}
            <div className="glass-card rounded-2xl p-6 border border-sky-500/30 bg-sky-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
                <h3 className="font-bebas text-xl tracking-wider text-sky-400 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-400" /> GROUP B — ECONOMIC DATA
                </h3>
                <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">MACRO METRICS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { sym: "E_c", name: "Exchange Rate", desc: "Local currency value relative to USD", source: "Frankfurter API", freq: "Daily" },
                  { sym: "PPP_c", name: "Purchasing Power Parity", desc: "Measures relative purchasing power between countries", source: "World Bank", freq: "Annual" },
                  { sym: "CPI_c", name: "Consumer Price Index", desc: "Accounts for domestic inflation and price levels", source: "World Bank", freq: "Monthly" },
                  { sym: "CPI_0", name: "Base-Year CPI", desc: "Fixed CPI reference used for inflation normalization", source: "World Bank", freq: "Fixed ref" },
                  { sym: "GDP_c", name: "GDP in PPP Terms", desc: "Determines country importance in global aggregation", source: "World Bank", freq: "Annual" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-sky-400/40 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-sm font-bold text-sky-400">{item.sym}</span>
                      <span className="text-[10px] font-mono text-sky-300/70">{item.source}</span>
                    </div>
                    <div className="font-semibold text-white/90 text-xs mb-1">{item.name}</div>
                    <p className="text-[11px] text-white/60 font-light leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GROUP C — REGIONAL / MARKET FRICTION DATA */}
            <div className="glass-card rounded-2xl p-6 border border-purple-500/30 bg-purple-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <h3 className="font-bebas text-xl tracking-wider text-purple-400 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" /> GROUP C — REGIONAL FRICTION DATA
                </h3>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">MARKET DISTORTIONS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { sym: "TAX_c", name: "VAT / GST", desc: "Consumption tax applied to product category", freq: "Law changes" },
                  { sym: "DUTY_c", name: "Import Duty", desc: "Applicable import tariff for product category", freq: "Policy changes" },
                  { sym: "LOG_c", name: "Logistics Friction", desc: "Transportation, shipping & distribution friction (1.0 - 2.0)", freq: "Periodic review" },
                  { sym: "MARGIN_c", name: "Retail Margin", desc: "Retailer / distributor markup for category", freq: "Admin review" },
                  { sym: "DQ_c", name: "Data Quality Score", desc: "Confidence & reliability score of country data (0.0 - 1.0)", freq: "Annual" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/40 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-sm font-bold text-purple-400">{item.sym}</span>
                      <span className="text-[10px] font-mono text-purple-300/70">{item.freq}</span>
                    </div>
                    <div className="font-semibold text-white/90 text-xs mb-1">{item.name}</div>
                    <p className="text-[11px] text-white/60 font-light leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GROUP D — COMPUTED VALUES */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <h3 className="font-bebas text-xl tracking-wider text-emerald-400 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" /> GROUP D — COMPUTED VALUES
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">SYSTEM OUTPUTS</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-base font-bold text-emerald-400">V_c</span>
                    <span className="text-xs text-white/90 block font-medium">GFRB Basket Cost</span>
                  </div>
                  <span className="text-xs font-mono text-white/70">Cost of physical basket in country c currency</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-base font-bold text-emerald-400">W_c</span>
                    <span className="text-xs text-white/90 block font-medium">Country Weight</span>
                  </div>
                  <span className="text-xs font-mono text-white/70">Importance of country c in global aggregation</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-lg font-bold text-amber-300">GP_p</span>
                    <span className="text-xs text-amber-100 block font-bold">Global Price of Product p</span>
                  </div>
                  <span className="text-xs font-mono text-amber-200">Final calculated universal GP unit value</span>
                </div>
              </div>
            </div>

          </div>

          {/* INTERACTIVE WORLD MAP & COUNTRY DATA NODE INSPECTOR */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bebas text-2xl tracking-wider text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-amber-400" /> INTERACTIVE COUNTRY DATA NODES INSPECTOR
                </h3>
                <p className="text-xs text-white/60 font-light">
                  Click or hover any country node below to inspect its exact live input parameters feeding into the GP Engine.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Country Data → GP Engine Flow Active</span>
              </div>
            </div>

            {/* Country Selector Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEMO_MAP_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedMapCountry(c)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    selectedMapCountry.code === c.code
                      ? "bg-amber-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <div className="font-semibold text-xs text-white">{c.name}</div>
                    <div className="font-mono text-[10px] text-amber-300/80">{c.currency} ({c.symbol})</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Country Data Card Output Inspector */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMapCountry.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedMapCountry.flag}</span>
                    <div>
                      <h4 className="font-bebas text-xl text-white tracking-wider">{selectedMapCountry.name} ({selectedMapCountry.code})</h4>
                      <span className="text-xs font-mono text-amber-400">Currency: {selectedMapCountry.currency} ({selectedMapCountry.symbol})</span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-white/50 block">Data Quality Score (DQ_c)</span>
                    <span className="text-emerald-400 font-bold text-sm">{(selectedMapCountry.dq * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Grid of parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[10px]">Exchange Rate (E_c)</span>
                    <span className="text-amber-300 font-bold text-sm">{selectedMapCountry.exRate} {selectedMapCountry.currency}/USD</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[10px]">PPP Factor (PPP_c)</span>
                    <span className="text-sky-300 font-bold text-sm">{selectedMapCountry.ppp}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[10px]">CPI Index (CPI_c)</span>
                    <span className="text-sky-300 font-bold text-sm">{selectedMapCountry.cpi}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[10px]">GDP PPP ($B)</span>
                    <span className="text-sky-300 font-bold text-sm">${selectedMapCountry.gdp.toLocaleString()}B</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[10px]">VAT / Duty Rate</span>
                    <span className="text-purple-300 font-bold text-sm">{(selectedMapCountry.tax * 100).toFixed(0)}% / {(selectedMapCountry.duty * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block text-[10px]">Logistics / Margin</span>
                    <span className="text-purple-300 font-bold text-sm">{selectedMapCountry.log} / {(selectedMapCountry.margin * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GFRB Cost (V_c): <strong>{selectedMapCountry.symbol}{selectedMapCountry.gfrbCost.toLocaleString()}</strong></span>
                  </div>
                  <div className="text-amber-400">
                    <span>Normalized Country Weight (W_c): <strong>{(selectedMapCountry.weight * 100).toFixed(1)}%</strong></span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 2 — PERSON 3: GP CALCULATION & PRICE CONVERSION
        ───────────────────────────────────────────────────────────── */}
        <section id="local-to-gp" className="scroll-mt-36 space-y-12">
          {/* Section Header */}
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">PERSON 3 PRESENTATION SCOPE — CORE MATHEMATICS</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              02 — FROM LOCAL PRICE TO GP
            </h2>
            <p className="font-geist text-sm sm:text-base text-white/70 font-light">
              “How does a real-world local price become a currency-independent GP value?”
            </p>
          </div>

          {/* Horizontal Visual Pipeline Cards */}
          <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4">
            <h3 className="font-bebas text-lg text-amber-400 tracking-wider">GP FORWARD ENGINE CALCULATION PIPELINE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {[
                { step: "1. Local Price P(p,c)", detail: "Observed retail price in country c" },
                { step: "2. Remove Frictions θ", detail: "Strip duty, VAT, logistics & margin" },
                { step: "3. Clean Price P_clean", detail: "Friction-adjusted base price" },
                { step: "4. Physical GFRB V_c", detail: "Energy + Food + Steel + Labor" },
                { step: "5. PPNP Ratio", detail: "P_clean / V_c (basket normalized)" },
                { step: "6. PPP & CPI Adjust", detail: "Apply (PPP_c / E_c) & (CPI_0 / CPI_c)" },
                { step: "7. Country Aggregation", detail: "Weighted sum across all countries W_c" },
                { step: "8. EWMA Smooth", detail: "0.15 * Raw + 0.85 * Previous -> GP" },
              ].map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all">
                  <div className="text-amber-400 font-bold mb-1">{p.step}</div>
                  <div className="text-white/60 text-[11px] font-light">{p.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1 FORMULA CARD */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">1</div>
                <h3 className="font-bebas text-2xl tracking-wider text-white">STEP 1 — GLOBAL FUNDAMENTAL REAL BASKET (GFRB)</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">V_c Calculation</span>
            </div>

            {/* 4 Physical Basket Components */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <Zap className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="font-bebas text-lg text-white block">ENERGY</span>
                <span className="text-xs font-mono text-white/60">1 MWh Electricity</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <Wheat className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="font-bebas text-lg text-white block">FOOD</span>
                <span className="text-xs font-mono text-white/60">1,000 kcal Grains</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <Box className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="font-bebas text-lg text-white block">MATERIAL</span>
                <span className="text-xs font-mono text-white/60">1 kg Standard Steel</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <User className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="font-bebas text-lg text-white block">LABOR</span>
                <span className="text-xs font-mono text-white/60">1 Hour Unskilled Labor</span>
              </div>
            </div>

            {/* Prominent Formula Card */}
            <div className="p-6 rounded-2xl bg-black/70 border border-amber-500/30 text-center font-mono space-y-3">
              <span className="text-xs text-white/50 uppercase tracking-widest block">PHYSICAL BASKET COST FORMULA</span>
              <div className="text-lg sm:text-2xl text-amber-400 font-bold tracking-wide">
                V_c = ( Energy_Price + Food_Price + Steel_Price + Labor_Cost ) × E_c
              </div>
              <p className="text-xs text-white/70 font-light">
                <strong>V_c</strong> = cost of the physical GFRB basket in country c's local currency.
              </p>
            </div>
          </div>

          {/* STEP 2 FORMULA CARD */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">2</div>
                <h3 className="font-bebas text-2xl tracking-wider text-white">STEP 2 — CALCULATE COUNTRY IMPORTANCE WEIGHT</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">W_c Calculation</span>
            </div>

            {/* Formula Area */}
            <div className="p-6 rounded-2xl bg-black/70 border border-amber-500/30 font-mono space-y-4 text-center">
              <div className="text-lg sm:text-2xl text-amber-400 font-bold">
                W_c = GDP_c<sup>0.5</sup> × DQ_c × exp(−0.10 × |ΔE_c|)
              </div>
              <div className="text-sm text-white/90">
                Normalized Weight: <span className="text-amber-300 font-bold">W_c(normalized) = W_c / Σ W_c</span>
              </div>
            </div>

            {/* 3 Visual Component Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-amber-400 font-bold block text-sm">GDP_c<sup>0.5</sup></span>
                <span className="text-white/80 font-medium block">Square Root Dampening</span>
                <p className="text-[11px] text-white/60 font-light">Prevents massive mega-economies from completely dominating global aggregation.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-amber-400 font-bold block text-sm">DQ_c</span>
                <span className="text-white/80 font-medium block">Data Quality Factor</span>
                <p className="text-[11px] text-white/60 font-light">Reduces the influence of countries with lower quality or unreliable economic data.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-amber-400 font-bold block text-sm">exp(−0.10 × |ΔE_c|)</span>
                <span className="text-white/80 font-medium block">Volatility Penalty</span>
                <p className="text-[11px] text-white/60 font-light">Applies a model-defined penalty when exchange-rate movements are unusually volatile.</p>
              </div>
            </div>
          </div>

          {/* STEP 3 & STEP 4 FORMULA CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* STEP 3 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">3</div>
                <h3 className="font-bebas text-xl text-white">STEP 3 — REGIONAL ADJUSTMENT FACTOR θ(p,c)</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-purple-500/30 font-mono text-center space-y-2">
                <div className="text-base sm:text-xl text-purple-300 font-bold">
                  θ(p,c) = (1 + DUTY_c) × (1 + TAX_c) × LOG_c × (1 + MARGIN_c)
                </div>
                <div className="text-xs text-white/70">θ &gt; 1 indicates higher local-market friction</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">Import Duty</div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">Sales Tax / VAT</div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">Logistics Friction</div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">Retail Margin</div>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">4</div>
                <h3 className="font-bebas text-xl text-white">STEP 4 — STRIP LOCAL MARKET FRICTIONS</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 font-mono text-center space-y-2">
                <div className="text-lg sm:text-2xl text-amber-400 font-bold">
                  P_clean(p,c) = P(p,c) / θ(p,c)
                </div>
                <div className="text-xs text-white/70">Observed price divided by regional friction factor θ</div>
              </div>

              <div className="flex items-center justify-around text-center text-xs font-mono">
                <div className="p-2 rounded bg-white/5">Observed Price</div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <div className="p-2 rounded bg-amber-500/10 text-amber-300">Remove Duty, Tax, Logistics & Margin</div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 font-bold">Clean Price</div>
              </div>
            </div>

          </div>

          {/* STEP 5 & STEP 6 FORMULA CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* STEP 5 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">5</div>
                <h3 className="font-bebas text-xl text-white">STEP 5 — PHYSICAL BASKET NORMALIZATION (PPNP)</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 font-mono text-center space-y-2">
                <div className="text-lg sm:text-2xl text-amber-400 font-bold">
                  PPNP(p,c) = P_clean(p,c) / V_c
                </div>
                <div className="text-xs text-white/70">PPNP = Purchasing Power Normalized Price</div>
              </div>

              <p className="text-xs text-white/80 font-light leading-relaxed">
                Expresses product price relative to the physical GFRB basket rather than directly in local currency.
              </p>
            </div>

            {/* STEP 6 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">6</div>
                <h3 className="font-bebas text-xl text-white">STEP 6 — ECONOMIC NORMALIZATION (PPP & CPI)</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-sky-500/30 font-mono text-center space-y-2">
                <div className="text-base sm:text-xl text-sky-300 font-bold">
                  PPNP_adjusted(p,c) = PPNP(p,c) × (PPP_c / E_c) × (CPI_0 / CPI_c)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <span className="text-sky-300 font-bold block">(PPP_c / E_c)</span>
                  <span className="text-white/70 text-[11px]">Purchasing-power adjustment</span>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <span className="text-sky-300 font-bold block">(CPI_0 / CPI_c)</span>
                  <span className="text-white/70 text-[11px]">Inflation / base-year adjustment</span>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 7 & STEP 8 FORMULA CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* STEP 7 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">7</div>
                <h3 className="font-bebas text-xl text-white">STEP 7 — COMBINE COUNTRIES (AGGREGATION)</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-emerald-500/30 font-mono text-center space-y-2">
                <div className="text-base sm:text-xl text-emerald-300 font-bold">
                  GP_p_raw = Σ [ W_c(normalized) × PPNP_adjusted(p,c) ]
                </div>
                <div className="text-[11px] text-white/60">If single country: GP_p_raw = PPNP_adjusted(p,c)</div>
              </div>

              <p className="text-xs text-white/80 font-light leading-relaxed">
                Combines multiple country inputs weighted by each country's normalized importance score <code className="text-amber-300">W_c</code>.
              </p>
            </div>

            {/* STEP 8 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bebas text-xl flex items-center justify-center border border-amber-500/40">8</div>
                <h3 className="font-bebas text-xl text-white">STEP 8 — EWMA SMOOTHING</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 font-mono text-center space-y-2">
                <div className="text-base sm:text-xl text-amber-300 font-bold">
                  GP_p_smooth(today) = 0.15 × GP_p_raw + 0.85 × GP_p_smooth(yesterday)
                </div>
                <div className="text-xs text-white/70">Exponentially Weighted Moving Average (EWMA)</div>
              </div>

              <p className="text-xs text-white/80 font-light leading-relaxed">
                Smooths out short-term noise, exchange-rate spikes, and temporary price fluctuations.
              </p>
            </div>

          </div>

          {/* FINAL HIGHLIGHTED GP OUTPUT CARD */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-black to-amber-500/20 border-2 border-amber-500/50 text-center space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase font-semibold">FINAL SYSTEM RESULT</span>
            <div className="font-bebas text-4xl sm:text-6xl text-amber-300 tracking-wider">
              GP_p = GP_p_smooth
            </div>
            <p className="font-geist text-sm sm:text-base text-white/90 font-light">
              Final Global Price Unit value — A physical-basket-anchored, friction-adjusted, economic metric.
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 3 — PERSON 3: REVERSE CONVERSION (GP -> LOCAL PRICE)
        ───────────────────────────────────────────────────────────── */}
        <section id="gp-to-local" className="scroll-mt-36 space-y-12">
          {/* Section Header */}
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">PERSON 3 PRESENTATION SCOPE — REVERSE ENGINE</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              03 — FROM GP BACK TO LOCAL PRICE
            </h2>
            <p className="font-geist text-sm sm:text-base text-white/70 font-light">
              “Once GP is known, how can the system estimate the corresponding market price in another country?”
            </p>
          </div>

          {/* Reverse Conversion Pipeline Visual */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 text-center space-y-6">
            <h3 className="font-bebas text-xl text-amber-400 tracking-wider">REVERSE ENGINE TRANSFORM</h3>
            <div className="flex flex-col md:flex-row items-center justify-around gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                1. Known GP Value
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 rotate-90 md:rotate-0" />
              <div className="p-4 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold">
                2. Country Economic Factors (V_c, E_c, PPP_c, CPI_c)
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 rotate-90 md:rotate-0" />
              <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                3. Regional Frictions θ(p,c)
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 rotate-90 md:rotate-0" />
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                4. Predicted Local Price P_predicted
              </div>
            </div>
          </div>

          {/* Step 1 & Step 2 Formulas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bebas text-xl text-white">STEP 1 — CONVERT GP TO COUNTRY BASE VALUE</h3>
              <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 font-mono text-center">
                <div className="text-base sm:text-xl text-amber-400 font-bold">
                  P_base(p,c) = GP_p × V_c × (E_c / PPP_c) × (CPI_c / CPI_0)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/70">
                <div className="p-2 bg-white/5 rounded">GP_p: Global product value</div>
                <div className="p-2 bg-white/5 rounded">V_c: Country GFRB basket cost</div>
                <div className="p-2 bg-white/5 rounded">E_c / PPP_c: Currency conversion factor</div>
                <div className="p-2 bg-white/5 rounded">CPI_c / CPI_0: Inflation relationship</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bebas text-xl text-white">STEP 2 — ADD REGIONAL MARKET FRICTIONS</h3>
              <div className="p-4 rounded-xl bg-black/70 border border-emerald-500/30 font-mono text-center">
                <div className="text-base sm:text-xl text-emerald-400 font-bold">
                  P_predicted(p,c) = P_base(p,c) × θ(p,c)
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded font-mono text-[11px] text-white/70 text-center">
                θ(p,c) = (1 + DUTY_c) × (1 + TAX_c) × LOG_c × (1 + MARGIN_c)
              </div>
            </div>

          </div>

          {/* INTERACTIVE REVERSE CONVERTER SIMULATOR DEMO */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bebas text-2xl tracking-wider text-amber-400 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-amber-400" /> INTERACTIVE GP → LOCAL PRICE PREDICTOR DEMO
                </h3>
                <p className="text-xs text-white/60 font-light">
                  Select a product or adjust the GP value to see real-time price predictions generated across target countries.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Live Reverse Engine Active</span>
              </div>
            </div>

            {/* Product Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {SIMULATOR_PRODUCTS.map((prod, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimProduct(prod)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    simProduct.name === prod.name
                      ? "bg-amber-500/20 border-amber-400 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-xs text-white font-medium">{prod.name}</div>
                  <div className="text-[10px] font-mono text-amber-300">GP = {prod.defaultGP}</div>
                </button>
              ))}
            </div>

            {/* Dynamic Predictions Output Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">GP Value</th>
                    <th className="py-3 px-4">GFRB Cost (V_c)</th>
                    <th className="py-3 px-4">PPP</th>
                    <th className="py-3 px-4">Friction θ</th>
                    <th className="py-3 px-4 text-right">Predicted Local Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {DEMO_MAP_COUNTRIES.map((c) => {
                    const theta = (1 + c.duty) * (1 + c.tax) * c.log * (1 + c.margin);
                    const pBaseUSD = (customGP * (c.gfrbCost / c.exRate) * (1.0 / c.ppp));
                    const predictedLocal = pBaseUSD * c.exRate * theta;

                    return (
                      <tr key={c.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <span className="text-lg">{c.flag}</span>
                          <span className="font-semibold text-white">{c.name}</span>
                        </td>
                        <td className="py-3 px-4 text-amber-400 font-bold">{customGP.toFixed(1)}</td>
                        <td className="py-3 px-4 text-white/80">{c.symbol}{c.gfrbCost.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sky-300">{c.ppp}</td>
                        <td className="py-3 px-4 text-purple-300">{theta.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-bold text-amber-300 text-sm">
                          {c.symbol}{Math.round(predictedLocal).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 4 — PERSON 4: FEASIBILITY & VALIDITY
        ───────────────────────────────────────────────────────────── */}
        <section id="feasibility" className="scroll-mt-36 space-y-12">
          {/* Section Header */}
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">PERSON 4 PRESENTATION SCOPE — EVALUATION & TESTING</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              04 — FEASIBILITY, VALIDITY & EXPERIMENTAL EVALUATION
            </h2>
            <p className="font-geist text-sm sm:text-base text-white/70 font-light">
              “Can this framework actually work, and how should its performance be tested?”
            </p>
          </div>

          {/* Prototype Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>EXPERIMENTAL FRAMEWORK / PROTOTYPE — MODEL-DEFINED NORMALIZATION</span>
          </div>

          {/* 3 Major Cards: Data Feasibility, Computational Feasibility, Validity Testing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* A. DATA FEASIBILITY */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bebas text-xl text-amber-400 flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" /> A. DATA FEASIBILITY
              </h3>
              <p className="text-xs text-white/70 font-light">
                Can the required data be systematically obtained?
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2 rounded bg-white/5 flex justify-between">
                  <span>Exchange Rates</span>
                  <span className="text-emerald-400">Public API</span>
                </div>
                <div className="p-2 rounded bg-white/5 flex justify-between">
                  <span>PPP & CPI</span>
                  <span className="text-emerald-400">World Bank API</span>
                </div>
                <div className="p-2 rounded bg-white/5 flex justify-between">
                  <span>Market Prices</span>
                  <span className="text-emerald-400">User / Web Data</span>
                </div>
                <div className="p-2 rounded bg-white/5 flex justify-between">
                  <span>Tax & Duty Tables</span>
                  <span className="text-emerald-400">Maintained DB</span>
                </div>
              </div>
            </div>

            {/* B. COMPUTATIONAL FEASIBILITY */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bebas text-xl text-sky-400 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-400" /> B. COMPUTATIONAL FEASIBILITY
              </h3>
              <p className="text-xs text-white/70 font-light">
                Mathematical operations are lightweight (Multiplication, Division, Summation, EWMA).
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-sky-500/30 text-center font-mono text-[11px] space-y-1">
                <span className="text-sky-300 block font-bold">Lightweight Architecture</span>
                <span className="text-white/60">Input Data → Validation → Normalization → GP Calc → Reverse Output</span>
              </div>
            </div>

            {/* C. VALIDITY TESTING */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bebas text-xl text-purple-400 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" /> C. VALIDATION CRITERIA
              </h3>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-white/5">
                  <strong className="text-purple-300">1. Prediction Error:</strong> |Predicted - Actual| / Actual * 100
                </div>
                <div className="p-2 rounded bg-white/5">
                  <strong className="text-purple-300">2. Stability:</strong> Compare Raw GP vs EWMA Smoothed GP
                </div>
                <div className="p-2 rounded bg-white/5">
                  <strong className="text-purple-300">3. Robustness:</strong> Test under currency shocks & inflation
                </div>
              </div>
            </div>

          </div>

          {/* CURRENCY CRASH EXPERIMENT (SCALE-INVARIANCE DEMO) */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bebas text-2xl tracking-wider text-amber-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" /> CURRENCY CRASH EXPERIMENT (SCALE-INVARIANCE)
              </h3>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Mathematical Cancellation Proof</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 space-y-3">
                <span className="text-amber-400 font-bold block text-sm">Proportional Rescaling Cancellation:</span>
                <div className="text-base text-amber-300 font-bold text-center py-2 bg-white/5 rounded">
                  P_new = α × P &nbsp;&nbsp;|&nbsp;&nbsp; V_new = α × V
                </div>
                <div className="text-center text-sm text-emerald-400 font-bold">
                  P_new / V_new = (α × P) / (α × V) = P / V
                </div>
                <p className="text-[11px] text-white/70 font-light leading-relaxed">
                  Demonstrates intended scale-invariance under proportional currency rescaling.
                </p>
              </div>

              {/* Interactive Currency Rescaling Slider */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Simulate Currency Depreciation (α):</span>
                  <span className="text-amber-400 font-bold text-sm">+{((crashAlpha - 1) * 100).toFixed(0)}% Inflated</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={crashAlpha}
                  onChange={(e) => setCrashAlpha(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded bg-white/5">
                    <span className="text-white/50 block">Local Price P</span>
                    <span className="text-white font-bold">₹{(134900 * crashAlpha).toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <span className="text-white/50 block">Basket Cost V_c</span>
                    <span className="text-white font-bold">₹{(4850 * crashAlpha).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 text-center font-bold text-xs">
                  Normalized P / V Ratio = 27.81 (REMAINS CONSTANT!)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 5 — PERSON 5: ADVANTAGES & LIMITATIONS
        ───────────────────────────────────────────────────────────── */}
        <section id="advantages-limitations" className="scroll-mt-36 space-y-12">
          {/* Section Header */}
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">PERSON 5 PRESENTATION SCOPE — CRITICAL ANALYSIS</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              05 — ADVANTAGES & LIMITATIONS
            </h2>
            <p className="font-geist text-sm sm:text-base text-white/70 font-light">
              A balanced hackathon analysis highlighting both strengths and realistic boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ADVANTAGES COLUMN */}
            <div className="space-y-4">
              <h3 className="font-bebas text-2xl tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" /> SYSTEM ADVANTAGES
              </h3>

              {[
                { title: "Physical Anchor", icon: "🌍", desc: "Uses a real-world physical basket of Energy + Food + Steel + Labor rather than relying on any single fiat currency." },
                { title: "Cross-Country Comparability", icon: "💱", desc: "Provides a common normalized framework for comparing product valuations directly across diverse global markets." },
                { title: "Currency-Scale Robustness", icon: "🛡️", desc: "Basket normalization reduces dependence on arbitrary currency denomination and scale changes." },
                { title: "Local Market Adjustment", icon: "⚙️", desc: "Explicitly models selected market distortions including tax, duty, logistics, and retail margin." },
                { title: "Two-Way Conversion", icon: "🔄", desc: "Supports both Local Price → GP and GP → Predicted Local Price." },
                { title: "Data Quality Awareness", icon: "📊", desc: "Country weights include a data-quality factor (DQ_c) to reduce noise from unreliable sources." },
                { title: "EWMA Noise Smoothing", icon: "📉", desc: "Exponentially Weighted Moving Average filters short-term market fluctuations." },
                { title: "Prototype-Friendly", icon: "🧪", desc: "Successfully combines public APIs, databases, formulas, and web interface into a working hackathon tool." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setExpandedAdv(expandedAdv === idx ? null : idx)}
                  className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 font-semibold text-sm text-white">
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    {expandedAdv === idx ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-400" />}
                  </div>
                  {expandedAdv === idx && (
                    <p className="text-xs text-white/70 font-light pt-2 border-t border-emerald-500/20 leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* LIMITATIONS COLUMN */}
            <div className="space-y-4">
              <h3 className="font-bebas text-2xl tracking-wider text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" /> MODEL LIMITATIONS
              </h3>

              {[
                { title: "GFRB Component Selection", icon: "🧺", desc: "Choice of 1 MWh energy, 1000 kcal food, 1 kg steel, 1 hr labor is a model choice requiring empirical validation." },
                { title: "Data Quality Variations", icon: "📉", desc: "Different countries have varying levels of price coverage, update frequency, and data reliability." },
                { title: "Retail Margins Hard to Observe", icon: "🏪", desc: "Actual distributor margins are not publicly reported and vary by brand and channel." },
                { title: "Logistics Simplification", icon: "🚚", desc: "A single LOG factor cannot capture every granular real-world supply chain condition." },
                { title: "Product Heterogeneity", icon: "📦", desc: "Products in the same category differ in brand prestige, warranty, and quality." },
                { title: "Aggregate PPP/CPI Limitations", icon: "🌐", desc: "Country-level aggregate metrics do not perfectly match specific individual retail items." },
                { title: "Model Parameter Calibration", icon: "⚙️", desc: "Parameters like 0.5 exponent or 0.15 EWMA weights require empirical tuning." },
                { title: "Experimental Status", icon: "🧪", desc: "GP is an experimental pricing framework, not an established replacement for official PPP measures." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setExpandedLim(expandedLim === idx ? null : idx)}
                  className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 font-semibold text-sm text-white">
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    {expandedLim === idx ? <ChevronUp className="w-4 h-4 text-red-400" /> : <ChevronDown className="w-4 h-4 text-red-400" />}
                  </div>
                  {expandedLim === idx && (
                    <p className="text-xs text-white/70 font-light pt-2 border-t border-red-500/20 leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 6 — COMPLETE SYSTEM ARCHITECTURE DIAGRAM
        ───────────────────────────────────────────────────────────── */}
        <section id="system-flow" className="scroll-mt-36 space-y-8">
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">COMPLETE SYSTEM ARCHITECTURE</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              06 — END-TO-END GP ENGINE FLOW
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 text-center">
            <div className="max-w-4xl mx-auto space-y-4 font-mono text-xs">
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-sm mx-auto">
                <span className="text-amber-400 font-bold block">1. USER INPUT</span>
                <span className="text-white/60 text-[11px]">Product + Country + Local Price P(p,c)</span>
              </div>

              <ArrowDown className="w-5 h-5 text-amber-400 mx-auto animate-bounce" />

              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 max-w-sm mx-auto">
                <span className="text-sky-300 font-bold block">2. DATA LAYER</span>
                <span className="text-white/60 text-[11px]">Exchange (E_c), PPP_c, CPI_c, GDP_c, Tax, Duty</span>
              </div>

              <ArrowDown className="w-5 h-5 text-amber-400 mx-auto animate-bounce" />

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 max-w-sm mx-auto">
                <span className="text-purple-300 font-bold block">3. GFRB & FRICTION ADJUSTMENT</span>
                <span className="text-white/60 text-[11px]">Calculate V_c & Regional Factor θ(p,c)</span>
              </div>

              <ArrowDown className="w-5 h-5 text-amber-400 mx-auto animate-bounce" />

              <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/50 max-w-sm mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <span className="text-amber-300 font-bold block text-sm">4. FORWARD ENGINE (GP_p)</span>
                <span className="text-amber-100 text-[11px]">Clean → Normalize PPNP → Aggregate W_c → EWMA Smooth</span>
              </div>

              <ArrowDown className="w-5 h-5 text-amber-400 mx-auto animate-bounce" />

              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 max-w-lg mx-auto">
                <span className="text-emerald-300 font-bold block">5. REVERSE ENGINE → PREDICTED LOCAL PRICES</span>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                  <div className="p-2 bg-white/5 rounded">🇮🇳 India (₹ Price)</div>
                  <div className="p-2 bg-white/5 rounded">🇺🇸 USA ($ Price)</div>
                  <div className="p-2 bg-white/5 rounded">🇩🇪 Germany (€ Price)</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 7 — PRESENTATION CHEAT SHEET (30-SECOND PITCH)
        ───────────────────────────────────────────────────────────── */}
        <section id="cheat-sheet" className="scroll-mt-36 space-y-8">
          <div className="border-l-4 border-amber-500 pl-4 space-y-2">
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-semibold">SUMMARY CHEAT SHEET</span>
            <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest text-white uppercase">
              07 — 30-SECOND EXPLANATION
            </h2>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-r from-black via-amber-500/10 to-black border-2 border-amber-500/40 space-y-6 text-center">
            <p className="font-geist text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl mx-auto font-light">
              “GP starts with a physical basket of energy, food, steel and labor. Country-specific prices are adjusted for selected local market frictions, normalized against the basket, and corrected using PPP and CPI factors. Multiple countries are combined using weighted GDP & data quality scores, and EWMA smoothing produces the final GP value. The same GP value can then be converted back into estimated local market prices for any target country.”
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 font-bebas text-lg sm:text-xl text-amber-300 pt-4 border-t border-white/10">
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">REAL-WORLD PRICES</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">NORMALIZE (GFRB)</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
              <span className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-white font-bold">GP UNIT</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">CONVERT REVERSE</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">PREDICTED PRICES</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default GPExplanation;
