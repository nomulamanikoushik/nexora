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
  Award
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
        <h2 className="text-xl font-bold text-gray-200">No Active Business Plan Selected</h2>
        <p className="text-xs text-gray-400">Launch a plan from the onboarding page or pick a saved plan.</p>
        <button
          onClick={() => setActivePage("onboarding")}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold"
        >
          Go to Onboarding
        </button>
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
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {profile.sector ? profile.sector.replace(/-/g, " ").toUpperCase() : "FOOD & BEVERAGE"}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {profile.location || "Hyderabad"}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {profile.business_name || plan.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
              {profile.business_type} ? Calibrated for {profile.risk_preference || "Moderate"} risk posture over {profile.time_horizon || "3 years"}.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-start lg:self-auto">
            <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Available Capital</div>
              <div className="text-base font-extrabold text-white font-mono mt-0.5">
                {currency} {Number(capital).toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Feasibility Score</div>
              <div className="text-base font-extrabold text-cyan-400 font-mono mt-0.5">
                {plan.feasibility_score} / 100
              </div>
            </div>

            <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Target Break-even</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
                Month {breakEven.break_even_month || 7}
              </div>
            </div>
          </div>

        </div>

        {/* Quick Action Navigation Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePage("first_customers")}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Your First Customers</span>
            </button>
            <button
              onClick={() => setActivePage("growth")}
              className="px-4 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Business Growth Engine</span>
            </button>
            <button
              onClick={() => setActivePage("whatif")}
              className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>What-If Simulator</span>
            </button>
            <button
              onClick={() => setActivePage("plan")}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Read Full Plan</span>
            </button>
          </div>

          <span className="text-[11px] text-gray-400">
            Validated by 16 specialized AI agents • {plan.revision_count || 1} Critic cycle
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
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold">
            <span>Market Demand</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{market.cagr || "12.5%"} CAGR</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>TAM: <span className="text-gray-100 font-medium">{market.tam || "?4.2L Cr"}</span></div>
            <div>SOM: <span className="text-gray-100 font-medium">{market.som || "?22 Cr"}</span></div>
          </div>
        </div>

        {/* Customer */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold">
            <span>Customer Base</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">3 Key Segments</div>
          <div className="text-xs text-gray-300 line-clamp-2">
            Primary: {customers[0]?.name || "Urban Tech & Corporate Professionals"}
          </div>
        </div>

        {/* Competitors */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold">
            <span>Competition</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Moderate Moat</div>
          <div className="text-xs text-gray-300 line-clamp-2">
            Specialty differentiation overcomes mass-chain price pressure.
          </div>
        </div>

        {/* Location */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold">
            <span>Target Hotspot</span>
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono truncate">
            {locationData[0]?.zone?.split("/")[0] || "Madhapur"}
          </div>
          <div className="text-xs text-gray-300">
            {locationData[0]?.rent_sqft || "?60-80 / sq.ft"} lease rate
          </div>
        </div>

      </div>

      {/* Risk Register Preview */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Top Prioritized Risks & Mitigations
          </h3>
          <span className="text-xs text-gray-400">{risks.length} Assessed Vulnerabilities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {risks.slice(0, 4).map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <RiskBadge severity={r.severity} />
                <span className="text-[10px] text-gray-500">Impact: {r.impact || "High"}</span>
              </div>
              <h5 className="text-xs font-bold text-gray-200">{r.risk}</h5>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <strong>Mitigation:</strong> {r.mitigation}
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
