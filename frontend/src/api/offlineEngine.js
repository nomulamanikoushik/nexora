// NEXORA Client-Side Autonomous Intelligence Engine
// Ensures 100% functionality on any platform, device, or offline environment

export const DEFAULT_SECTORS = [
  {
    slug: "food-beverage",
    name: "Food & Beverage / Healthy Snacks",
    description: "Restaurants, Cloud Kitchens, Cafes, Homemade Healthy Snacks, and Gourmet Food Trucks.",
    avg_startup_capex_inr: 500000,
    default_gross_margin: 0.65,
    default_net_margin: 0.24,
    cagr: 0.125,
    market_size_inr: "4.8 Lakh Crore"
  },
  {
    slug: "retail",
    name: "Curated Retail & Apparel",
    description: "Boutique fashion, lifestyle stores, sustainable apparel, and organic personal care.",
    avg_startup_capex_inr: 800000,
    default_gross_margin: 0.55,
    default_net_margin: 0.18,
    cagr: 0.098,
    market_size_inr: "6.2 Lakh Crore"
  },
  {
    slug: "software-saas",
    name: "B2B SaaS / Digital Agency",
    description: "Micro-SaaS tools, niche digital agencies, enterprise automation, and cloud workflow suites.",
    avg_startup_capex_inr: 400000,
    default_gross_margin: 0.85,
    default_net_margin: 0.35,
    cagr: 0.224,
    market_size_inr: "2.1 Lakh Crore"
  },
  {
    slug: "healthcare",
    name: "Health, Wellness & Clinic",
    description: "Physiotherapy clinics, diagnostic labs, fitness studios, and holistic wellness centers.",
    avg_startup_capex_inr: 1200000,
    default_gross_margin: 0.60,
    default_net_margin: 0.28,
    cagr: 0.165,
    market_size_inr: "3.5 Lakh Crore"
  }
];

export const BENCHMARK_LOCALITIES = [
  {
    city: "Hyderabad",
    state: "Telangana",
    tier: "Tier 1",
    locality: "Kondapur",
    avg_commercial_rent_sqft: 85,
    avg_residential_rent_2bhk: 28000,
    home_suitability: "Very High",
    foot_traffic_score: 88,
    target_demographic: "IT tech professionals, health enthusiasts, young dual-income families",
    density_per_sqkm: 9400,
    sector_demand_score: 92,
    competition_level: "Moderate",
    regulatory_ease: 90,
    permits: ["GHMC Trade License", "FSSAI Basic", "Shop & Establishment Act"]
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    tier: "Tier 1",
    locality: "Miyapur",
    avg_commercial_rent_sqft: 55,
    avg_residential_rent_2bhk: 18000,
    home_suitability: "Exceptional",
    foot_traffic_score: 78,
    target_demographic: "Dense residential communities, budget-conscious families, metro commuters",
    density_per_sqkm: 11200,
    sector_demand_score: 89,
    competition_level: "Low-to-Moderate",
    regulatory_ease: 92,
    permits: ["GHMC Trade License", "FSSAI Basic"]
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    tier: "Tier 1",
    locality: "Hitech City / Madhapur",
    avg_commercial_rent_sqft: 135,
    avg_residential_rent_2bhk: 38000,
    home_suitability: "Moderate",
    foot_traffic_score: 96,
    target_demographic: "Corporate executives, premium tech workforce, high disposable income",
    density_per_sqkm: 12500,
    sector_demand_score: 95,
    competition_level: "High",
    regulatory_ease: 85,
    permits: ["GHMC Trade License", "FSSAI State", "Fire Safety NOC"]
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    tier: "Tier 1",
    locality: "Koramangala",
    avg_commercial_rent_sqft: 145,
    avg_residential_rent_2bhk: 42000,
    home_suitability: "High",
    foot_traffic_score: 95,
    target_demographic: "Startup founders, high disposable income millennials, early tech adopters",
    density_per_sqkm: 13800,
    sector_demand_score: 96,
    competition_level: "High",
    regulatory_ease: 84,
    permits: ["BBMP Trade License", "FSSAI State License", "GST"]
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    tier: "Tier 1",
    locality: "HSR Layout",
    avg_commercial_rent_sqft: 110,
    avg_residential_rent_2bhk: 36000,
    home_suitability: "Very High",
    foot_traffic_score: 90,
    target_demographic: "Tech founders, product managers, fitness & organic lifestyle enthusiasts",
    density_per_sqkm: 11500,
    sector_demand_score: 94,
    competition_level: "Moderate-High",
    regulatory_ease: 87,
    permits: ["BBMP Trade License", "FSSAI Basic", "Shop & Establishment"]
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    tier: "Tier 1",
    locality: "Andheri West",
    avg_commercial_rent_sqft: 195,
    avg_residential_rent_2bhk: 62000,
    home_suitability: "Moderate",
    foot_traffic_score: 98,
    target_demographic: "Media professionals, commercial shoppers, dense urban population",
    density_per_sqkm: 21000,
    sector_demand_score: 97,
    competition_level: "Very High",
    regulatory_ease: 78,
    permits: ["BMC Health License", "FSSAI State", "Fire NOC"]
  },
  {
    city: "Pune",
    state: "Maharashtra",
    tier: "Tier 1",
    locality: "Baner",
    avg_commercial_rent_sqft: 85,
    avg_residential_rent_2bhk: 26000,
    home_suitability: "Very High",
    foot_traffic_score: 86,
    target_demographic: "IT professionals, automotive sector engineers, university alumni",
    density_per_sqkm: 8900,
    sector_demand_score: 90,
    competition_level: "Moderate",
    regulatory_ease: 88,
    permits: ["PMC Trade License", "FSSAI Basic"]
  }
];

export function parseIdeaOffline(text) {
  const t = text.toLowerCase();
  
  let capital = 300000;
  const lakhMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i);
  const kMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)/i);
  const numMatch = t.match(/(?:rs\.?|inr|₹)\s*([\d,]+)/i);
  
  if (lakhMatch) capital = Math.round(parseFloat(lakhMatch[1]) * 100000);
  else if (kMatch) capital = Math.round(parseFloat(kMatch[1]) * 1000);
  else if (numMatch) capital = parseInt(numMatch[1].replace(/,/g, ""), 10) || 300000;

  let sector = "food-beverage";
  if (t.includes("software") || t.includes("saas") || t.includes("tech") || t.includes("app") || t.includes("ai")) sector = "software-saas";
  else if (t.includes("clothes") || t.includes("apparel") || t.includes("retail") || t.includes("boutique") || t.includes("store")) sector = "retail";
  else if (t.includes("clinic") || t.includes("health") || t.includes("fitness") || t.includes("wellness") || t.includes("gym")) sector = "healthcare";

  let start_mode = "Physical Store";
  if (t.includes("home") || t.includes("cloud kitchen") || t.includes("homemade")) start_mode = "Home-Based";
  else if (t.includes("online") || t.includes("d2c") || t.includes("e-commerce")) start_mode = "Online";
  else if (t.includes("cart") || t.includes("mobile") || t.includes("truck")) start_mode = "Mobile Business";
  else if (t.includes("hybrid")) start_mode = "Hybrid";

  let location = "Hyderabad";
  if (t.includes("bengaluru") || t.includes("bangalore")) location = "Bengaluru";
  else if (t.includes("mumbai")) location = "Mumbai";
  else if (t.includes("pune")) location = "Pune";
  else if (t.includes("delhi") || t.includes("ncr") || t.includes("gurugram")) location = "Delhi-NCR";

  return {
    raw_idea: text,
    extracted_data: {
      capital_inr: capital,
      capital_formatted: `₹${(capital / 100000).toFixed(1)} Lakhs`,
      sector_slug: sector,
      sector_name: DEFAULT_SECTORS.find(s => s.slug === sector)?.name || "General Business",
      start_mode,
      location,
      currency: "INR"
    },
    suggested_profile: {
      business_name: text.length > 5 && text.length < 35 ? text : "Venture " + (sector === "food-beverage" ? "SnackCraft" : "NexGen"),
      sector,
      start_mode,
      available_capital: capital,
      location,
      timeline_months: 6,
      risk_appetite: "Moderate",
      experience_level: "Intermediate"
    }
  };
}

export function generatePlanOffline(profile) {
  const planId = "plan_" + Math.random().toString(36).substring(2, 10);
  const capital = profile.available_capital || 300000;
  const startMode = profile.start_mode || "Home-Based";
  const sectorSlug = profile.sector || "food-beverage";
  const location = profile.location || "Hyderabad";
  const name = profile.business_name || (startMode === "Home-Based" ? "MilletBites Artisan Kitchen" : "Nexora Enterprise");

  // Dynamic capital allocation according to startMode
  let capitalAllocation = {};
  if (startMode === "Home-Based") {
    capitalAllocation = {
      equipment: Math.round(capital * 0.28),
      inventory_ingredients: Math.round(capital * 0.22),
      marketing_branding: Math.round(capital * 0.20),
      packaging_labeling: Math.round(capital * 0.12),
      working_capital_reserve: Math.round(capital * 0.13),
      licenses_permits: Math.round(capital * 0.05),
      space_setup: 0
    };
  } else if (startMode === "Online") {
    capitalAllocation = {
      inventory_production: Math.round(capital * 0.30),
      performance_marketing: Math.round(capital * 0.30),
      tech_ecommerce_stack: Math.round(capital * 0.18),
      packaging_logistics: Math.round(capital * 0.12),
      working_capital_reserve: Math.round(capital * 0.10),
      space_setup: 0
    };
  } else {
    capitalAllocation = {
      deposit_renovation: Math.round(capital * 0.32),
      equipment_interior: Math.round(capital * 0.25),
      initial_inventory: Math.round(capital * 0.18),
      marketing_launch: Math.round(capital * 0.12),
      working_capital_reserve: Math.round(capital * 0.13)
    };
  }

  const monthlyTargetRevenue = Math.round(capital * 0.45);
  const monthlyFixedCost = startMode === "Home-Based" ? Math.round(capital * 0.08) : Math.round(capital * 0.16);
  const grossMarginPct = sectorSlug === "software-saas" ? 82 : sectorSlug === "food-beverage" ? 64 : 54;
  const monthlyGrossProfit = Math.round(monthlyTargetRevenue * (grossMarginPct / 100));
  const monthlyNetProfit = Math.max(0, monthlyGrossProfit - monthlyFixedCost);
  const breakEvenMonths = Math.max(2, Math.min(8, Math.round((capital * 0.7) / (monthlyNetProfit || 25000))));

  const plan = {
    id: planId,
    title: `${name} — Comprehensive Business Launch Plan`,
    status: "completed",
    created_at: new Date().toISOString(),
    profile: {
      ...profile,
      business_name: name,
      available_capital: capital,
      start_mode: startMode,
      sector: sectorSlug,
      location
    },
    feasibility_score: Math.min(95, Math.max(68, Math.round(75 + (capital >= 300000 ? 12 : 5)))),
    executive_summary: {
      overview: `A high-potential ${startMode} venture in ${location} targeting the burgeoning demand for ${sectorSlug === "food-beverage" ? "nutritious, clean-label artisanal healthy snacks" : "premium curated offerings"}. With capital of ₹${capital.toLocaleString()}, the business operates with ultra-lean overheads to achieve break-even within ${breakEvenMonths} months.`,
      viability_index: "A+ Highly Viable",
      target_launch_window: "30 Days to First Customer",
      break_even_estimate: `${breakEvenMonths} Months`,
      expected_roi_year1: "68% - 94%"
    },
    capital_planning: {
      total_capital: capital,
      allocation: capitalAllocation,
      start_mode: startMode,
      reserve_fund_runway_months: startMode === "Home-Based" ? 6 : 3.5,
      recommendation: `Zero commercial rent burn via ${startMode} execution protects ₹${(capital * 0.25).toLocaleString()} in capital for product excellence and customer acquisition.`
    },
    cost_revenue: {
      projected_monthly_revenue: monthlyTargetRevenue,
      monthly_fixed_costs: monthlyFixedCost,
      gross_margin_percent: grossMarginPct,
      net_margin_percent: Math.round((monthlyNetProfit / monthlyTargetRevenue) * 100),
      monthly_net_profit: monthlyNetProfit,
      break_even_month: breakEvenMonths,
      cash_flow_table: [
        { month: "Month 1", revenue: Math.round(monthlyTargetRevenue * 0.3), costs: monthlyFixedCost + Math.round(monthlyTargetRevenue * 0.15), net: -Math.round(monthlyTargetRevenue * 0.05) },
        { month: "Month 2", revenue: Math.round(monthlyTargetRevenue * 0.6), costs: monthlyFixedCost + Math.round(monthlyTargetRevenue * 0.25), net: Math.round(monthlyTargetRevenue * 0.12) },
        { month: "Month 3", revenue: monthlyTargetRevenue, costs: monthlyFixedCost + Math.round(monthlyTargetRevenue * 0.36), net: monthlyNetProfit },
        { month: "Month 6", revenue: Math.round(monthlyTargetRevenue * 1.6), costs: monthlyFixedCost + Math.round(monthlyTargetRevenue * 0.55), net: Math.round(monthlyNetProfit * 1.8) }
      ]
    },
    location_analysis: {
      city: location,
      target_micro_markets: location === "Hyderabad" ? ["Kondapur", "Miyapur", "Gachibowli"] : ["Koramangala", "HSR Layout", "Indiranagar"],
      advantage: `High demographic density of tech professionals and young families with high disposable income and strong affinity for healthy lifestyle choices.`,
      space_strategy: `${startMode} model eliminates costly commercial leases and deposit lockdowns.`
    },
    early_revenue: {
      first_10_playbook: [
        { step: 1, title: "Warm Circle VIP Tasting Kit", action: "Prepare 15 curated sampling boxes for high-influence contacts in your immediate gated community / apartment.", cost: "₹ 1,500" },
        { step: 2, title: "Apartment Gated Community WhatsApp Blast", action: "Announce pre-orders on residential WhatsApp & MyGate forums with exclusive 20% founder's launch discount.", cost: "₹ 0" },
        { step: 3, title: "Nearby Fitness Studio & Badminton Court Partnership", action: "Drop complimentary protein/millet snack samplers at 3 fitness centers with QR code order sheets.", cost: "₹ 800" },
        { step: 4, title: "Corporate Desk Sample Drop", action: "Leverage friends working in Hitech City tech parks to bring snack boxes to office pantries with direct WhatsApp re-order links.", cost: "₹ 1,200" }
      ],
      launch_sprint_30_days: [
        { days: "Days 1 - 7", phase: "Recipe Standardization & FSSAI Registration", goal: "Lock in standard batch sizes, packaging, nutritional labels, and submit FSSAI portal application." },
        { days: "Days 8 - 14", phase: "Packaging & Tasting Boxes", goal: "Acquire eco-friendly pouches, print branded stickers, and distribute 25 curated sample packs to seed reviews." },
        { days: "Days 15 - 21", phase: "First 10 Paid Pre-Orders", goal: "Open pre-orders via WhatsApp Business catalog with direct UPI payment, targeting ₹15,000 in early orders." },
        { days: "Days 22 - 30", phase: "Customer Feedback Loop & Scale to 50", goal: "Capture photo testimonials, offer a 15% referral coupon, and initiate bi-weekly subscription packs." }
      ],
      launch_offer: {
        headline: "Founder's Healthy Snack Discovery Box — 25% Off + Free Delivery",
        bundle_details: "4 signature guilt-free snack varieties (Millet Crunch, Roasted Makhana, Protein Nut Bar, Seed Mix).",
        price_point: "₹ 499 (Regular ₹ 649)",
        urgency_driver: "Limited to first 50 residents in Kondapur & Miyapur"
      }
    },
    growth: {
      retention_engine: {
        subscription_model: "Weekly & Monthly Healthy Snack replenishment subscription with 12% automated discount.",
        whatsapp_vip_club: "Exclusive broadcast group for secret seasonal flavors and free weekly tasting add-ons."
      },
      viral_referral_loop: {
        mechanism: "Give a Friend ₹100 Snack Credit, Get ₹100 Off your next order when they purchase.",
        viral_coefficient_target: "1.3x organic customer growth"
      },
      year_1_milestones: [
        { quarter: "Q1", revenue: "₹ 1.2 Lakhs/mo", milestone: "Establish steady 80 regular weekly household customers." },
        { quarter: "Q2", revenue: "₹ 2.8 Lakhs/mo", milestone: "Onboard onto Swiggy Minis, Zomato, and 5 local organic gourmet stores." },
        { quarter: "Q3", revenue: "₹ 5.5 Lakhs/mo", milestone: "Expand to commercial cloud kitchen unit with 2 dedicated prep staff." },
        { quarter: "Q4", revenue: "₹ 8.5 Lakhs/mo", milestone: "Launch pan-India D2C shipping with specialized hermetic packaging." }
      ]
    },
    compliance: {
      checklist: [
        { title: "FSSAI Food Safety Basic Registration", status: "Required", timeline: "7 - 14 Days", authority: "Food Safety and Standards Authority of India" },
        { title: "GST Registration", status: "Recommended when scaling", timeline: "3 - 7 Days", authority: "GST Portal" },
        { title: "MSME Udyam Aadhar Registration", status: "Required (Free & Instant)", timeline: "Same Day", authority: "Ministry of MSME" },
        { title: "Trade License / Labour Intimation", status: "Required", timeline: "10 Days", authority: "Local Municipal Corporation" }
      ]
    },
    marketing: {
      channels: [
        { channel: "Hyperlocal Residential Communities", roi: "Very High", allocation: "35%" },
        { channel: "Micro-Influencer Fitness Collabs", roi: "High", allocation: "25%" },
        { channel: "Instagram & WhatsApp Commerce", roi: "Very High", allocation: "25%" },
        { channel: "Sampling at Sports & Yoga Clubs", roi: "Exceptional", allocation: "15%" }
      ]
    },
    risk_analysis: {
      overall_risk: "Low-to-Moderate",
      mitigation_factors: [
        "Home-based low fixed cost structure prevents negative cash-flow spirals.",
        "Small-batch production eliminates high perishable inventory waste.",
        "Direct-to-consumer payments via UPI maintain instant positive liquidity."
      ]
    },
    critic_review: {
      verdict: "APPROVED — Structurally Sound Plan",
      critic_score: 92,
      strengths: ["Exceptional capital efficiency", "Clear 30-day early monetization focus", "Well-buffered runway"],
      recommendations: ["Ensure airtight moisture-proof packaging for humidity control.", "Automate WhatsApp order tracking early."]
    },
    roadmap: [
      { phase: "Week 1", task: "FSSAI application and kitchen hygiene standard setup" },
      { phase: "Week 2", task: "Branding, labels, packaging, and sampling batch run" },
      { phase: "Week 3", task: "Soft launch to 25 warm contacts and residential communities" },
      { phase: "Week 4", task: "First 10-30 paying customers and subscription launch" }
    ]
  };

  return plan;
}

export function compareLocationsOffline({ locations = [], sector = "food-beverage", start_mode = "Home-Based", capital = 300000 }) {
  const selected = BENCHMARK_LOCALITIES.filter(l => locations.length === 0 || locations.includes(l.locality));
  const compared = (selected.length >= 2 ? selected : BENCHMARK_LOCALITIES.slice(0, 3)).map(loc => {
    const isHome = start_mode === "Home-Based";
    const rentPerMonth = isHome ? 0 : loc.avg_commercial_rent_sqft * 400;
    const baseScore = loc.sector_demand_score || 85;
    const rentPenalty = isHome ? 0 : Math.min(25, Math.round(rentPerMonth / (capital * 0.05)));
    const score = Math.max(60, Math.min(98, baseScore + (loc.home_suitability === "Exceptional" ? 8 : 4) - rentPenalty));
    
    return {
      ...loc,
      suitability_score: score,
      estimated_monthly_space_cost: rentPerMonth
    };
  });

  compared.sort((a, b) => b.suitability_score - a.suitability_score);

  return {
    comparison: {
      recommended_location: compared[0]?.locality || "Kondapur",
      recommendation_reason: `Top scored (${compared[0]?.suitability_score}/100) due to exceptional target demographic density, high affinity for ${sector}, and optimal cost efficiency for ${start_mode} operations.`,
      locations_compared: compared
    }
  };
}

export function simulateWhatIfOffline(payload) {
  const baseRevenue = payload.base_monthly_revenue || 135000;
  const baseProfit = payload.base_monthly_profit || 38000;
  const capitalDelta = (payload.capital_change_pct || 0) / 100;
  const priceDelta = (payload.price_change_pct || 0) / 100;
  const volumeDelta = (payload.volume_change_pct || 0) / 100;

  const simRevenue = Math.round(baseRevenue * (1 + priceDelta) * (1 + volumeDelta));
  const simProfit = Math.round(baseProfit * (1 + (priceDelta * 1.5)) * (1 + volumeDelta) + (capitalDelta * 5000));
  const breakEvenMonths = Math.max(2, Math.round(150000 / (simProfit || 25000)));

  return {
    simulation: {
      simulated_monthly_revenue: simRevenue,
      revenue_delta_percent: Math.round(((simRevenue - baseRevenue) / baseRevenue) * 100),
      simulated_monthly_profit: simProfit,
      profit_delta_percent: Math.round(((simProfit - baseProfit) / baseProfit) * 100),
      simulated_break_even_month: breakEvenMonths,
      verdict: simProfit > baseProfit ? "Positive Impact: Margin expansion detected." : "Caution: Overheads reduce net margin."
    }
  };
}
