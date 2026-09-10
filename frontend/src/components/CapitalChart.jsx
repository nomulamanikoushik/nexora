import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, Sparkles } from "lucide-react";

export default function CapitalChart({ chartData = [], totalCapital = 1000000, currency = "INR" }) {
  const COLORS = [
    "#06B6D4", // Cyan - Setup
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
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
            Capital Allocation Breakdown
          </h3>
          <p className="text-xs text-gray-400">
            Total Starting Capital: <span className="text-cyan-400 font-mono font-semibold">{currency} {Number(totalCapital).toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400">
          <Shield className="w-4 h-4 text-emerald-400" />
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
                contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#374151", borderRadius: "10px", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Hole Display */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
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
              className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></span>
                <span className="text-gray-300 font-medium truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-gray-400 font-mono text-[11px]">{item.percentage}%</span>
                <span className="text-gray-100 font-mono font-semibold">{currency} {Number(item.amount).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
