import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart3, 
  Sliders, 
  MapPin, 
  Coins, 
  Zap,
  Target,
  FileText,
  Activity,
  Bot,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { PRESETS } from "../utils/presets";

export default function LandingPage({ setActivePage, onSelectPreset }) {
  const featuredPreset = PRESETS[0]; // Hyderabad Healthy Snacks

  return (
    <div className="space-y-28 pb-24">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 overflow-hidden text-center max-w-6xl mx-auto px-4">
        {/* Luminous Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[420px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-400/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Telemetry Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs text-slate-300 mb-8 shadow-sm border border-cyan-500/20 glow-cyan-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="font-mono uppercase tracking-wider text-[11px] text-cyan-300 font-semibold">NEXORA 2.0</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">16-Agent Autonomous AI Orchestration</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-5xl mx-auto">
          Turn Your Business Idea <br className="hidden sm:inline" />
          <span className="text-gradient-cyan">
            Into an Execution-Grade Launch Plan.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Deploy an autonomous team of 16 AI agents to research market TAM, calculate unit economics, acquire early customers, simulate cash runway, and synthesize an investor-ready blueprint.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActivePage("onboarding")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
            <span>Build My Business Plan</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={() => onSelectPreset(featuredPreset)}
            className="w-full sm:w-auto px-6 py-4 rounded-xl glass-panel-interactive text-emerald-300 border-emerald-500/30 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/5 hover:border-emerald-400/50"
          >
            <Zap className="w-4 h-4 text-emerald-400 fill-current" />
            <span>Launch Demo: Hyderabad Snacks (₹3L)</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("critic-loop");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl glass-panel text-slate-300 hover:text-white border-white/10 hover:border-white/20 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Explore Architecture</span>
          </button>
        </div>

        {/* Trust & Performance Telemetry Metrics */}
        <div className="mt-16 pt-10 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">16</span>
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Autonomous Agents</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Specialized parallel nodes</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">100%</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Explainable Reasoning</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Auditable data citations</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">Loop</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Critic Feedback</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Zero broken assumptions</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">Instant</span>
              <Sliders className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">What-If Simulator</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Real-time sensitivity runs</div>
          </div>
        </div>
      </section>

      {/* The Core Transformation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[11px] font-mono font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
            From Raw Ideas to Execution
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How NEXORA Transforms Your Starting Assumptions
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Feed fragmented ideas and starting capital into the pipeline — receive an executive-grade launch blueprint with mathematical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/[0.08] shadow-xl">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Coins className="w-4 h-4 text-cyan-400" />
              Your Starting Inputs
            </div>
            <div className="space-y-3">
              {[
                { label: "Available Starting Capital", eg: "e.g. ₹3,00,000 to ₹50,00,000 liquid capital", icon: Coins, color: "text-emerald-400" },
                { label: "Chosen Sector & Concept", eg: "e.g. Food & Beverage / Cloud Kitchen / Healthy Snacks", icon: Target, color: "text-cyan-400" },
                { label: "Target City & Locality", eg: "e.g. Kondapur / Hitec City, Hyderabad", icon: MapPin, color: "text-indigo-400" },
                { label: "Founder Goals & Risk Profile", eg: "e.g. Moderate risk, 3-year horizon, home-based launch", icon: Compass, color: "text-violet-400" }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-5.5 font-mono">{item.eg}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Orchestrator Nexus */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan-lg">
                <Cpu className="w-7 h-7 animate-spin" style={{ animationDuration: "10s" }} />
              </div>
              <div className="absolute -inset-2 rounded-full border border-cyan-500/20 animate-ping opacity-30 pointer-events-none" />
            </div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider block">
                16 Autonomous Agents
              </span>
              <span className="text-[10px] text-slate-500 block">Parallel Coordination</span>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/[0.08] shadow-xl">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-indigo-400" />
              The Validated Business Plan
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                "TAM / SAM / SOM Metrics",
                "Customer Personas",
                "Competitor Moat Grid",
                "Zone Suitability Index",
                "Capital Allocation Donut",
                "Month-by-Month Burn",
                "Statutory Compliance",
                "First 10 Customers Playbook",
                "Growth Viral Loops",
                "Milestone Launch Roadmap"
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs text-slate-200 flex items-center gap-2 hover:border-indigo-500/30 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-medium truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Multi-Agent Collaboration & Critic Loop Showcase */}
      <section id="critic-loop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl glass-panel border border-white/[0.08] p-8 lg:p-12 overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-3xl space-y-3 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Genuine Multi-Agent Architecture
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              The Risk Critic & Revision Feedback Loop
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Most AI platforms generate unchecked hallucinated numbers. NEXORA incorporates a dedicated <strong>Risk Critic Node</strong> that stress-tests capital allocation, unit economics, and burn rate. If cash runway falls below safe thresholds, it commands upstream agents to iterate until mathematical balance is achieved.
            </p>
          </div>

          {/* Simulated Dialogue Box */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            
            {/* Step 1: Capital Planning */}
            <div className="p-4 rounded-2xl glass-card border border-blue-500/20 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400 flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Capital Agent
                </span>
                <span className="text-[10px] font-mono text-slate-500">Draft v1</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Allocating 48% of ₹10 Lakh to commercial kitchen setup, leaving only 12% in working capital reserve."
              </p>
            </div>

            {/* Step 2: Cost & Revenue */}
            <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Revenue Agent
                </span>
                <span className="text-[10px] font-mono text-slate-500">Draft v1</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Monthly fixed operating burn modeled at ₹1.45 Lakh. Break-even anticipated by Month 8."
              </p>
            </div>

            {/* Step 3: Critic Challenge */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2.5 shadow-lg shadow-amber-500/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  Risk Critic (Intervention)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Rejected</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
                "REVISION REQUIRED: ₹1.2L cash reserve provides only 0.8 months runway. Rebalance capex immediately!"
              </p>
            </div>

            {/* Step 4: Strategy Resolution */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2.5 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Strategy Agent
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Approved</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                "Capex rebalanced by 14%. Liquid runway fortified to 3.2 months (₹2.8L). Plan cleared for execution."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Preset Demo Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Ready-to-Run Benchmarks
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              Explore Pre-Populated Scenarios
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Test the complete 16-agent pipeline with calibrated regional assumptions.
            </p>
          </div>

          <button
            onClick={() => setActivePage("onboarding")}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Or configure custom parameters</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((p) => (
            <div 
              key={p.id}
              className="p-5 rounded-2xl glass-panel-interactive border border-white/[0.08] flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    {p.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200">{p.capitalDisplay}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {p.business_name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {p.business_type} in {p.location}
                </p>
              </div>

              <button
                onClick={() => onSelectPreset(p)}
                className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-white/[0.08] hover:border-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <span>Run Demo Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
