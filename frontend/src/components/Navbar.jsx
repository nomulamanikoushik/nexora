import React, { useState } from "react";
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Sliders, 
  FolderOpen, 
  ArrowRight, 
  ShieldCheck, 
  Settings, 
  Menu, 
  X, 
  Compass,
  Zap,
  Activity
} from "lucide-react";

export default function Navbar({ activePage, setActivePage, activePlan }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.08] backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Telemetry */}
        <div 
          onClick={() => navigate("landing")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all duration-300">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#070A12] animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans'] group-hover:text-cyan-300 transition-colors">
                NEXORA
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium tracking-wide hidden sm:block">
              Multi-Agent Autonomous Planning
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06] backdrop-blur-md">
          <button
            onClick={() => navigate("landing")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activePage === "landing" 
                ? "bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30" 
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => navigate("onboarding")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activePage === "onboarding" 
                ? "bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30" 
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Create Plan</span>
          </button>
          
          {activePlan && (
            <>
              <button
                onClick={() => navigate("workspace")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activePage === "workspace" 
                    ? "bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/40 font-bold" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>

              <button
                onClick={() => navigate("dashboard")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activePage === "dashboard" 
                    ? "bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30 font-bold" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("plan")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activePage === "plan" 
                    ? "bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30 font-bold" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                Full Plan
              </button>
            </>
          )}

          <button
            onClick={() => navigate("locations")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activePage === "locations" 
                ? "bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/30 font-bold" 
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Locations</span>
          </button>

          <button
            onClick={() => navigate("saved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activePage === "saved" 
                ? "bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30" 
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Saved</span>
          </button>
        </nav>

        {/* Right Telemetry & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>16 Agents Active</span>
          </div>

          <button
            onClick={() => navigate("settings")}
            title="System Settings & API Config"
            className={`p-2 rounded-xl text-xs transition-all border ${
              activePage === "settings"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                : "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border-white/[0.06]"
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate("onboarding")}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0A0E1A]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => navigate("landing")}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/[0.06]"
          >
            Overview
          </button>
          <button
            onClick={() => navigate("onboarding")}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-between"
          >
            <span>Create New Plan</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          {activePlan && (
            <>
              <button
                onClick={() => navigate("workspace")}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-500/10 flex items-center justify-between"
              >
                <span>Agent Workspace (16 Agents)</span>
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate("dashboard")}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/[0.06]"
              >
                Executive Dashboard
              </button>
              <button
                onClick={() => navigate("plan")}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/[0.06]"
              >
                Full Business Plan
              </button>
            </>
          )}
          <button
            onClick={() => navigate("locations")}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/[0.06]"
          >
            Location Comparison
          </button>
          <button
            onClick={() => navigate("saved")}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/[0.06]"
          >
            Saved Plans
          </button>
          <button
            onClick={() => navigate("settings")}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/[0.06] flex items-center justify-between"
          >
            <span>Platform Settings</span>
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
}
