"use client";

import React, { useContext } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { ThemeContext } from "./Providers";

export function ThemeToggle() {
  const { theme, setTheme, gradient, setGradient } = useContext(ThemeContext);

  const cycleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("multicolour");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="flex items-center space-x-2.5">
      {/* Theme Icon Button */}
      <button
        onClick={cycleTheme}
        className="p-2 h-[36px] w-[36px] rounded-xl border border-white/10 hover:border-current bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center relative group focus:outline-none shrink-0"
        title={`Theme: ${theme.toUpperCase()}. Click to switch.`}
      >
        <span className="sr-only">Toggle theme</span>
        
        {theme === "dark" && (
          <Moon className="w-4 h-4 text-blue-400" />
        )}
        {theme === "light" && (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
        {theme === "multicolour" && (
          <Sparkles className="w-4 h-4 text-pink-500" />
        )}

        {/* Tooltip */}
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-semibold text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          Theme: {theme}
        </span>
      </button>

      {/* Multicolour Gradient Selection Dropdown */}
      {theme === "multicolour" && (
        <select
          value={gradient}
          onChange={(e) => setGradient(e.target.value as any)}
          className="h-[36px] px-2 text-[11px] font-bold rounded-xl border border-pink-500/20 bg-slate-950/80 text-pink-400 backdrop-blur-md focus:outline-none cursor-pointer hover:border-pink-500/40 transition-all select-none"
          title="Choose Gradient Accent Scheme"
        >
          <option value="space" className="bg-slate-950 text-pink-400">🔮 Deep Space</option>
          <option value="aurora" className="bg-slate-950 text-cyan-400">🌌 Neon Aurora</option>
          <option value="sunset" className="bg-slate-950 text-amber-500">🌅 Sunset Glow</option>
          <option value="forest" className="bg-slate-950 text-emerald-400">🌲 Emerald Forest</option>
        </select>
      )}
    </div>
  );
}
