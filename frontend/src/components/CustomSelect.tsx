// src/components/CustomSelect.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  id: string;
  name: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative w-full" ref={containerRef}>
      {label && (
        <label className="font-geist text-xs text-white/50 tracking-[0.2em] uppercase font-medium">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 h-12 rounded-xl bg-black border border-white/8 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] outline-none text-left font-geist transition-all text-sm text-white/90 cursor-pointer"
      >
        <span className={selectedOption ? "text-white/90" : "text-white/30"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[72px] inset-x-0 z-50 rounded-xl p-2 max-h-60 overflow-y-auto flex flex-col bg-[#0a0805] border border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-geist transition-colors cursor-pointer ${
                value === opt.id
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
