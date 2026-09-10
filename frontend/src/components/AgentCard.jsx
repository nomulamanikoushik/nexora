import React, { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  Info 
} from "lucide-react";

export default function AgentCard({ 
  agentName, 
  role, 
  stepOrder, 
  status = "waiting", 
  summary, 
  outputPayload, 
  revisionCount = 0, 
  criticIssues, 
  executionTimeMs 
}) {
  const [expanded, setExpanded] = useState(false);

  // Status styling
  const statusConfig = {
    waiting: {
      label: "Waiting",
      badgeClass: "bg-gray-800 text-gray-400 border-gray-700",
      icon: <Clock className="w-3.5 h-3.5" />
    },
    running: {
      label: "Running",
      badgeClass: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 animate-pulse",
      icon: <RotateCw className="w-3.5 h-3.5 animate-spin" />
    },
    completed: {
      label: "Completed",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    revising: {
      label: "Revising (Critic Loop)",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse",
      icon: <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
    },
    failed: {
      label: "Failed",
      badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.waiting;
  const explainability = outputPayload?.explainability;

  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      status === "running" 
        ? "bg-[#111827] border-cyan-500/50 shadow-lg shadow-cyan-500/10" 
        : status === "revising"
        ? "bg-[#161726] border-amber-500/50 shadow-lg shadow-amber-500/10"
        : status === "completed"
        ? "bg-[#0E1422] border-gray-800/80 hover:border-gray-700"
        : "bg-[#0A0E1A]/60 border-gray-800/40 opacity-75"
    }`}>
      
      {/* Header Bar */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-xs font-mono font-bold text-gray-400">
            {stepOrder}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              {agentName.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              {revisionCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                  <RotateCw className="w-2.5 h-2.5" />
                  Revised x{revisionCount}
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 font-medium ${currentStatus.badgeClass}`}>
            {currentStatus.icon}
            {currentStatus.label}
          </span>
          {outputPayload && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Summary Snippet */}
      {summary && (
        <div className="px-4 pb-3 text-xs text-gray-300 leading-relaxed border-t border-gray-800/40 pt-2.5">
          {summary}
        </div>
      )}

      {/* Critic Alert Flag */}
      {criticIssues && criticIssues.length > 0 && (
        <div className="mx-4 mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
          <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Critic Loop Review Note:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300/90">
            {criticIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expandable Details */}
      {expanded && outputPayload && (
        <div className="p-4 bg-gray-950/60 border-t border-gray-800/80 rounded-b-xl space-y-3 text-xs">
          
          {/* Findings */}
          {outputPayload.findings && outputPayload.findings.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-200 mb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider text-cyan-400">
                Key Agent Discoveries:
              </h5>
              <div className="grid grid-cols-1 gap-1.5">
                {outputPayload.findings.map((f, i) => (
                  <div key={i} className="bg-gray-900/80 p-2 rounded border border-gray-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <div className="text-[11px] text-gray-300">
                      {f.category || f.metric || f.dimension || f.factor || f.component || f.item || f.strategy || "Insight"}:{" "}
                      <span className="text-gray-100 font-medium">{f.insight || f.value || f.detail || f.assessment || f.amount || ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explainability Card Inline */}
          {explainability && (
            <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/40 space-y-1 text-[11px]">
              <div className="text-blue-300 font-semibold flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-400" />
                Why this recommendation?
              </div>
              <p className="text-gray-300">{explainability.why_this_recommendation}</p>
              {explainability.data_sources && (
                <div className="text-[10px] text-gray-400 pt-1">
                  Sources: {explainability.data_sources.join(" ? ")}
                </div>
              )}
            </div>
          )}

          {executionTimeMs > 0 && (
            <div className="text-[10px] text-gray-500 font-mono text-right">
              Execution duration: {executionTimeMs} ms
            </div>
          )}

        </div>
      )}

    </div>
  );
}
