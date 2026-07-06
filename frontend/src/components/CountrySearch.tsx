// src/components/CountrySearch.tsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CountryData } from "../types";
import { COUNTRIES } from "../data/countries";

interface CountrySearchProps {
  label: string;
  selected: CountryData | undefined;
  onSelect: (country: CountryData) => void;
  placeholder?: string;
  className?: string;
}

export const CountrySearch: React.FC<CountrySearchProps> = ({
  label,
  selected,
  onSelect,
  placeholder = "Search country...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter countries
  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.currency.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Reset active index when filter changes
    setActiveIndex(0);
  }, [search]);

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        onSelect(filtered[activeIndex]);
        setIsOpen(false);
        setSearch("");
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && activeIndex >= 0) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        const listHeight = listRef.current.clientHeight;
        const elemTop = activeEl.offsetTop;
        const elemHeight = activeEl.clientHeight;

        if (elemTop + elemHeight > listRef.current.scrollTop + listHeight) {
          listRef.current.scrollTop = elemTop + elemHeight - listHeight;
        } else if (elemTop < listRef.current.scrollTop) {
          listRef.current.scrollTop = elemTop;
        }
      }
    }
  }, [activeIndex, isOpen]);

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-2 ${className}`}>
      <label className="font-geist text-xs text-white/50 tracking-[0.2em] uppercase font-medium">{label}</label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 h-12 rounded-xl bg-white/3 border border-white/8 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] outline-none text-left font-geist transition-all text-sm text-white/90 cursor-pointer"
      >
        {selected ? (
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{selected.flag}</span>
            <span className="font-medium text-white">{selected.name}</span>
            <span className="text-xs text-white/40">({selected.currency} · {selected.symbol})</span>
          </div>
        ) : (
          <span className="text-white/30">{placeholder}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[82px] inset-x-0 z-50 rounded-xl p-2 max-h-72 overflow-hidden flex flex-col bg-[#0a0805] border border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
          {/* Search Input */}
          <div className="relative flex items-center mb-2 shrink-0">
            <Search className="absolute left-3 w-4 h-4 text-white/30" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to filter..."
              className="w-full pl-9 pr-4 h-10 bg-white/5 border border-white/5 rounded-lg text-sm text-white/95 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* List items */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto pr-1 space-y-0.5"
          >
            {filtered.length > 0 ? (
              filtered.map((country, index) => {
                const isActive = index === activeIndex;
                const isSelected = selected?.code === country.code;

                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between px-3 h-10 rounded-lg text-sm font-geist text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/10"
                        : isActive
                        ? "bg-white/8 text-white"
                        : "text-white/70 hover:bg-white/3 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{country.flag}</span>
                      <span className="font-medium truncate">{country.name}</span>
                    </div>
                    <span className="text-xs text-white/30 font-mono">
                      {country.currency} ({country.symbol})
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-6 font-geist text-xs text-white/30">
                No matching countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CountrySearch;
