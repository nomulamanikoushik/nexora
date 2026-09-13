import React, { useState } from "react";
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Award, AlertCircle } from "lucide-react";

export default function RevenueChart({ scenarios, monthlyProjections = [], currency = "INR" }) {
  const [activeTab, setActiveTab] = useState("baseline");

  const baselineData = scenarios?.baseline || {};
  const conservativeData = scenarios?.conservative || {};
  const optimisticData = scenarios?.optimistic || {};

  return (
    <div className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>12-Month Financial Projections & Break-Even</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Conservative, Baseline, and Optimistic curves vs total monthly operating burn.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 glass-card p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab("conservative")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "conservative" 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Conservative
          </button>
          <button
            onClick={() => setActiveTab("baseline")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "baseline" 
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setActiveTab("optimistic")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "optimistic" 
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Optimistic
          </button>
        </div>
      </div>

      {/* Scenario Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3.5 rounded-2xl border transition-all ${activeTab === "conservative" ? "bg-amber-950/20 border-amber-500/40 glow-amber-sm" : "glass-card border-white/[0.06]"}`}>
          <div className="text-[11px] text-amber-400 uppercase font-mono font-semibold">Conservative</div>
          <div className="text-sm font-bold text-white font-mono mt-1">
            {currency} {Number(conservativeData.year1_revenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Break-even: Month {conservativeData.break_even_month || 9}</div>
        </div>

        <div className={`p-3.5 rounded-2xl border transition-all ${activeTab === "baseline" ? "bg-cyan-950/20 border-cyan-500/40 glow-cyan-sm" : "glass-card border-white/[0.06]"}`}>
          <div className="text-[11px] text-cyan-400 uppercase font-mono font-semibold">Baseline Target</div>
          <div className="text-sm font-bold text-white font-mono mt-1">
            {currency} {Number(baselineData.year1_revenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Break-even: Month {baselineData.break_even_month || 6}</div>
        </div>

        <div className={`p-3.5 rounded-2xl border transition-all ${activeTab === "optimistic" ? "bg-emerald-950/20 border-emerald-500/40 glow-emerald-sm" : "glass-card border-white/[0.06]"}`}>
          <div className="text-[11px] text-emerald-400 uppercase font-mono font-semibold">Optimistic Scale</div>
          <div className="text-sm font-bold text-white font-mono mt-1">
            {currency} {Number(optimisticData.year1_revenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Break-even: Month {optimisticData.break_even_month || 4}</div>
        </div>
      </div>

      {/* Trajectory Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyProjections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip 
              formatter={(value) => [`${currency} ${Number(value).toLocaleString()}`]}
              contentStyle={{ backgroundColor: "#070A12", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}
            />
            
            {activeTab === "baseline" && (
              <Area type="monotone" dataKey="revenue" stroke="#00F0FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBaseline)" name="Revenue (Baseline)" />
            )}
            {activeTab === "conservative" && (
              <Area type="monotone" dataKey="conservative_revenue" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConservative)" name="Revenue (Conservative)" />
            )}
            {activeTab === "optimistic" && (
              <Area type="monotone" dataKey="optimistic_revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOptimistic)" name="Revenue (Optimistic)" />
            )}

            <Line type="monotone" dataKey="cost" stroke="#F43F5E" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Monthly Cost Burn" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
