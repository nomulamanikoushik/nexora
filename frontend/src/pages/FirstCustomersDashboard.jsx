import React, { useState, useEffect } from "react";
import { getPlan, listPlans } from "../api/client";
import { 
  Rocket, 
  Users, 
  CheckCircle, 
  ClipboardCheck, 
  Coins, 
  Tag,
  Sparkles,
  ArrowRight,
  MessageSquare
} from "lucide-react";

export default function FirstCustomersDashboard({ setActivePage, plan: propPlan }) {
  const [plan, setPlan] = useState(propPlan || null);
  const [loading, setLoading] = useState(!propPlan);
  const [copied, setCopied] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

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
        console.error("Failed to load plan for early revenue dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [propPlan]);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const copyScript = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Assembling Early Revenue Playbook...</p>
        </div>
      </div>
    );
  }

  // Fallback data if plan is empty or lacks early_revenue_plan
  const earlyPlan = plan?.early_revenue_plan || {
    first_10_playbook: {
      title: "First 10 Customers in 7 Days (Zero Ad Spend)",
      objective: "Acquire 10 verified paying customers within 7 days using high-trust direct networks.",
      script_template: "Hey! I just prepared our very first batch of fresh artisanal healthy snacks this morning. I'd love to drop off a tasting box at your doorstep. If you love it, our launch box is 25% off this week!",
      tactics: [
        { step: 1, tactic: "Warm Inner Circle Beta Drop", action: "Deliver sample boxes to 25 friends and family members with a personal handwritten founder note asking for honest feedback.", target_conversion: "8 paid orders immediately." },
        { step: 2, tactic: "Hyperlocal Community WhatsApp Groups", action: "Post a friendly founder story in apartment and society groups with 20 free tasting pouches.", target_conversion: "Converts 5 paid orders." },
        { step: 3, tactic: "Direct 30-Second Voice Notes", action: "Send personal voice notes explaining your launch mission to 15 health-conscious colleagues.", target_conversion: "Generates 4-6 orders." }
      ]
    },
    action_plan_30_days: [
      {
        week: "Week 1 (Days 1 - 7)",
        theme: "The Foundation & Warm Launch",
        milestone: "10 Paying Customers Acquired",
        checklist: [
          "Finalize packaging, hygiene seals, and batch labeling",
          "Distribute 25 beta tasting pouches to warm network",
          "Capture 10 video/photo testimonials and reviews",
          "Secure first 10 paying customer orders via WhatsApp UPI"
        ]
      },
      {
        week: "Week 2 (Days 8 - 14)",
        theme: "Community Activation & Partner Tastings",
        milestone: "25 Total Customers Reached",
        checklist: [
          "Introduce the 'Founder Launch Bundle' at introductory price",
          "Partner with 2 local fitness studios / boutique cafes for sampling counters",
          "Host a weekend tasting pop-up table in apartment clubhouse",
          "Establish a dedicated VIP WhatsApp broadcast community"
        ]
      },
      {
        week: "Week 3 (Days 15 - 21)",
        theme: "Referral Engine & Micro-Influencer Gifting",
        milestone: "40 Total Customers Reached",
        checklist: [
          "Send personalized snack care packages to 8 local micro-influencers (<15k followers)",
          "Launch the 'Give ₹50, Get ₹50' neighbor referral card inside every delivery box",
          "Audit repeat order rate from Week 1 buyers and request reorders",
          "Optimize delivery logistics / courier turnaround under 24 hours"
        ]
      },
      {
        week: "Week 4 (Days 22 - 30)",
        theme: "Repeat Cadence & Milestone Review",
        milestone: "50+ Customers & Month 1 Break-Even Progress",
        checklist: [
          "Introduce weekly/monthly auto-replenishment subscription boxes",
          "Reach out to 3 local corporate HR / admin teams for pantry snack trials",
          "Calculate first-month unit margins, repeat rates, and customer feedback",
          "Celebrate 50 customer milestone with exclusive 'Founding Member' perks"
        ]
      }
    ],
    launch_offer: {
      offer_name: `${plan?.profile?.business_name || "NutriBites"} Founding Member Launch Box`,
      normal_value: "₹ 580",
      launch_price: "₹ 350",
      discount_percentage: "25% Off + Free Surprise Snack Pouch",
      unit_cogs: "₹ 160",
      unit_gross_margin: "₹ 190 (54.3%)",
      break_even_volume: "125 units/month to cover operational baseline"
    },
    funnel_metrics: {
      projected_leads: 350,
      samples_distributed: 120,
      first_purchases_month_1: 180,
      conversion_rate_sample_to_paid: "42%",
      target_early_cac: "₹ 45",
      estimated_month_1_revenue: "₹ 63,000",
      estimated_month_1_gross_profit: "₹ 34,200"
    }
  };

  const p10 = earlyPlan.first_10_playbook;
  const offer = earlyPlan.launch_offer;
  const funnel = earlyPlan.funnel_metrics;
  const currency = plan?.profile?.currency || "INR";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
              <Rocket className="w-5 h-5" />
              <span>EARLY REVENUE ACCELERATION ENGINE</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Get Your First Customers
            </h1>
            <p className="text-slate-400 mt-1">
              Tactical, zero-ad-spend playbooks to acquire your first 10 and 50 paying customers for{" "}
              <span className="text-indigo-300 font-medium">{plan?.profile?.business_name || "Your Venture"}</span>{" "}
              in {plan?.profile?.location || "your target market"}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage ? setActivePage("plan") : null}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition border border-slate-700 flex items-center gap-2"
            >
              <span>View Full Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage ? setActivePage("growth") : null}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
            >
              <span>Growth Engine</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Day 1-7 Sprint</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">10 Buyers</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Zero paid ads needed</span>
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Day 8-30 Goal</span>
              <Rocket className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">50+ Buyers</p>
            <p className="text-xs text-indigo-400 mt-1">Organic community referral</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Early CAC</span>
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{funnel?.target_early_cac || "₹ 45"}</p>
            <p className="text-xs text-slate-400 mt-1">Direct sampling & word-of-mouth</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Launch Gross Margin</span>
              <Tag className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{offer?.unit_gross_margin?.split(" ")[1] || "54%"}</p>
            <p className="text-xs text-emerald-400 mt-1">Healthy per-unit contribution</p>
          </div>
        </div>

        {/* SECTION 1: First 10 Customers Playbook */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WEEK 1 PLAYBOOK</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{p10?.title}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{p10?.objective}</p>
            </div>
          </div>

          {/* Tactics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {p10?.tactics?.map((t, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-sm flex items-center justify-center border border-indigo-500/30">
                      {t.step}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Tactic</span>
                  </div>
                  <h3 className="font-semibold text-white text-base">{t.tactic}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{t.action}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Conversion:</span>
                  <span className="text-emerald-400 font-medium">{t.target_conversion}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Copy-paste script card */}
          {p10?.script_template && (
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span>Ready-to-Use Founder Outreach Script (WhatsApp & DM)</span>
                </div>
                <button
                  onClick={() => copyScript(p10.script_template)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 shadow-sm"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>{copied ? "Copied to Clipboard!" : "Copy Script"}</span>
                </button>
              </div>
              <p className="text-slate-200 text-sm italic font-mono bg-slate-950/60 p-4 rounded-lg border border-slate-800 leading-relaxed">
                "{p10.script_template}"
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: 30-Day Launch Action Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">30-Day Launch Execution Roadmap</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Interactive weekly checklists to track your progress from day 1 prep to 50 recurring customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {earlyPlan.action_plan_30_days?.map((w, wIdx) => (
              <div key={wIdx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{w.week}</span>
                    <h3 className="text-base font-semibold text-white mt-0.5">{w.theme}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-800">
                    {w.milestone}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {w.checklist?.map((task, tIdx) => {
                    const taskId = `w${wIdx}_t${tIdx}`;
                    const isDone = !!completedTasks[taskId];
                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                          isDone 
                            ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-200 line-through" 
                            : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="mt-0.5 h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                        />
                        <span className="flex-1 leading-relaxed">{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Irresistible Launch Offer & Unit Economics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                <span>Launch Offer Generator</span>
              </h2>
              <span className="text-xs px-2.5 py-1 bg-amber-950 text-amber-300 font-semibold rounded-full border border-amber-800">
                {offer?.discount_percentage}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Offer Package Name</span>
                <p className="text-lg font-bold text-white">{offer?.offer_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Standard Value</span>
                  <p className="text-xl font-bold text-slate-400 line-through mt-1">{offer?.normal_value}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/50">
                  <span className="text-xs text-emerald-400 font-semibold">Launch Price</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{offer?.launch_price}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Unit COGS:</span>
                  <span className="font-semibold text-slate-200">{offer?.unit_cogs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unit Contribution Margin:</span>
                  <span className="font-semibold text-emerald-400">{offer?.unit_gross_margin}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Monthly Break-even Target:</span>
                  <span className="font-semibold text-indigo-300">{offer?.break_even_volume}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Sales Funnel Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-indigo-400" />
                <span>Month 1 Early Funnel</span>
              </h2>
              <span className="text-xs text-slate-400">Conversion Benchmarks</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">1. Neighborhood Leads Reached</span>
                  <span className="font-semibold text-white">{funnel?.projected_leads}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">2. Free Tasting Samples Distributed</span>
                  <span className="font-semibold text-indigo-300">{funnel?.samples_distributed}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">3. Paid First Orders Converted</span>
                  <span className="font-semibold text-emerald-400">{funnel?.first_purchases_month_1}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "52%" }}></div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Month 1 Gross Revenue</span>
                  <p className="text-lg font-bold text-white mt-0.5">{funnel?.estimated_month_1_revenue}</p>
                </div>
                <div>
                  <span className="text-slate-400">Month 1 Gross Profit</span>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">{funnel?.estimated_month_1_gross_profit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
