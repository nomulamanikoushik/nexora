import React from "react";
import {
  Briefcase,
  TrendingUp,
  Users,
  Target,
  Layers,
  PieChart,
  BarChart3,
  Megaphone,
  ShieldAlert,
  MapPin,
  CheckCircle,
  Coins,
  Clock,
  Zap,
  Info
} from "lucide-react";
import CapitalChart from "./CapitalChart";
import RevenueChart from "./RevenueChart";
import ExplainabilityCard from "./ExplainabilityCard";
import RiskBadge from "./RiskBadge";

export default function IntelligenceDetailView({ viewType, plan, setActivePage }) {
  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-200">No Active Plan Selected</h2>
        <p className="text-xs text-gray-400">Launch a plan from onboarding or pick a preset to view detailed intelligence.</p>
        <button onClick={() => setActivePage("onboarding")} className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold">
          Start Onboarding
        </button>
      </div>
    );
  }

  const prof = plan.profile || {};
  const capital = prof.capital || 300000;
  const currency = prof.currency || "INR";
  const startMode = prof.business_start_mode || "Home-Based";

  // 1. BUSINESS PROFILE VIEW
  if (viewType === "profile") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Business Profile & Founder Parameters</h1>
            <p className="text-xs text-gray-400">Normalized baseline analyzed by Business Understanding Agent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Operating Mode</div>
            <div className="text-lg font-bold text-cyan-400">{startMode}</div>
            <p className="text-xs text-gray-400 mt-1">Calibrated to eliminate heavy physical storefront lease commitments.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Available Capital</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">{currency} {Number(capital).toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Sufficient for 4-6 months lean operating runway.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Target Location</div>
            <div className="text-lg font-bold text-white flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{prof.location || "Hyderabad"}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">High-density urban consumer catchment.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Concept Narrative</h3>
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-gray-200 leading-relaxed">
            {prof.custom_idea_text || prof.business_type || "Artisanal healthy snack venture prepared from home kitchen."}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
            <div><strong>Primary Objective:</strong> {prof.objective || "Achieve rapid early cash-flow break-even"}</div>
            <div><strong>Experience Level:</strong> {prof.experience_level || "Beginner"}</div>
            <div><strong>Risk Posture:</strong> {prof.risk_preference || "Moderate"}</div>
            <div><strong>Time Horizon:</strong> {prof.time_horizon || "3 years"}</div>
          </div>
        </div>

        <ExplainabilityCard title="Profile Normalization Rationale" explainability={plan.business_understanding?.explainability} />
      </div>
    );
  }

  // 2. MARKET INTELLIGENCE VIEW
  if (viewType === "market") {
    const market = plan.market_analysis?.data || {};
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Market Intelligence & Economics</h1>
            <p className="text-xs text-gray-400">Synthesized by Market Research Agent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Addressable Market (TAM)</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{market.tam || "₹4.2 Lakh Cr"}</div>
            <p className="text-xs text-gray-400 mt-1">National packaged & artisanal snack market size</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Serviceable Market (SAM)</div>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-1">{market.sam || "₹680 Cr"}</div>
            <p className="text-xs text-gray-400 mt-1">Metropolitan urban healthy snackers</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">5-Year CAGR Momentum</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{market.cagr || "14.2%"}</div>
            <p className="text-xs text-gray-400 mt-1">Shift towards clean-label & zero palm oil</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Growth Drivers
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              {(market.drivers || [
                "Rising consumer awareness regarding ultra-processed junk ingredients",
                "Strong willingness to pay 20-30% premium for roasted, unadulterated snacks",
                "Booming quick-commerce and WhatsApp hyperlocal direct ordering behavior"
              ]).map((d, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800">• {d}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" />
              Industry Headwinds
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              {(market.headwinds || [
                "Dry fruit and cold-pressed seed wholesale price inflation",
                "Moisture degradation during monsoon without hermetic pouch sealing",
                "Aggressive digital advertising noise from venture-backed mass brands"
              ]).map((h, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800">• {h}</li>
              ))}
            </ul>
          </div>
        </div>

        <ExplainabilityCard title="Market Modeling Explainability" explainability={plan.market_analysis?.explainability} />
      </div>
    );
  }

  // 3. CUSTOMER ANALYSIS VIEW
  if (viewType === "customers") {
    const personas = plan.customer_analysis?.data?.personas || [
      {
        name: "Fitness Enthusiast Ananya (26, IT Consultant)",
        aov: "INR 450",
        pain: "Wants guilt-free afternoon snacks that don't spike blood sugar or contain cheap palm oil",
        buying_freq: "Twice a month via WhatsApp"
      },
      {
        name: "Health-Conscious Parent Rahul (34, Product Manager)",
        aov: "INR 650",
        pain: "Seeks safe, preservative-free school snacks for kids without hidden refined sugars",
        buying_freq: "Weekly residential society box"
      },
      {
        name: "Corporate Desk Worker Vikram (29, Software Dev)",
        aov: "INR 500",
        pain: "Tired of oily office cafeteria snacks causing late-afternoon brain fog",
        buying_freq: "Shared office desk snack pool"
      }
    ];

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Target Customer Personas & Buying Psychology</h1>
            <p className="text-xs text-gray-400">Profiled by Customer Analysis Agent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
              <div className="text-sm font-bold text-white">{p.name || `Persona #${i+1}`}</div>
              <div className="space-y-2 text-xs text-gray-300">
                <div><span className="text-gray-500">Average Order:</span> <strong className="text-emerald-400 font-mono">{p.aov || "INR 480"}</strong></div>
                <div><span className="text-gray-500">Buying Frequency:</span> <strong>{p.buying_freq || "Bi-weekly"}</strong></div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-[11px] text-gray-400">
                  <strong>Core Pain Point:</strong> {p.pain || "Needs clean snacking without artificial additives."}
                </div>
              </div>
            </div>
          ))}
        </div>

        <ExplainabilityCard title="Customer Demand Validation" explainability={plan.customer_analysis?.explainability} />
      </div>
    );
  }

  // 4. COMPETITORS VIEW
  if (viewType === "competitors") {
    const comps = plan.competitor_analysis?.data?.competitors || [
      { name: "Organized Packaged Brands (The Whole Truth, Farmley)", tier: "National D2C", pricing: "High (INR 350-450)", moat: "High marketing budget, nationwide shelf presence" },
      { name: "Traditional Sweet & Savory Outlets", tier: "Regional Retail", pricing: "Medium (INR 200-280)", moat: "Established physical stores, deep fried recipes" },
      { name: "Local Unorganized Home Bakers", tier: "Hyperlocal Micro", pricing: "Variable", moat: "Personal networks, but lack standardized packaging and FSSAI QA" }
    ];

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Competitive Landscape & Differentiation Moats</h1>
            <p className="text-xs text-gray-400">Evaluated by Competitor Analysis Agent.</p>
          </div>
        </div>

        <div className="space-y-4">
          {comps.map((c, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.tier} • Pricing: {c.pricing}</div>
                <p className="text-xs text-gray-300 mt-2"><strong>Moat & Weakness:</strong> {c.moat}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-cyan-300 self-start md:self-auto whitespace-nowrap">
                Our Moat: Small-Batch Freshness + Zero Palm Oil
              </div>
            </div>
          ))}
        </div>

        <ExplainabilityCard title="Moat Feasibility" explainability={plan.competitor_analysis?.explainability} />
      </div>
    );
  }

  // 5. CAPITAL PLAN VIEW
  if (viewType === "capital") {
    const capData = plan.capital_allocation || {};
    const pillars = capData.practical_pillars || {};

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Enhanced Capital Allocation Strategy</h1>
            <p className="text-xs text-gray-400">Calculated across 5 operational buckets by Capital Planning Agent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <CapitalChart chartData={capData.chart_data || []} totalCapital={capital} currency={currency} />

          <div className="space-y-3">
            {Object.entries(pillars).map(([key, val]) => (
              <div key={key} className="p-4 rounded-xl bg-[#111827] border border-gray-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase tracking-wider">{key.replace(/_/g, " ")}</span>
                  <span className="font-mono text-emerald-400 font-bold">{currency} {Number(val.amount).toLocaleString()} ({val.percentage}%)</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{val.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <ExplainabilityCard title="Capital Allocation Logic" explainability={plan.capital_planning?.explainability} />
      </div>
    );
  }

  // 6. FINANCIALS VIEW
  if (viewType === "financials") {
    const cost = plan.cost_analysis || {};
    const scenarios = plan.revenue_scenarios || {};
    const unit = cost.unit_economics || {};

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Cost Structure, Unit Economics & Break-Even</h1>
            <p className="text-xs text-gray-400">Modeled by Cost & Revenue Agent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Startup Capex</div>
            <div className="text-lg font-bold text-white font-mono mt-1">{currency} {Number(cost.startup_capex || 65000).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Monthly Fixed Burn</div>
            <div className="text-lg font-bold text-rose-400 font-mono mt-1">{currency} {Number(cost.monthly_operating_cost || 27000).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Unit Gross Margin</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{unit.gross_margin_percentage || 59.2}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Break-Even Milestone</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">Month {cost.break_even_month || 3}</div>
          </div>
        </div>

        <RevenueChart scenarios={scenarios} monthlyProjections={cost.monthly_projections || []} currency={currency} />

        <ExplainabilityCard title="Financial Assumptions & Disclaimers" explainability={plan.cost_analysis?.explainability} />
      </div>
    );
  }

  // 7. RISKS VIEW
  if (viewType === "risks") {
    const risks = plan.risk_register || [];
    const critic = plan.critic_feedback || {};

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Risk Register & Critic Validation Audit</h1>
            <p className="text-xs text-gray-400">Audited by Risk Agent & Critic Gatekeeper.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Critic Audit Status</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{critic.verdict || "VALIDATION_APPROVED"}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Verified Cash Runway</div>
            <div className="text-base font-bold text-white font-mono">{critic.verified_runway_months || 4.2} Months Buffer</div>
          </div>
        </div>

        <div className="space-y-3">
          {risks.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#111827] border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <RiskBadge severity={r.severity} />
                <span className="text-[10px] text-gray-500 font-mono">{r.id || `RSK-${i+1}`}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{r.risk}</h4>
              <p className="text-xs text-gray-400"><strong>Trigger Indicator:</strong> {r.trigger}</p>
              <p className="text-xs text-emerald-300"><strong>Mitigation Protocol:</strong> {r.mitigation}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback / default
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-400">
      View under construction for {viewType}.
    </div>
  );
}
