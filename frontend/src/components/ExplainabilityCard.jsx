import React from "react";
import { HelpCircle, AlertTriangle, CheckCircle, Database } from "lucide-react";

export default function ExplainabilityCard({ title = "Recommendation Rationale", explainability }) {
  if (!explainability) return null;

  return (
    <div className="bg-[#111827] border border-blue-900/40 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          {title}
        </h4>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
          Confidence: {explainability.confidence_level || "High"}
        </span>
      </div>

      {/* Why this recommendation? */}
      {explainability.why_this_recommendation && (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-200">Why this recommendation?</div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {explainability.why_this_recommendation}
          </p>
        </div>
      )}

      {/* Key Assumptions */}
      {explainability.key_assumptions && explainability.key_assumptions.length > 0 && (
        <div className="space-y-1 pt-1">
          <div className="text-xs font-semibold text-gray-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-cyan-400" />
            Key Assumptions:
          </div>
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-0.5">
            {explainability.key_assumptions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Risks */}
      {explainability.main_risks && explainability.main_risks.length > 0 && (
        <div className="space-y-1 pt-1">
          <div className="text-xs font-semibold text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Main Risks:
          </div>
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-0.5">
            {explainability.main_risks.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Sources */}
      {explainability.data_sources && explainability.data_sources.length > 0 && (
        <div className="text-[10px] text-gray-500 pt-2 border-t border-gray-800 flex items-center gap-1">
          <Database className="w-3 h-3 text-gray-400" />
          <span>Data Sources: {explainability.data_sources.join(" ? ")}</span>
        </div>
      )}
    </div>
  );
}
