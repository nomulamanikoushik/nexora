import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle, 
  BarChart3, 
  Sliders, 
  MapPin, 
  Coins, 
  Zap,
  Target,
  FileText
} from "lucide-react";
import { PRESETS } from "../utils/presets";

export default function LandingPage({ setActivePage, onSelectPreset }) {
  const featuredPreset = PRESETS[0]; // Hyderabad Food & Beverage

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden text-center max-w-5xl mx-auto px-4">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-indigo-600/15 blur-3xl pointer-events-none rounded-full"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>NEXORA 2.0 ? Autonomous Multi-Agent Planning Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
          From Capital <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            to Thriving Business.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Not a chatbot. NEXORA orchestrates <strong>13 specialized AI agents</strong> that conduct market research, 
          stress-test capital allocations, validate regulatory compliance, and execute active critic loops to build your complete business plan.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActivePage("onboarding")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Create My Business Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectPreset(featuredPreset)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700/80 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Launch Hyderabad F&B Demo (?10L)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-gray-900/40 rounded-xl border border-gray-800/80">
            <div className="text-xl font-extrabold text-white font-mono">13</div>
            <div className="text-xs text-gray-400 mt-0.5">Specialized Agents</div>
          </div>
          <div className="p-3 bg-gray-900/40 rounded-xl border border-gray-800/80">
            <div className="text-xl font-extrabold text-cyan-400 font-mono">100%</div>
            <div className="text-xs text-gray-400 mt-0.5">Explainable Decisions</div>
          </div>
          <div className="p-3 bg-gray-900/40 rounded-xl border border-gray-800/80">
            <div className="text-xl font-extrabold text-indigo-400 font-mono">Dynamic</div>
            <div className="text-xs text-gray-400 mt-0.5">Critic Feedback Loop</div>
          </div>
          <div className="p-3 bg-gray-900/40 rounded-xl border border-gray-800/80">
            <div className="text-xl font-extrabold text-emerald-400 font-mono">Interactive</div>
            <div className="text-xs text-gray-400 mt-0.5">What-If Simulator</div>
          </div>
        </div>
      </section>

      {/* The Core Transformation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How NEXORA Transforms Your Starting Assumptions
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Turn fragmented ideas and raw capital into an executive-grade launch blueprint in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Inputs */}
          <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              Your Starting Inputs
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Available Starting Capital", eg: "e.g. ?10,00,000 liquid capital" },
                { label: "Chosen Sector & Idea", eg: "e.g. Food & Beverage / Cloud Kitchen" },
                { label: "Target City & Location", eg: "e.g. Hyderabad (Madhapur / Hitec)" },
                { label: "Founder Goals & Risk Profile", eg: "e.g. Moderate risk, 3-year horizon" }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-900/80 border border-gray-800">
                  <div className="text-xs font-semibold text-gray-200">{item.label}</div>
                  <div className="text-[11px] text-gray-400">{item.eg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Connector */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5 animate-spin" />
            </div>
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              16 Agents Collaborate
            </span>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              The Validated Business Plan
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Market TAM / SAM / SOM",
                "Customer Persona Profiles",
                "Competitor Moat Analysis",
                "Location Suitability Index",
                "Capital Allocation Donut",
                "Break-even Projections",
                "Statutory Compliance List",
                "9-Phase Launch Roadmap"
              ].map((item, i) => (
                <div key={i} className="p-2 rounded bg-gray-900/80 border border-gray-800 text-xs text-gray-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Multi-Agent Collaboration & Critic Loop Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#111827] to-[#0D121F] border border-gray-800 rounded-3xl p-8 lg:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Genuine Agentic AI Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              The Risk Critic & Revision Feedback Loop
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
              When the Risk & Critic agent detects budget imbalances or tight cash runways, 
              it doesn't output broken assumptions?it issues formal revision requests to upstream agents until stability is achieved.
            </p>
          </div>

          {/* Simulated Dialogue Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 space-y-2">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Capital Planning Agent
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Allocating 43% of ?10 Lakh capital to setup and equipment, leaving 12% in working capital."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Cost & Revenue Agent
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Monthly fixed operating burn modeled at ?1.25 Lakh. Break-even anticipated by Month 7."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Risk Critic Agent (Challenge)
              </div>
              <p className="text-xs text-amber-200 leading-relaxed">
                "REVISION REQUIRED: Remaining ?1.2L cash reserve provides only 1.4 months runway. Rebalance capex!"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Strategy Agent (Resolution)
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                "Capex rebalanced by 9%. Working capital reserve fortified to 25% (?2.5L). Plan approved!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Demo Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Explore Ready-to-Run Demo Scenarios
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Test the complete 13-agent pipeline with pre-populated industry parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((p) => (
            <div 
              key={p.id}
              className="p-5 rounded-2xl bg-[#111827] border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {p.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-200">{p.capitalDisplay}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {p.business_name}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {p.business_type} in {p.location}
                </p>
              </div>

              <button
                onClick={() => onSelectPreset(p)}
                className="w-full py-2 rounded-xl bg-gray-900 hover:bg-cyan-500/15 text-gray-200 hover:text-cyan-300 border border-gray-800 hover:border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Run Demo Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
