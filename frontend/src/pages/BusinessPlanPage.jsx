import React from "react";
import { 
  Printer, 
  Sliders, 
  ArrowLeft, 
  Building, 
  MapPin, 
  Coins, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  Award,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import RoadmapTimeline from "../components/RoadmapTimeline";
import RiskBadge from "../components/RiskBadge";
import ExplainabilityCard from "../components/ExplainabilityCard";

export default function BusinessPlanPage({ plan, setActivePage }) {
  if (!plan) return null;

  const profile = plan.profile || {};
  const capital = profile.capital || 1000000;
  const currency = profile.currency || "INR";
  const capitalAlloc = plan.capital_allocation || {};
  const costData = plan.cost_analysis || {};
  const revScenarios = plan.revenue_scenarios || {};
  const breakEven = plan.break_even_analysis || {};
  const risks = plan.risk_register || [];
  const compliance = plan.compliance_checklist || {};
  const mkt = plan.marketing_strategy || {};
  const bizModel = plan.business_model?.data || {};
  const strat = plan.executive_summary || {};
  const roadmap = plan.launch_roadmap || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 print:py-0 print:px-0 print:text-black">
      
      {/* Action Toolbar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => setActivePage("dashboard")}
          className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage("whatif")}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Document Cover / Header */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl print:border-none print:bg-white print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800 print:border-gray-300">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 print:text-cyan-700">
              NEXORA Strategic Intelligence
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white print:text-black mt-1">
              {profile.business_name || plan.title}
            </h1>
            <p className="text-sm text-gray-400 print:text-gray-600 mt-2">
              Master Business Launch & Execution Blueprint
            </p>
          </div>

          <div className="text-right self-start sm:self-auto space-y-1">
            <div className="text-xs text-gray-400 print:text-gray-600">Feasibility Rating</div>
            <div className="text-2xl font-black text-cyan-400 print:text-cyan-700 font-mono">
              {plan.feasibility_score} / 100
            </div>
            <div className="text-[11px] text-emerald-400 print:text-emerald-700 font-semibold">
              {plan.score_breakdown?.rating_label || "High Feasibility"}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-500 block">Sector</span>
            <strong className="text-gray-200 print:text-black uppercase">{profile.sector || "Food & Beverage"}</strong>
          </div>
          <div>
            <span className="text-gray-500 block">Target Location</span>
            <strong className="text-gray-200 print:text-black">{profile.location || "Hyderabad"}</strong>
          </div>
          <div>
            <span className="text-gray-500 block">Starting Capital</span>
            <strong className="text-cyan-400 print:text-black font-mono">{currency} {Number(capital).toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-gray-500 block">Horizon / Risk</span>
            <strong className="text-gray-200 print:text-black">{profile.time_horizon} ? {profile.risk_preference}</strong>
          </div>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          1. Executive Summary & Core Opportunity
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 print:text-gray-800 leading-relaxed">
          {strat.summary || `Comprehensive launch strategy for ${profile.business_name} in ${profile.location}. The venture capitalizes on urban demographic tailwinds and sustained consumer demand for high-quality culinary offerings.`}
        </p>

        {strat.pillars && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {strat.pillars.map((p, i) => (
              <div key={i} className="p-3 bg-gray-900/80 print:bg-gray-50 rounded-xl border border-gray-800 print:border-gray-200">
                <strong className="text-xs text-cyan-400 print:text-cyan-800 block mb-1">{p.pillar}</strong>
                <p className="text-xs text-gray-300 print:text-gray-700">{p.strategy}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Market Analysis */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          2. Market Analysis (TAM / SAM / SOM)
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 print:text-gray-800 leading-relaxed">
          {plan.market_analysis?.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {plan.market_analysis?.findings?.map((f, idx) => (
            <div key={idx} className="p-3 bg-gray-900/80 print:bg-gray-50 rounded-xl border border-gray-800 print:border-gray-200">
              <span className="text-[11px] text-gray-400 block">{f.metric}</span>
              <span className="text-sm font-bold text-white print:text-black font-mono block mt-0.5">{f.value}</span>
              <p className="text-[10px] text-gray-400 mt-1">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Customer Analysis */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          3. Target Customer Segments & Personas
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 print:text-gray-800 leading-relaxed">
          {plan.customer_analysis?.summary}
        </p>

        <div className="space-y-3 pt-2">
          {plan.customer_analysis?.data?.personas?.map((p, idx) => (
            <div key={idx} className="p-4 bg-gray-900/80 print:bg-gray-50 rounded-xl border border-gray-800 print:border-gray-200 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-cyan-300 print:text-cyan-800">{p.name}</span>
                <span className="font-mono text-gray-400">{p.share} Share</span>
              </div>
              <p className="text-xs text-gray-300 print:text-gray-700"><strong>Core Needs:</strong> {p.needs}</p>
              <div className="flex gap-4 text-[11px] text-gray-400">
                <span>AOV: <strong className="text-gray-200 print:text-black">{p.aov}</strong></span>
                <span>Frequency: <strong className="text-gray-200 print:text-black">{p.frequency}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Recommended Business Model */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          4. Recommended Business Model & Unit Economics
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 print:text-gray-800 leading-relaxed">
          {plan.business_model?.summary}
        </p>

        {bizModel.unit_economics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-900/60 print:bg-gray-50 rounded-xl border border-gray-800 print:border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 block">Average Ticket Size</span>
              <strong className="text-white print:text-black font-mono">{bizModel.unit_economics.average_ticket_size}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">COGS Margin</span>
              <strong className="text-white print:text-black font-mono">{bizModel.unit_economics.cogs_percentage}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Gross Margin</span>
              <strong className="text-white print:text-black font-mono">{bizModel.unit_economics.gross_margin_percentage}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Contribution Margin</span>
              <strong className="text-emerald-400 print:text-emerald-700 font-mono">{bizModel.unit_economics.net_contribution_margin}</strong>
            </div>
          </div>
        )}
      </section>

      {/* Section 5: Capital Allocation */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          5. Capital Allocation & Safety Buffers
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase bg-gray-900 print:bg-gray-100 text-gray-400">
              <tr>
                <th className="py-2.5 px-3">Operational Category</th>
                <th className="py-2.5 px-3">Allocation %</th>
                <th className="py-2.5 px-3">Budget ({currency})</th>
                <th className="py-2.5 px-3">Operational Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 print:divide-gray-200">
              {capitalAlloc.chart_data?.map((c, i) => (
                <tr key={i} className="hover:bg-gray-900/40">
                  <td className="py-2.5 px-3 font-medium text-gray-200 print:text-black">{c.category}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400 print:text-black">{c.percentage}%</td>
                  <td className="py-2.5 px-3 font-mono text-gray-100 print:text-black">{currency} {Number(c.amount).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-gray-400 print:text-gray-600">Deployment across Month 0 - 3</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 6: Revenue Scenarios & Break-even */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          6. Cost Analysis, Revenue Scenarios & Break-Even
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["conservative", "baseline", "optimistic"].map((sc) => {
            const data = revScenarios[sc] || {};
            return (
              <div key={sc} className="p-4 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200 space-y-2">
                <h4 className="text-xs font-bold text-white print:text-black uppercase">{data.label || sc}</h4>
                <div className="text-base font-extrabold text-cyan-400 print:text-cyan-800 font-mono">
                  {currency} {Number(data.year1_revenue || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-gray-400 space-y-0.5">
                  <div>Break-even: <strong>Month {data.break_even_month}</strong></div>
                  <div>Daily Volume: <strong>{data.assumed_daily_orders}</strong></div>
                  <div>Net Margin: <strong>{data.net_profit_margin_yr1}</strong></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-gray-900/60 print:bg-gray-100 rounded-xl border border-gray-800 text-xs text-gray-400 italic">
          * Note: All financial projections are models based on industry averages, subject to actual customer conversion and marketing execution.
        </div>
      </section>

      {/* Section 7: Statutory Compliance Checklist */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          7. Statutory Compliance & Legal Verification Checklist
        </h2>
        
        <div className="space-y-2.5">
          {compliance.checklist?.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-gray-200 print:text-black flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.mandatory && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Mandatory
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400">{item.authority} ? Timeline: {item.timeline}</div>
              </div>
              <span className="text-gray-300 font-mono text-xs">{item.estimated_cost}</span>
            </div>
          ))}
        </div>

        {compliance.disclaimer && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
            {compliance.disclaimer}
          </div>
        )}
      </section>

      {/* Section 8: 9-Phase Launch Roadmap */}
      <RoadmapTimeline roadmap={roadmap} />

      {/* Section 9: Risk Register */}
      <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 print:border-gray-300 print:bg-white">
        <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-gray-800 print:border-gray-300 pb-3">
          8. Risk Register & Mitigation Strategy
        </h2>
        
        <div className="space-y-3">
          {risks.map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-200 print:text-black">{r.risk}</span>
                <RiskBadge severity={r.severity} />
              </div>
              <p className="text-gray-400"><strong>Mitigation:</strong> {r.mitigation}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
