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
  executionTimeMs,
  onRetry
}) {
  const [expanded, setExpanded] = useState(false);

  // Status styling configurations
  const statusConfig = {
    waiting: {
      label: "Waiting",
      badgeClass: "glass-card text-slate-400 border-white/[0.08]",
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />
    },
    running: {
      label: "Executing",
      badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 animate-pulse glow-cyan-sm",
      icon: <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
    },
    completed: {
      label: "Completed",
      badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
    },
    revising: {
      label: "Revising (Critic Loop)",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse",
      icon: <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
    },
    failed: {
      label: "Failed",
      badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.waiting;
  const explainability = outputPayload?.explainability;

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      status === "running" 
        ? "glass-panel border-cyan-500/60 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-500/40" 
        : status === "revising"
        ? "bg-[#14121f]/90 border-amber-500/60 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/40"
        : status === "completed"
        ? "glass-card border-white/[0.08] hover:border-cyan-500/30"
        : "bg-[#070A12]/60 border-white/[0.04] opacity-70"
    }`}>
      
      {/* Header Bar */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-colors ${
            status === "completed"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : status === "running"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
              : "bg-white/[0.04] text-slate-400 border border-white/[0.06]"
          }`}>
            {status === "completed" ? "✓" : stepOrder}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {agentName.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              {revisionCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono font-semibold">
                  <RotateCw className="w-2.5 h-2.5" />
                  Revised x{revisionCount}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 font-mono text-[11px] font-medium ${currentStatus.badgeClass}`}>
            {currentStatus.icon}
            {currentStatus.label}
          </span>
          {status === "failed" && onRetry && (
            <button
              onClick={onRetry}
              className="text-[11px] px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow"
            >
              Retry
            </button>
          )}
          {outputPayload && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Summary Snippet */}
      {summary && (
        <div className="px-4 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-white/[0.06] pt-3">
          {summary}
        </div>
      )}

      {/* Critic Alert Flag */}
      {criticIssues && criticIssues.length > 0 && (
        <div className="mx-4 mb-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
          <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Critic Feedback Loop Intervention:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300/90 font-mono">
            {criticIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expandable Details */}
      {expanded && outputPayload && (
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/[0.08] rounded-b-2xl space-y-3.5 text-xs">
          
          {/* Findings */}
          {outputPayload.findings && outputPayload.findings.length > 0 && (
            <div>
              <h5 className="font-mono font-semibold mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                Key Agent Discoveries:
              </h5>
              <div className="grid grid-cols-1 gap-1.5">
                {outputPayload.findings.map((f, i) => (
                  <div key={i} className="glass-card p-2.5 rounded-xl border border-white/[0.06] flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-400 font-mono font-medium">
                        {f.category || f.metric || f.dimension || f.factor || f.component || f.item || f.strategy || "Insight"}:
                      </span>{" "}
                      <span className="text-white font-medium">{f.insight || f.value || f.detail || f.assessment || f.amount || ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explainability Card Inline */}
          {explainability && (
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1.5 text-[11px]">
              <div className="text-blue-300 font-semibold flex items-center gap-1.5 font-mono">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Why this recommendation?
              </div>
              <p className="text-slate-300 leading-relaxed">{explainability.why_this_recommendation}</p>
              {explainability.data_sources && (
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Sources: {explainability.data_sources.join(" • ")}
                </div>
              )}
            </div>
          )}

          {executionTimeMs > 0 && (
            <div className="text-[10px] text-slate-500 font-mono text-right">
              Execution duration: {executionTimeMs} ms
            </div>
          )}

        </div>
      )}

    </div>
  );
}
