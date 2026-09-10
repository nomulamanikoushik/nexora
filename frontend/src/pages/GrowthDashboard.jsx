import React, { useState, useEffect } from "react";
import { getPlan, listPlans } from "../api/client";
import {
  BarChart,
  RefreshCw,
  Sparkles,
  UserPlus,
  Trophy,
  Building,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function GrowthDashboard({ setActivePage, plan: propPlan }) {
  const [plan, setPlan] = useState(propPlan || null);
  const [loading, setLoading] = useState(!propPlan);

  useEffect(() => {
    if (propPlan) {
      setPlan(propPlan);
      setLoading(false);
      return;
    }
    async function loadData() {
      try {
        const savedId = localStorage.getItem("nexora_last_plan_id");
        if (savedId) {
          const res = await getPlan(savedId);
          setPlan(res);
        } else {
          const plansList = await listPlans();
          if (plansList && plansList.length > 0) {
            const res = await getPlan(plansList[0].id);
            setPlan(res);
          }
        }
      } catch (err) {
        console.error("Failed to load plan for growth dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [propPlan]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Assembling Business Growth Engine...</p>
        </div>
      </div>
    );
  }

  const growthData = plan?.growth_plan || {
    retention_engine: {
      strategy: "Automated Replenishment & VIP Club",
      cycle_interval: "14 to 21 Days (consumption cycle for household snack packs)",
      tactics: [
        { program: "Smart Reorder WhatsApp Triggers", trigger: "Day 12 post-delivery", mechanism: "Automated friendly prompt: 'Running low on your favorite NutriCrunch batch? Reply 1 to reorder with free doorstep delivery!'" },
        { program: "Weekly / Bi-Weekly Snack Box Subscription", trigger: "After 2 successful individual orders", mechanism: "Offer 12% recurring discount + free seasonal trial pouch for automated fortnightly deliveries." },
        { program: "VIP Inner Circle Perks", trigger: "Customers who cross 4 orders", mechanism: "Access to secret menu launches, customized low-sugar/keto blends, and personal founder birthday gifts." }
      ],
      projected_repeat_rate: "42% within 60 days"
    },
    referral_loops: {
      program_name: "Spread the Crunch / Wellness Circle",
      loop_mechanic: "Two-Sided Neighbor Reward",
      user_incentive: "₹ 100 wallet credit on their next replenishment",
      friend_incentive: "₹ 100 off their first tasting box + free mini pouch",
      viral_coefficient_target: "1.32 (every 10 buyers bring ~3 new organic customers)",
      distribution_methods: [
        "QR code printed directly on luxury biodegradable snack pouch reverse",
        "1-click WhatsApp referral share link generated upon order confirmation",
        "Tasting Box gift tags for gifting to colleagues and gym buddies"
      ]
    },
    growth_milestones: [
      {
        timeframe: "Month 3 (Product-Market Fit & Repeat Validation)",
        active_customers: "150+ monthly active households",
        monthly_revenue: "₹ 85,000",
        repeat_customer_ratio: "36%",
        key_focus: "Menu standardization, airtight automated packaging, and consistent 5-star Google review velocity."
      },
      {
        timeframe: "Month 6 (Unit Profitability & Micro-Expansion)",
        active_customers: "450+ recurring customers",
        monthly_revenue: "₹ 2,40,000",
        repeat_customer_ratio: "48%",
        key_focus: "Hiring 1 part-time culinary prep assistant, expanding delivery radius to 15km via local hyper-courier."
      },
      {
        timeframe: "Month 12 (Scale, B2B & Omni-Channel Presence)",
        active_customers: "1,200+ direct consumers + 8 corporate clients",
        monthly_revenue: "₹ 6,20,000",
        repeat_customer_ratio: "54%",
        key_focus: "Corporate gifting lines for Diwali/Festive seasons, supply placement in 12 premium organic grocers in Hyderabad."
      }
    ],
    expansion_playbook: [
      {
        vector: "Adjacent SKU Line Expansion",
        description: "Expand from seed snacks into artisanal roasted muesli, cold-pressed snack bars, and customized diabetic-friendly savory mixes."
      },
      {
        vector: "B2B Corporate Wellness & Gifting",
        description: "Package branded executive snack hampers for tech startups and IT companies for employee wellness kits and annual client gifting."
      },
      {
        vector: "Cloud Micro-Hub / Dedicated Production Kitchen",
        description: "Transition from home kitchen to a dedicated certified commercial micro-facility when monthly order volume exceeds 800 boxes."
      }
    ],
    growth_kpis: [
      { metric: "Customer Lifetime Value (LTV)", target: "₹ 3,600", benchmark: "Based on 8 repeat orders over 12 months" },
      { metric: "Customer Acquisition Cost (CAC)", target: "₹ 55 blended", benchmark: "Direct + community + referral mix" },
      { metric: "LTV / CAC Ratio", target: "6.5x", benchmark: "Exceptional capital efficiency (Industry benchmark > 3.0x)" },
      { metric: "Monthly Repeat Purchase Rate", target: "45%+", benchmark: "High stickiness in wellness & consumables" },
      { metric: "Net Promoter Score (NPS)", target: "72", benchmark: "World-class word-of-mouth promoter density" }
    ]
  };

  const ret = growthData.retention_engine;
  const ref = growthData.referral_loops;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm mb-1">
              <Sparkles className="w-5 h-5" />
              <span>BUSINESS SCALING & RETENTION ENGINE</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Business Growth & Scaling Strategy
            </h1>
            <p className="text-slate-400 mt-1">
              Long-term growth architecture: customer retention loops, viral referral math, 12-month scaling roadmap, and unit KPIs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage ? setActivePage("first_customers") : null}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition border border-slate-700 flex items-center gap-2"
            >
              <span>First Customers Playbook</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage ? setActivePage("plan") : null}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 transition flex items-center gap-2"
            >
              <span>Executive Blueprint</span>
              <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Growth Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target LTV / CAC</span>
            <p className="text-3xl font-bold text-violet-400 mt-2">6.5x</p>
            <p className="text-xs text-emerald-400 mt-1">High capital efficiency (&gt;3.0x industry target)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Viral Coefficient</span>
            <p className="text-3xl font-bold text-white mt-2">{ref?.viral_coefficient_target?.split(" ")[0] || "1.32"}</p>
            <p className="text-xs text-indigo-400 mt-1">Organic customer multiplication</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">60-Day Repeat Rate</span>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{ret?.projected_repeat_rate?.split(" ")[0] || "42%"}</p>
            <p className="text-xs text-slate-400 mt-1">Recurring replenishment model</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Month 12 Target</span>
            <p className="text-3xl font-bold text-white mt-2">₹ 6.2 Lakh/mo</p>
            <p className="text-xs text-violet-400 mt-1">1,200+ direct consumers + B2B</p>
          </div>
        </div>

        {/* SECTION 1: 1-Year Growth Milestones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>12-Month Growth & Scaling Trajectory</span>
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Structured scaling phases with realistic revenue targets, customer acquisition volume, and operational focuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {growthData.growth_milestones?.map((m, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Milestone {idx + 1}</span>
                    <span className="px-2.5 py-0.5 bg-violet-950 text-violet-300 text-xs font-semibold rounded-full border border-violet-800">
                      {m.monthly_revenue}/mo
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{m.timeframe}</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Customers:</span>
                      <span className="font-semibold text-slate-200">{m.active_customers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Repeat Ratio:</span>
                      <span className="font-semibold text-emerald-400">{m.repeat_customer_ratio}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-slate-200 block mb-1">Execution Focus:</span>
                    {m.key_focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Retention Engine & Referral Loops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retention Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400" />
                <span>Customer Retention Engine</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold">{ret?.projected_repeat_rate}</span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Replenishment Cadence</span>
                <p className="text-sm font-semibold text-white mt-1">{ret?.cycle_interval}</p>
              </div>

              <div className="space-y-3">
                {ret?.tactics?.map((t, tIdx) => (
                  <div key={tIdx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-300">{t.program}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px]">{t.trigger}</span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{t.mechanism}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-400" />
                <span>Viral Referral Program</span>
              </h2>
              <span className="text-xs text-violet-400 font-semibold">Viral Coeff: {ref?.viral_coefficient_target?.split(" ")[0]}</span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-medium">Two-Sided Incentive Mechanics</span>
                <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Existing Customer:</span>
                    <span className="font-bold text-emerald-400">{ref?.user_incentive}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Referred Friend:</span>
                    <span className="font-bold text-indigo-300">{ref?.friend_incentive}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-medium text-slate-400">Distribution Channels:</span>
                {ref?.distribution_methods?.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Expansion Vectors & Growth KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building className="w-5 h-5 text-emerald-400" />
              <span>Expansion Vectors (Month 6 - 12)</span>
            </h2>

            <div className="space-y-3.5">
              {growthData.expansion_playbook?.map((exp, eIdx) => (
                <div key={eIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 text-sm">{exp.vector}</span>
                  <p className="text-slate-300 leading-relaxed mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BarChart className="w-5 h-5 text-indigo-400" />
              <span>Unit Economics & Growth KPIs</span>
            </h2>

            <div className="space-y-3">
              {growthData.growth_kpis?.map((k, kIdx) => (
                <div key={kIdx} className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="font-semibold text-white block">{k.metric}</span>
                    <span className="text-slate-400 text-[11px]">{k.benchmark}</span>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
                    {k.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
