import React, { useEffect, useState } from "react";
import { FolderOpen, ArrowRight, MapPin, Coins, Award, Clock, RotateCw, Sparkles } from "lucide-react";
import { listPlans, getPlan } from "../api/client";

export default function SavedPlansPage({ onSelectPlan, setActivePage }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await listPlans();
        setPlans(data);
      } catch (e) {
        console.error("Failed to load plans:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleOpenPlan = async (planId) => {
    try {
      const fullPlan = await getPlan(planId);
      onSelectPlan(fullPlan);
      setActivePage("dashboard");
    } catch (e) {
      console.error("Failed to load full plan:", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-full glass-pill text-cyan-300 border border-cyan-500/20 mb-3 glow-cyan-sm">
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Plan Repository</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saved Business Launch Strategies
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access previous multi-agent simulations and compare feasibility score histories.
          </p>
        </div>

        <button
          onClick={() => setActivePage("onboarding")}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 self-start sm:self-auto transition-all"
        >
          Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs flex items-center justify-center gap-2 font-mono">
          <span className="w-4 h-4 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <span>Loading plans from database...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="glass-panel border border-white/[0.08] rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-14 h-14 rounded-2xl glass-card border border-white/[0.08] flex items-center justify-center mx-auto text-cyan-400 glow-cyan-sm">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Plans Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            You haven't generated any multi-agent business plans yet. Start with our featured Hyderabad demo!
          </p>
          <button
            onClick={() => setActivePage("onboarding")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            Launch First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl glass-panel-interactive border border-white/[0.08] flex flex-col justify-between space-y-5 group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {p.sector ? p.sector.replace(/-/g, " ").toUpperCase() : "GENERAL"}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{p.feasibility_score} / 100</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {p.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1 font-mono">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-200 font-semibold">{p.currency} {Number(p.capital).toLocaleString()}</span>
                  </div>
                  {p.revision_count > 0 && (
                    <div className="flex items-center gap-2 text-amber-400 text-[11px]">
                      <RotateCw className="w-3 h-3" />
                      <span>Revised x{p.revision_count} (Critic Loop)</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleOpenPlan(p.id)}
                className="w-full py-2.5 rounded-xl bg-[#070A12]/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-white/[0.08] hover:border-cyan-400 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>Open Executive Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
