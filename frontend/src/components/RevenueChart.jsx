import React, { useState } from "react";
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Award, AlertCircle } from "lucide-react";

export default function RevenueChart({ scenarios, monthlyProjections = [], currency = "INR" }) {
  const [activeTab, setActiveTab] = useState("baseline");

  const baselineData = scenarios?.baseline || {};
  const conservativeData = scenarios?.conservative || {};
  const optimisticData = scenarios?.optimistic || {};

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            12-Month Financial Projections & Break-Even
          </h3>
          <p className="text-xs text-gray-400">
            Conservative, Baseline, and Optimistic curves vs total monthly operating burn.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("conservative")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "conservative" 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Conservative
          </button>
          <button
            onClick={() => setActiveTab("baseline")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "baseline" 
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Baseline (Target)
          </button>
          <button
            onClick={() => setActiveTab("optimistic")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "optimistic" 
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Optimistic
          </button>
        </div>
      </div>

      {/* Scenario Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3 rounded-xl border transition-all ${activeTab === "conservative" ? "bg-amber-950/20 border-amber-500/40" : "bg-gray-900/60 border-gray-800"}`}>
          <div className="text-[11px] text-amber-400 uppercase font-semibold">Conservative</div>
          <div className="text-sm font-bold text-white font-mono mt-0.5">
            {currency} {Number(conservativeData.year1_revenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Break-even: Month {conservativeData.break_even_month || 9}</div>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${activeTab === "baseline" ? "bg-cyan-950/20 border-cyan-500/40" : "bg-gray-900/60 border-gray-800"}`}>
          <div className="text-[11px] text-cyan-400 uppercase font-semibold">Baseline Target</div>
          <div className="text-sm font-bold text-white font-mono mt-0.5">
            {currency} {Number(baselineData.year1_revenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Break-even: Month {baselineData.break_even_month || 6}</div>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${activeTab === "optimistic" ? "bg-emerald-950/20 border-emerald-500/40" : "bg-gray-900/60 border-gray-800"}`}>
          <div className="text-[11px] text-emerald-400 uppercase font-semibold">Optimistic Scale</div>
          <div className="text-sm font-bold text-white font-mono mt-0.5">
            {currency} {Number(optimisticData.year1_revenue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Break-even: Month {optimisticData.break_even_month || 4}</div>
        </div>
      </div>

      {/* Trajectory Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyProjections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 11 }} />
            <YAxis 
              stroke="#6B7280" 
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} 
            />
            <Tooltip 
              formatter={(value, name) => [`${currency} ${Number(value).toLocaleString()}`, name.replace(/_/g, " ").toUpperCase()]}
              contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#374151", borderRadius: "10px", fontSize: "12px" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            
            {/* Cost Line */}
            <Line 
              type="monotone" 
              dataKey="projected_total_cost" 
              name="Monthly Burn & Opex" 
              stroke="#F43F5E" 
              strokeWidth={2} 
              dot={false}
              strokeDasharray="4 4"
            />
            
            {/* Revenue Curves */}
            <Area 
              type="monotone" 
              dataKey="conservative_revenue" 
              name="Conservative Rev" 
              stroke="#F59E0B" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorConservative)" 
            />
            <Area 
              type="monotone" 
              dataKey="baseline_revenue" 
              name="Baseline Rev (Target)" 
              stroke="#06B6D4" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorBaseline)" 
            />
            <Line 
              type="monotone" 
              dataKey="optimistic_revenue" 
              name="Optimistic Rev" 
              stroke="#10B981" 
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
