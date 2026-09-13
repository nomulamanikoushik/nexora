import React from "react";
import { CheckCircle2, Calendar, Milestone, ArrowRight } from "lucide-react";

export default function RoadmapTimeline({ roadmap = [] }) {
  return (
    <div className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Milestone className="w-4 h-4 text-indigo-400" />
            <span>9-Phase Step-by-Step Launch Roadmap</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological execution milestones from initial validation to commercial stabilization.
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full font-mono self-start sm:self-auto">
          11 Weeks to Opening
        </span>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
        {roadmap.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Dot */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#070A12] border-2 border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-md shadow-cyan-500/20">
              {idx + 1}
            </div>

            <div className="glass-card border border-white/[0.06] p-4 sm:p-5 rounded-2xl space-y-2.5 hover:border-cyan-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h4 className="text-sm font-bold text-white">
                  {step.phase}
                </h4>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {step.duration}
                </span>
              </div>

              {step.milestones && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                  {step.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/[0.04]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{m}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
