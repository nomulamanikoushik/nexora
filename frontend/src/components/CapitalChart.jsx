import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, Sparkles, Coins } from "lucide-react";

export default function CapitalChart({ chartData = [], totalCapital = 1000000, currency = "INR" }) {
  const COLORS = [
    "#00F0FF", // Electric Cyan - Setup
    "#3B82F6", // Blue - Equipment
    "#6366F1", // Indigo - Inventory
    "#8B5CF6", // Purple - Staffing
    "#EC4899", // Pink - Marketing
    "#F59E0B", // Amber - Tech
    "#10B981", // Emerald - Working Capital
    "#14B8A6"  // Teal - Contingency
  ];

  // Calculate liquid safety buffer (Working Capital + Contingency)
  const safetyBufferItem = chartData.filter(d => 
    d.category.toLowerCase().includes("working capital") || 
    d.category.toLowerCase().includes("contingency")
  );
  const safetyBufferSum = safetyBufferItem.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const safetyPercentage = totalCapital > 0 ? ((safetyBufferSum / totalCapital) * 100).toFixed(1) : 0;

  return (
    <div className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>Capital Allocation Breakdown</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total Starting Capital: <span className="text-cyan-400 font-mono font-semibold">{currency} {Number(totalCapital).toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safety Buffer: <strong>{safetyPercentage}%</strong> ({currency} {Number(safetyBufferSum).toLocaleString()})</span>
        </div>
      </div>

      {/* Chart & Legend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Donut Chart */}
        <div className="lg:col-span-6 h-64 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${currency} ${Number(value).toLocaleString()}`, "Amount"]}
                contentStyle={{ backgroundColor: "#070A12", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Hole Display */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Total</span>
            <span className="text-sm font-extrabold text-white font-mono">
              {currency} {(totalCapital / 100000).toFixed(1)}L
            </span>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-6 space-y-2 max-h-64 overflow-y-auto pr-1">
          {chartData.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between text-xs p-2.5 rounded-xl glass-card border border-white/[0.06] hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-300 font-medium truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono">
                <span className="text-slate-400 text-[11px]">{item.percentage}%</span>
                <span className="text-white font-semibold">{currency} {Number(item.amount).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
