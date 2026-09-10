import React from "react";
import { Sparkles, Cpu, Layers, Sliders, FolderOpen, ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar({ activePage, setActivePage, activePlan }) {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActivePage("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                NEXORA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Multi-Agent
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              From Capital to Business.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1 rounded-xl border border-gray-800/80">
          <button
            onClick={() => setActivePage("landing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePage === "landing" 
                ? "bg-cyan-500/10 text-cyan-400 shadow-sm border border-cyan-500/20" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActivePage("onboarding")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePage === "onboarding" 
                ? "bg-cyan-500/10 text-cyan-400 shadow-sm border border-cyan-500/20" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            New Plan
          </button>
          
          {activePlan && (
            <>
              <button
                onClick={() => setActivePage("workspace")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activePage === "workspace" 
                    ? "bg-indigo-500/15 text-indigo-300 shadow-sm border border-indigo-500/30" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Agent Workspace
              </button>
              <button
                onClick={() => setActivePage("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePage === "dashboard" 
                    ? "bg-cyan-500/10 text-cyan-400 shadow-sm border border-cyan-500/20" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActivePage("plan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePage === "plan" 
                    ? "bg-cyan-500/10 text-cyan-400 shadow-sm border border-cyan-500/20" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                Full Plan
              </button>
              <button
                onClick={() => setActivePage("first_customers")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePage === "first_customers" 
                    ? "bg-emerald-500/15 text-emerald-300 shadow-sm border border-emerald-500/30 font-bold" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                First Customers
              </button>
              <button
                onClick={() => setActivePage("growth")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePage === "growth" 
                    ? "bg-violet-500/15 text-violet-300 shadow-sm border border-violet-500/30 font-bold" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                Growth
              </button>
              <button
                onClick={() => setActivePage("whatif")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activePage === "whatif" 
                    ? "bg-amber-500/15 text-amber-400 shadow-sm border border-amber-500/30" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                What-If?
              </button>
            </>
          )}

          <button
            onClick={() => setActivePage("locations")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activePage === "locations" 
                ? "bg-indigo-500/15 text-indigo-300 shadow-sm border border-indigo-500/30 font-bold" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            Location Compare
          </button>

          <button
            onClick={() => setActivePage("saved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activePage === "saved" 
                ? "bg-cyan-500/10 text-cyan-400 shadow-sm border border-cyan-500/20" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Saved Plans
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            13 Agents Ready
          </div>
          <button
            onClick={() => setActivePage("onboarding")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Startup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
