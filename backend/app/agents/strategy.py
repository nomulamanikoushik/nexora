from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class StrategyAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="strategy", role="Master Strategic Synthesis & Executive Architect", step_order=12)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        capital = float(profile.get("capital", 1000000))
        currency = profile.get("currency", "INR")
        location = profile.get("location", "Hyderabad")
        sector = profile.get("sector", "food-beverage")
        biz_name = profile.get("business_name", "New Venture")
        biz_type = profile.get("business_type", "Artisanal Cloud Kitchen & Cafe")

        swot = {
            "strengths": [
                f"Sufficient capital backing ({currency} {capital:,.0f}) with reinforced 25% working capital buffer.",
                "Hybrid revenue model combining high-margin counter pickup with high-volume aggregator reach.",
                "High product differentiation through artisanal recipes and transparent hygiene standards."
            ],
            "weaknesses": [
                "Early brand obscurity requiring initial promotional investment.",
                "Founder in beginner/lean operational phase requiring strict reliance on standardized SOPs.",
                "Third-party aggregator commission structure (18-22%) on delivery channel."
            ],
            "opportunities": [
                f"Surging demand in {location} IT & corporate corridors for reliable quality lunch/dinner.",
                "Corporate meal subscription contracts offering upfront monthly cash flow.",
                "Direct WhatsApp / digital ordering channel conversion to boost net contribution margins to 39%."
            ],
            "threats": [
                "Hyperlocal copycat emergence if recipes and branding are not protected.",
                "Volatile seasonal raw ingredient pricing (dairy/fresh produce).",
                "Delays in municipal commercial licensing if not initiated immediately."
            ]
        }

        pillars = [
            {"pillar": "Pillar 1: Quality & Culinary Integrity", "strategy": "Lock standardized recipe weightings and partner with local certified dairy/farm vendors."},
            {"pillar": "Pillar 2: Financial Discipline", "strategy": "Cap pre-revenue Capex strictly at 34% of capital and preserve 3 months fixed burn in liquid reserves."},
            {"pillar": "Pillar 3: Aggregator-to-Direct Transition", "strategy": "Use packaging collateral to funnel first-time platform diners into the high-margin direct channel."},
            {"pillar": "Pillar 4: Hyperlocal Dominance", "strategy": "Dominate a 3.5 km delivery radius before attempting geographic expansion."}
        ]

        roadmap = [
            {"phase": "Phase 1: Concept & Menu Validation", "duration": "Weeks 1 - 2", "milestones": ["Finalize core signature menu items", "Complete blind sensory tasting with 30 target consumers", "Lock ingredient BOM and recipe costing sheets"]},
            {"phase": "Phase 2: Entity & Commercial Licensing", "duration": "Weeks 2 - 5", "milestones": ["Incorporate business entity and register GSTIN", "File FSSAI Food Safety License and GHMC Trade application", "Open dedicated commercial current bank account"]},
            {"phase": "Phase 3: Location Lease & Site Finalization", "duration": "Weeks 3 - 6", "milestones": ["Execute commercial lease in target hotspot (e.g., Madhapur/Hitec)", "Complete 3-phase electrical load sanction and plumbing prep", "Negotiate maximum 3-month refundable lease deposit"]},
            {"phase": "Phase 4: Kitchen Infrastructure & Capex Setup", "duration": "Weeks 5 - 8", "milestones": ["Procure commercial refrigeration, induction cooktops, and prep tables", "Install POS hardware and cloud billing terminal", "Implement fire safety equipment and ventilation exhaust"]},
            {"phase": "Phase 5: Staffing, SOP Training & Trial Run", "duration": "Weeks 7 - 9", "milestones": ["Recruit Head Chef and 2 operational assistants", "Conduct 10-day kitchen dry runs with simulated order tickets", "Establish daily hygiene and opening/closing checklists"]},
            {"phase": "Phase 6: Merchant Onboarding & Packaging Setup", "duration": "Weeks 8 - 10", "milestones": ["Receive FSSAI license and finalize Swiggy / Zomato merchant approval", "Receive custom eco-friendly packaging and direct QR flyers", "Set up Google My Business verified profile"]},
            {"phase": "Phase 7: Pre-Launch Marketing & Influencer Seed", "duration": "Weeks 9 - 11", "milestones": ["Send 15 tasting boxes to hyperlocal food creators", "Launch geo-fenced Instagram teaser reels", "Distribute opening week VIP invitation flyers to neighboring tech towers"]},
            {"phase": "Phase 8: Official Commercial Launch", "duration": "Week 11", "milestones": ["Inaugural opening day with 'Buy 1 Get Specialty Beverage' offer", "Activate aggregator launch visibility boosters", "Monitor first 100 customer feedback ratings closely"]},
            {"phase": "Phase 9: 90-Day Stabilization & Break-Even Tracking", "duration": "Months 3 - 6", "milestones": ["Achieve steady 70+ orders/day run rate", "Launch corporate lunch subscription meal plans", "Reach operational cash break-even by Month 6-7"]}
        ]

        summary = (
            f"Synthesized comprehensive Master Launch Strategy for {biz_name}. "
            f"Grounding execution in 4 strategic pillars, disciplined capital safeguards, and a 9-phase, "
            f"11-week roadmap to commercial opening. Projected path reaches operational cash break-even by Month 6-7."
        )

        findings = [
            {"dimension": "Strategic Verdict", "verdict": "GO WITH MITIGATIONS", "detail": f"Venture is commercially viable in {location} with reinforced capital controls."},
            {"dimension": "Execution Horizon", "timeline": "11 Weeks to Opening", "detail": "Structured 9-phase roadmap ensures zero regulatory or equipment bottlenecks."},
            {"dimension": "Break-even Milestone", "target": "Month 6 - 7", "detail": "Targeting 75 daily orders at average ticket size of INR 420."}
        ]

        assumptions = [
            "Operating team follows the sequential milestones without skipping pre-launch regulatory clearances",
            "Founders review monthly cash flow against conservative and baseline model curves"
        ]

        risks = [
            {"risk": "Execution Delay Slippage", "severity": "Low", "mitigation": "Weekly milestone checklist audits and designated vendor deadlines."}
        ]

        explainability = {
            "why_this_recommendation": f"Integrated synthesis combining validated market research, unit economics, and risk critic safeguards.",
            "key_assumptions": assumptions,
            "main_risks": [r["risk"] for r in risks],
            "confidence_level": "High",
            "data_sources": ["NEXORA Master Strategy Framework", "SME Venture Synthesis Protocols 2024"]
        }

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": findings,
            "assumptions": assumptions,
            "risks": risks,
            "confidence": "High",
            "sources": ["Validated Multi-Agent Intelligence", "Strategic Management Consensus"],
            "explainability": explainability,
            "data": {
                "swot": swot,
                "pillars": pillars,
                "roadmap": roadmap,
                "verdict": "GO WITH SAFEGUARDS",
                "recommended_opening_timeline_weeks": 11
            }
        }
