import React from "react";
import { 
  Building, 
  MapPin, 
  Coins, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Sliders, 
  FileText, 
  ArrowRight, 
  Compass, 
  Sparkles,
  Award,
  Activity
} from "lucide-react";
import FeasibilityGauge from "../components/FeasibilityGauge";
import CapitalChart from "../components/CapitalChart";
import RevenueChart from "../components/RevenueChart";
import RiskBadge from "../components/RiskBadge";
import ExplainabilityCard from "../components/ExplainabilityCard";

export default function DashboardPage({ plan, setActivePage }) {
  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md mx-auto space-y-4 border border-white/[0.08]">
          <h2 className="text-xl font-bold text-white">No Active Business Plan Selected</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Launch an autonomous business plan from the onboarding pipeline or pick a ready-to-run demo.
          </p>
          <button
            onClick={() => setActivePage("onboarding")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  const profile = plan.profile || {};
  const capital = profile.capital || 1000000;
  const currency = profile.currency || "INR";
  const capitalAlloc = plan.capital_allocation || {};
  const costData = plan.cost_analysis || {};
  const revScenarios = plan.revenue_scenarios || {};
  const breakEven = plan.break_even_analysis || {};
  const risks = plan.risk_register || [];
  const market = plan.market_analysis?.data || {};
  const customers = plan.customer_analysis?.data?.personas || [];
  const competitors = plan.competitor_analysis?.data?.competitors || [];
  const locationData = plan.location_analysis?.data?.recommended_zones || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/[0.08]">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 glow-cyan-sm">
                {profile.sector ? profile.sector.replace(/-/g, " ").toUpperCase() : "FOOD & BEVERAGE"}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1.5 glass-pill px-2.5 py-0.5 rounded-full font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {profile.location || "Hyderabad"}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {profile.business_name || plan.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {profile.business_type} • Calibrated for {profile.risk_preference || "Moderate"} risk posture over {profile.time_horizon || "3 years"}.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-start lg:self-auto">
            <div className="p-3.5 glass-card rounded-2xl border border-white/[0.08]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold font-mono">Available Capital</div>
              <div className="text-base font-extrabold text-white font-mono mt-1">
                {currency} {Number(capital).toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 glass-card rounded-2xl border border-white/[0.08]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold font-mono">Feasibility Score</div>
              <div className="text-base font-extrabold text-cyan-400 font-mono mt-1">
                {plan.feasibility_score} / 100
              </div>
            </div>

            <div className="p-3.5 glass-card rounded-2xl border border-white/[0.08] col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold font-mono">Target Break-Even</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">
                Month {breakEven.break_even_month || 7}
              </div>
            </div>
          </div>

        </div>

        {/* Quick Action Navigation Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActivePage("first_customers")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>Get Your First Customers</span>
            </button>
            <button
              onClick={() => setActivePage("growth")}
              className="px-4 py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 text-violet-400" />
              <span>Business Growth Engine</span>
            </button>
            <button
              onClick={() => setActivePage("whatif")}
              className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>What-If Simulator</span>
            </button>
            <button
              onClick={() => setActivePage("plan")}
              className="px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-200 border border-white/[0.1] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Read Full Plan</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Validated by 16 specialized AI agents • {plan.revision_count || 1} Critic cycles
          </span>
        </div>
      </div>

      {/* Feasibility Gauge & Scoring Breakdown */}
      <FeasibilityGauge 
        score={plan.feasibility_score} 
        scoreBreakdown={plan.score_breakdown} 
      />

      {/* Visual Analytics Grid: Capital Allocation + Revenue Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CapitalChart 
          chartData={capitalAlloc.chart_data || []} 
          totalCapital={capital}
          currency={currency}
        />
        <RevenueChart 
          scenarios={revScenarios} 
          monthlyProjections={costData.monthly_projections || []}
          currency={currency}
        />
      </div>

      {/* Strategic Intelligence Cards (Market, Customers, Competitors, Location) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Market */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono font-semibold">
            <span>Market Demand</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{market.cagr || "12.5%"} CAGR</div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>TAM: <span className="text-white font-mono font-medium">{market.tam || "₹4.2L Cr"}</span></div>
            <div>SOM: <span className="text-white font-mono font-medium">{market.som || "₹22 Cr"}</span></div>
          </div>
        </div>

        {/* Customer */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono font-semibold">
            <span>Customer Base</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">3 Key Segments</div>
          <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            Primary: {customers[0]?.name || "Urban Tech & Corporate Professionals"}
          </div>
        </div>

        {/* Competitors */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono font-semibold">
            <span>Competition</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Moderate Moat</div>
          <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            Specialty artisanal differentiation overcomes mass-chain price pressure.
          </div>
        </div>

        {/* Location */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono font-semibold">
            <span>Target Hotspot</span>
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono truncate">
            {locationData[0]?.zone?.split("/")[0] || "Madhapur"}
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {locationData[0]?.rent_sqft || "₹60-80 / sq.ft"} lease rate
          </div>
        </div>

      </div>

      {/* Risk Register Preview */}
      <div className="glass-panel border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Top Prioritized Risks & Mitigations
          </h3>
          <span className="text-xs font-mono text-slate-400">{risks.length} Assessed Vulnerabilities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {risks.slice(0, 4).map((r, i) => (
            <div key={i} className="p-4 rounded-2xl glass-card border border-white/[0.06] space-y-2 hover:border-white/[0.15] transition-colors">
              <div className="flex items-center justify-between">
                <RiskBadge severity={r.severity} />
                <span className="text-[10px] font-mono text-slate-500">Impact: {r.impact || "High"}</span>
              </div>
              <h5 className="text-xs font-bold text-white">{r.risk}</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-cyan-400">Mitigation:</strong> {r.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Explainability Block */}
      <ExplainabilityCard 
        title="Feasibility Assessment Explainability" 
        explainability={plan.score_breakdown?.explainability} 
      />

    </div>
  );
}
