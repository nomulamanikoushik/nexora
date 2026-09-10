import React from "react";
import { ShieldCheck, HelpCircle, TrendingUp, AlertCircle } from "lucide-react";

export default function FeasibilityGauge({ score = 78, scoreBreakdown }) {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  
  // Color palette based on score
  let strokeColor = "#10B981"; // Emerald
  let textColor = "text-emerald-400";
  let bgGradient = "from-emerald-500/20 to-transparent";

  if (normalizedScore < 60) {
    strokeColor = "#F43F5E"; // Rose
    textColor = "text-rose-400";
    bgGradient = "from-rose-500/20 to-transparent";
  } else if (normalizedScore < 72) {
    strokeColor = "#F59E0B"; // Amber
    textColor = "text-amber-400";
    bgGradient = "from-amber-500/20 to-transparent";
  } else if (normalizedScore < 82) {
    strokeColor = "#06B6D4"; // Cyan
    textColor = "text-cyan-400";
    bgGradient = "from-cyan-500/20 to-transparent";
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const dimensions = [
    { label: "Capital Fit", val: scoreBreakdown?.capital_fit || 80, desc: "Runway & capex suitability" },
    { label: "Market Attractiveness", val: scoreBreakdown?.market_attractiveness || 84, desc: "Industry CAGR & TAM" },
    { label: "Customer Demand", val: scoreBreakdown?.customer_demand || 86, desc: "Target persona clarity" },
    { label: "Competitive Moat", val: scoreBreakdown?.competition_intensity || 75, desc: "Differentiation strength" },
    { label: "Location Fit", val: scoreBreakdown?.location_suitability || 88, desc: "Demographic & footfall density" },
    { label: "Financial Viability", val: scoreBreakdown?.financial_feasibility || 82, desc: "Break-even velocity" },
    { label: "Risk Resilience", val: scoreBreakdown?.risk_resilience || 79, desc: "Buffer vs cash volatility" },
    { label: "Business Model", val: scoreBreakdown?.business_model_strength || 85, desc: "Unit economics margin" }
  ];

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Background glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br ${bgGradient} rounded-full blur-3xl pointer-events-none`}></div>

      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
        
        {/* Circular Radial Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-gray-800/80"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Value Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-black font-['Plus_Jakarta_Sans'] ${textColor}`}>
                {normalizedScore}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">
                Out of 100
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-900 border border-gray-700/60 inline-flex items-center gap-1.5 ${textColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {scoreBreakdown?.rating_label || "High Feasibility"}
            </div>
          </div>
        </div>

        {/* 8 Dimension Mini Bars */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-400 pb-1 border-b border-gray-800">
            <span className="font-semibold uppercase tracking-wider text-[11px]">8 Feasibility Pillars</span>
            <span>Composite Weighting</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 font-medium">{dim.label}</span>
                  <span className="text-gray-400 font-mono font-semibold">{dim.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${dim.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {scoreBreakdown?.explanation && (
            <p className="text-xs text-gray-400 leading-relaxed pt-2 border-t border-gray-800/80">
              {scoreBreakdown.explanation}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
