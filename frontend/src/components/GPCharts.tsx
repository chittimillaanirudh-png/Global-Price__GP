// src/components/GPCharts.tsx
import React, { useState } from "react";
import { motion } from "motion/react";
import { CountryPrediction, ExchangeRates, CountryData } from "../types";
import { BarChart, AreaChart, TrendingUp, DollarSign, Globe, Award } from "lucide-react";

interface GPChartsProps {
  predictions: CountryPrediction[];
  rates: ExchangeRates;
  homeCountry?: CountryData;
}

export const GPCharts: React.FC<GPChartsProps> = ({ predictions, rates, homeCountry }) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  // Helper to convert localized price to USD
  const getUSDVal = (pred: CountryPrediction) => {
    const rate = rates[pred.country.currency] ?? pred.country.ppp_fallback;
    return pred.predicted_price / (rate || 1);
  };

  // --- CHART 1: REGIONAL REPRESENTATIVES (BAR CHART) ---
  const representativeCodes = ["US", "DE", "JP", "IN", "BR", "GB", "AU", "ZA"];
  const barData = representativeCodes
    .map(code => predictions.find(p => p.country.code === code))
    .filter((p): p is CountryPrediction => !!p)
    .map(p => ({
      name: p.country.name,
      code: p.country.code,
      flag: p.country.flag,
      symbol: p.country.symbol,
      localPrice: p.predicted_price,
      currency: p.country.currency,
      usdPrice: getUSDVal(p),
    }));

  const maxUSDPrice = barData.length > 0 ? Math.max(...barData.map(d => d.usdPrice)) : 100;

  // --- CHART 2: GLOBAL VALUE DISTRIBUTION (CURVE AREA CHART) ---
  // Sort all countries by USD price to find distribution
  const sortedPredictions = [...predictions]
    .map(p => ({
      country: p.country,
      usdPrice: getUSDVal(p),
      localPrice: p.predicted_price
    }))
    .sort((a, b) => a.usdPrice - b.usdPrice);

  // Sample 10 countries across the distribution curve (0%, 11%, 22%, ..., 100%)
  const sampleCount = 9;
  const areaData = Array.from({ length: sampleCount }).map((_, i) => {
    const index = Math.min(
      Math.floor((i / (sampleCount - 1)) * (sortedPredictions.length - 1)),
      sortedPredictions.length - 1
    );
    return sortedPredictions[index];
  });

  const areaMaxUSD = areaData.length > 0 ? Math.max(...areaData.map(d => d.usdPrice)) : 100;
  const areaMinUSD = areaData.length > 0 ? Math.min(...areaData.map(d => d.usdPrice)) : 0;

  // Generate SVG path coordinates for Area Chart
  const svgWidth = 500;
  const svgHeight = 160;
  const padding = 20;
  const chartW = svgWidth - padding * 2;
  const chartH = svgHeight - padding * 2;

  const points = areaData.map((d, i) => {
    const x = padding + (i / (sampleCount - 1)) * chartW;
    // Scale y from min to max USD
    const range = areaMaxUSD - areaMinUSD || 1;
    const y = padding + chartH - ((d.usdPrice - areaMinUSD) / range) * chartH;
    return { x, y, data: d };
  });

  // SVG Line path string
  let linePath = "";
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Create a smooth cubic curve between points
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
  }

  // SVG Area path string (goes down to bottom to fill the gradient)
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
    : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      
      {/* CARD 1: REGIONAL PRICE BAR CHART */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-amber-400" />
              <h4 className="font-bebas text-sm tracking-widest text-white uppercase">Regional Index Comparison</h4>
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">USD Equivalents</span>
          </div>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed mb-6">
            Visualizes predicted local consumer retail costs mapped into a normalized currency base ($ USD).
          </p>
        </div>

        {/* Bar Layout */}
        <div className="h-44 flex items-end justify-between gap-1 pt-6 border-b border-white/5 pb-2 relative">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-x-0 top-1/4 border-t border-white/5 pointer-events-none" />
          <div className="absolute inset-x-0 top-2/4 border-t border-white/5 pointer-events-none" />
          <div className="absolute inset-x-0 top-3/4 border-t border-white/5 pointer-events-none" />

          {barData.map((d) => {
            const pct = (d.usdPrice / maxUSDPrice) * 100;
            const isHovered = hoveredBar === d.code;

            return (
              <div 
                key={d.code} 
                className="flex flex-col items-center flex-1 group cursor-pointer relative"
                onMouseEnter={() => setHoveredBar(d.code)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Floating Tooltip value */}
                <div className={`absolute -top-10 bg-[#0f0c05] border border-amber-500/20 text-white rounded px-2 py-1 text-[10px] font-mono pointer-events-none transition-all duration-200 z-30 shadow-xl whitespace-nowrap ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}>
                  <span className="text-amber-400 font-bold">${d.usdPrice.toLocaleString(undefined, {maximumFractionDigits: 1})}</span>
                  <span className="text-white/45 ml-1">USD</span>
                </div>

                {/* Animated Column Bar */}
                <div className="w-full max-w-[28px] bg-white/5 rounded-t-md overflow-hidden h-32 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`w-full rounded-t-md bg-gradient-to-t transition-all ${
                      isHovered 
                        ? "from-amber-600 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                        : "from-amber-600/35 to-amber-500/50"
                    }`}
                  />
                </div>

                {/* X Axis Label */}
                <div className="mt-2 text-center">
                  <span className="text-sm block leading-none filter grayscale group-hover:grayscale-0 transition-all">{d.flag}</span>
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-1 block">
                    {d.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/30 uppercase mt-4">
          <span>Lower Retail Markup</span>
          <span>Higher Retail Friction</span>
        </div>
      </div>

      {/* CARD 2: PRICE DISTRIBUTION AREA CURVE */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <h4 className="font-bebas text-sm tracking-widest text-white uppercase">Worldwide Pricing Curve</h4>
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">195 Countries</span>
          </div>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed mb-4">
            Shows the steep global consumer price graduation curve as products cross markets with differing friction.
          </p>
        </div>

        {/* SVG Curve area */}
        <div className="relative pt-2">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[20px] pt-[20px] px-5">
            <div className="border-b border-white/5 w-full h-px" />
            <div className="border-b border-white/5 w-full h-px" />
            <div className="border-b border-white/5 w-full h-px" />
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible z-10 relative">
            <defs>
              {/* Gold gradient for filled area */}
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled Area */}
            {areaPath && (
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                d={areaPath}
                fill="url(#area-gradient)"
              />
            )}

            {/* Glow Path Line */}
            {linePath && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d={linePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.75"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
              />
            )}

            {/* Interactive Data Dots */}
            {points.map((pt, i) => {
              const isHovered = hoveredDot === i;
              return (
                <g key={i} className="cursor-pointer">
                  {/* Glowing hover circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 8 : 4}
                    className="fill-amber-500 stroke-black stroke-2 transition-all duration-200"
                    onMouseEnter={() => setHoveredDot(i)}
                    onMouseLeave={() => setHoveredDot(null)}
                  />
                  {/* Invisible oversized catch handle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="15"
                    className="fill-transparent stroke-none"
                    onMouseEnter={() => setHoveredDot(i)}
                    onMouseLeave={() => setHoveredDot(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* X Axis Labels under SVG */}
          <div className="flex justify-between px-[16px] text-[7.5px] font-mono text-white/40 tracking-wider uppercase mt-1">
            <span>Cheapest: {areaData[0]?.country.code}</span>
            <span>Median: {areaData[Math.floor(sampleCount / 2)]?.country.code}</span>
            <span>Costliest: {areaData[sampleCount - 1]?.country.code}</span>
          </div>

          {/* Floating Tooltip Box for Dots */}
          {hoveredDot !== null && points[hoveredDot] && (
            <div 
              className="absolute bg-[#0f0c05] border border-amber-500/20 text-white rounded-lg p-2 text-[10px] font-sans shadow-2xl z-30 pointer-events-none transition-all"
              style={{
                left: `${(points[hoveredDot].x / svgWidth) * 100}%`,
                top: `${(points[hoveredDot].y / svgHeight) * 100 - 35}%`,
                transform: "translateX(-50%)"
              }}
            >
              <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                <span>{points[hoveredDot].data.country.flag}</span>
                <span>{points[hoveredDot].data.country.name}</span>
              </div>
              <div className="font-mono text-amber-400 text-[9px]">
                {points[hoveredDot].data.country.symbol}
                {points[hoveredDot].data.localPrice.toLocaleString(undefined, {maximumFractionDigits: 1})}
                <span className="text-white/40 ml-1">({points[hoveredDot].data.country.currency})</span>
              </div>
              <div className="font-mono text-white/50 text-[8px] mt-0.5">
                USD Eq: ${points[hoveredDot].data.usdPrice.toLocaleString(undefined, {maximumFractionDigits: 1})}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-500/85 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1.5 rounded-lg mt-5">
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span>
            Global Price gap: Cheapest is <strong className="text-white">${areaMinUSD.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong> USD vs Costliest is <strong className="text-white">${areaMaxUSD.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong> USD.
          </span>
        </div>
      </div>

    </div>
  );
};
export default GPCharts;
