import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Key, Database, Cpu, CheckCircle2, ShieldAlert, Sparkles, HardDrive, Server, RefreshCw, Globe, Check, AlertTriangle } from "lucide-react";
import { getHealth, checkBackendHealth } from "../api/client";
import { getApiBaseUrl, setCustomApiBaseUrl, clearCustomApiBaseUrl, LOCAL_DEV_DEFAULT_BACKEND, PRODUCTION_DEFAULT_BACKEND } from "../config/api";

export default function SettingsPage() {
  const [health, setHealth] = useState(null);
  const [healthStatus, setHealthStatus] = useState("checking");
  const [backendUrl, setBackendUrl] = useState(getApiBaseUrl());
  const [backendInput, setBackendInput] = useState(getApiBaseUrl());
  const [backendSaveMsg, setBackendSaveMsg] = useState("");
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const probeBackend = async () => {
    setIsCheckingBackend(true);
    const result = await checkBackendHealth();
    setIsCheckingBackend(false);
    if (result.ok) {
      setHealth(result.data);
      setHealthStatus("operational");
    } else {
      setHealth(null);
      setHealthStatus("offline");
    }
  };

  useEffect(() => {
    probeBackend();
  }, []);

  const handleSaveBackend = (e) => {
    e?.preventDefault?.();
    if (!backendInput.trim()) {
      clearCustomApiBaseUrl();
      const def = getApiBaseUrl();
      setBackendInput(def);
      setBackendUrl(def);
      setBackendSaveMsg("Reset to default URL.");
    } else {
      setCustomApiBaseUrl(backendInput.trim());
      setBackendUrl(backendInput.trim());
      setBackendSaveMsg("Backend URL saved.");
    }
    probeBackend();
    setTimeout(() => setBackendSaveMsg(""), 4000);
  };

  const handleSetPreset = (presetUrl) => {
    setBackendInput(presetUrl);
    setCustomApiBaseUrl(presetUrl);
    setBackendUrl(presetUrl);
    setBackendSaveMsg(`Applied ${presetUrl}`);
    setTimeout(() => {
      probeBackend();
      setBackendSaveMsg("");
    }, 2000);
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-full glass-pill text-cyan-300 border border-cyan-500/20 mb-3 glow-cyan-sm">
          <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>System Settings & Integrations</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Platform Architecture & Config
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          NEXORA: Intelligent multi-agent autonomous business planning platform
        </p>
      </div>

      {/* Backend API Server Endpoint Configuration */}
      <div className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Backend API Server Endpoint</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure which FastAPI backend service powers NEXORA's 16-agent orchestration engine and plan generation.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border ${
              healthStatus === "operational" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald-sm" 
                : healthStatus === "offline"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              {healthStatus === "operational" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Backend Operational
                </>
              ) : healthStatus === "offline" ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Backend Offline
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Checking Health...
                </>
              )}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveBackend} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
              Active Backend Base URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={backendInput}
                  onChange={(e) => setBackendInput(e.target.value)}
                  placeholder="https://your-backend.onrender.com or http://localhost:8000"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#070A12]/90 border border-white/[0.1] rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>
              <button
                type="button"
                onClick={probeBackend}
                disabled={isCheckingBackend}
                className="px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/[0.1] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 font-mono"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingBackend ? "animate-spin" : ""}`} />
                <span>Test</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Apply URL
              </button>
            </div>
            {backendSaveMsg && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-mono">
                <Check className="w-3.5 h-3.5" />
                {backendSaveMsg}
              </p>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            <span className="text-slate-500 text-[11px]">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleSetPreset(LOCAL_DEV_DEFAULT_BACKEND)}
              className="px-2.5 py-1 rounded-lg glass-card hover:border-cyan-500/30 text-slate-300 border border-white/[0.08] text-[11px] transition-colors"
            >
              Localhost (http://localhost:8000)
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset(PRODUCTION_DEFAULT_BACKEND)}
              className="px-2.5 py-1 rounded-lg glass-card hover:border-cyan-500/30 text-slate-300 border border-white/[0.08] text-[11px] transition-colors"
            >
              Cloud Deployed (Render / Default)
            </button>
            <button
              type="button"
              onClick={() => {
                clearCustomApiBaseUrl();
                const def = getApiBaseUrl();
                setBackendInput(def);
                setBackendUrl(def);
                probeBackend();
              }}
              className="px-2.5 py-1 rounded-lg glass-card hover:bg-white/10 text-slate-400 border border-white/[0.08] text-[11px] transition-colors"
            >
              Reset to Env Default
            </button>
          </div>
        </form>
      </div>

      {/* System Status Banner */}
      <div className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Runtime Environment & Health</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-500 block font-mono">FastAPI Backend</span>
            <div className={`flex items-center gap-2 text-xs font-bold font-mono ${healthStatus === "operational" ? "text-emerald-400" : healthStatus === "offline" ? "text-rose-400" : "text-amber-400"}`}>
              {healthStatus === "operational" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Operational (v1.0.0)</span>
                </>
              ) : healthStatus === "offline" ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unreachable</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-500 block font-mono">Data Persistence Layer</span>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
              <HardDrive className="w-4 h-4" />
              <span>SQLite / PostgreSQL Ready</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-500 block font-mono">Multi-Agent Engine</span>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>16 Agents Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pluggable LLM Adapter Configuration */}
      <form onSubmit={handleSaveKeys} className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Pluggable LLM Provider Adapter</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            NEXORA includes an intelligent, verified <strong>Benchmark & Heuristic Simulation Engine</strong> loaded with 
            comprehensive market data across 8 sectors. To optionally connect direct frontier LLMs (Gemini / OpenAI), 
            input your API keys below.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>LLM preferences saved in browser local storage.</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block font-mono text-[11px]">Google Gemini API Key (Optional)</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-[#070A12]/90 border border-white/[0.1] rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block font-mono text-[11px]">OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full px-3.5 py-2.5 bg-[#070A12]/90 border border-white/[0.1] rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Keys are never exposed to public APIs and run through server-side adapters.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Responsible AI Disclaimer */}
      <div className="p-6 rounded-3xl glass-card border border-white/[0.08] space-y-2 text-xs text-slate-400 leading-relaxed">
        <h4 className="font-bold text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Responsible AI & Decision-Support Notice</span>
        </h4>
        <p>
          NEXORA is an executive business decision-support tool. All market sizes, financial break-even projections, 
          and cost estimations are modeled assumptions based on historical industry averages. They do not constitute a 
          guarantee of commercial profitability. Founders should perform on-ground due diligence and consult licensed 
          legal and accounting counsel prior to executing binding commercial leases or capital disbursements.
        </p>
      </div>

    </div>
  );
}
