import React from "react";
import { HelpCircle, AlertTriangle, CheckCircle, Database } from "lucide-react";

export default function ExplainabilityCard({ title = "Recommendation Rationale", explainability }) {
  if (!explainability) return null;

  return (
    <div className="glass-panel border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>{title}</span>
        </h4>
        <span className="text-[11px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
          Confidence: {explainability.confidence_level || "High"}
        </span>
      </div>

      {/* Why this recommendation? */}
      {explainability.why_this_recommendation && (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-200">Why this recommendation?</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explainability.why_this_recommendation}
          </p>
        </div>
      )}

      {/* Key Assumptions */}
      {explainability.key_assumptions && explainability.key_assumptions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Key Assumptions:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            {explainability.key_assumptions.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Risks */}
      {explainability.main_risks && explainability.main_risks.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Main Risks:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            {explainability.main_risks.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Sources */}
      {explainability.data_sources && explainability.data_sources.length > 0 && (
        <div className="text-[11px] text-slate-500 pt-3 border-t border-white/[0.08] flex items-center gap-2 font-mono">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Data Sources: {explainability.data_sources.join(" • ")}</span>
        </div>
      )}
    </div>
  );
}
