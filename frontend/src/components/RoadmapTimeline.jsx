import React from "react";
import { CheckCircle2, Calendar, Milestone, ArrowRight } from "lucide-react";

export default function RoadmapTimeline({ roadmap = [] }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Milestone className="w-4 h-4 text-indigo-400" />
            9-Phase Step-by-Step Launch Roadmap
          </h3>
          <p className="text-xs text-gray-400">
            Chronological execution milestones from initial validation to commercial stabilization.
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-mono">
          11 Weeks to Opening
        </span>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
        {roadmap.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Dot */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-gray-900 border-2 border-cyan-500 flex items-center justify-center text-[10px] font-bold text-cyan-400 group-hover:scale-110 transition-transform">
              {idx + 1}
            </div>

            <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-xl space-y-2 hover:border-gray-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-gray-100">
                  {step.phase}
                </h4>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 px-2 py-0.5 rounded self-start sm:self-auto">
                  {step.duration}
                </span>
              </div>

              {step.milestones && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                  {step.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="text-xs text-gray-300 flex items-start gap-1.5 bg-gray-950/40 p-2 rounded border border-gray-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{m}</span>
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
