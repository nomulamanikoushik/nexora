import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function RiskBadge({ severity = "Medium" }) {
  const sev = severity.toLowerCase();
  
  if (sev === "high") {
    return (
      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-rose-400" />
        High Risk
      </span>
    );
  }
  
  if (sev === "low") {
    return (
      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
        <Info className="w-3 h-3 text-emerald-400" />
        Low Risk
      </span>
    );
  }

  return (
    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
      <AlertCircle className="w-3 h-3 text-amber-400" />
      Medium Risk
    </span>
  );
}
