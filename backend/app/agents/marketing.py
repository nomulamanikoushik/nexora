from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class MarketingAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="marketing", role="Go-To-Market & Brand Positioning Strategist", step_order=10)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        capital = float(profile.get("capital", 1000000))
        currency = profile.get("currency", "INR")
        location = profile.get("location", "Hyderabad")
        biz_name = profile.get("business_name", "New Venture")

        marketing_budget = round(capital * 0.10, 0)

        phases = [
            {
                "phase": "Phase 1: Pre-Launch Buzz (Days -21 to Day 0)",
                "focus": "Curiosity & Local Visibility",
                "budget_share": "25%",
                "tactics": [
                    "Google My Business (GMB) verified location profile setup with high-resolution food photography",
                    "Hyperlocal Instagram food creator tasting boxes (15 micro-influencers with 5k-25k local followers)",
                    "Geo-targeted Instagram teaser reels showcasing live kitchen hygiene and artisanal prep",
                    "Opening day countdown promotion with 500 early-bird discount vouchers"
                ]
            },
            {
                "phase": "Phase 2: Launch Blitz (Week 1 to Week 4)",
                "focus": "Rapid Trial & First Order Conversion",
                "budget_share": "45%",
                "tactics": [
                    "Aggregator launch booster campaign on Swiggy & Zomato for top-3 carousel placement",
                    "Introductory 'Buy 1 Get Free Specialty Drink' offer to drive initial review velocity",
                    "Corporate desk drops / tasting platters delivered to nearby tech park office managers",
                    "Direct QR flyers distributed to surrounding residential gated communities"
                ]
            },
            {
                "phase": "Phase 3: 90-Day Retention & Direct Scale (Month 2 to Month 3)",
                "focus": "Customer Retention & Direct Ordering",
                "budget_share": "30%",
                "tactics": [
                    "Automated WhatsApp loyalty reminders with 10% direct reorder code",
                    "Weekly chef special rotational menu drops on Friday evenings",
                    "Corporate lunch meal subscription passes (advance monthly payment)",
                    "Refer-a-colleague rewards program"
                ]
            }
        ]

        channels = [
            {"channel": "Hyperlocal Instagram / Meta Ads", "allocation": "35%", "target_cac": f"{currency} 65", "conversion_goal": "First app/web order"},
            {"channel": "Delivery Aggregator In-App Sponsored Ads", "allocation": "30%", "target_cac": f"{currency} 85", "conversion_goal": "Immediate high-intent conversion"},
            {"channel": "Corporate Tasting & B2B Sampling", "allocation": "15%", "target_cac": f"{currency} 35", "conversion_goal": "High-volume bulk catering leads"},
            {"channel": "GMB Local SEO & Organic Influencer Gifting", "allocation": "12%", "target_cac": f"{currency} 25", "conversion_goal": "Long-term organic search capture"},
            {"channel": "Print QR Collateral & Packaging Inserts", "allocation": "8%", "target_cac": f"{currency} 15", "conversion_goal": "Repeat direct WhatsApp ordering"}
        ]

        summary = (
            f"Crafted a high-velocity Go-To-Market strategy for {biz_name} with total budget of {currency} {marketing_budget:,.0f}. "
            f"Phased execution spans a 3-week pre-launch buzz, 4-week launch blitz, and 90-day direct-order retention engine. "
            f"Blended target Customer Acquisition Cost (CAC) is modeled at {currency} 58, ensuring healthy LTV/CAC ratios above 4.2x."
        )

        findings = [
            {"strategy": "Influencer Micro-Strategy", "detail": "Prioritize 15 local food creators over expensive mega-influencers for authentic neighborhood trust."},
            {"strategy": "Aggregator-to-Direct Transition", "detail": "Packaging inserts incentivize 2nd order via direct WhatsApp channel to bypass 20% commission."},
            {"strategy": "Blended CAC", "detail": f"Target blended CAC is {currency} 58 with projected customer lifetime value (LTV) exceeding {currency} 2,400."}
        ]

        assumptions = [
            "Food styling and visual creative assets are captured professionally prior to opening week",
            "Initial packaging includes high-converting direct ordering vouchers"
        ]

        risks = [
            {"risk": "Ad Fatigue & High Aggregator Bidding Costs", "severity": "Medium", "mitigation": "Cap daily sponsored bids and shift spend into direct referral loops."}
        ]

        explainability = {
            "why_this_recommendation": f"Acquisition channel mix tailored for urban dining behavior and digital food discovery in {location}.",
            "key_assumptions": assumptions,
            "main_risks": [r["risk"] for r in risks],
            "confidence_level": "High",
            "data_sources": ["D2C Customer Acquisition Benchmarks 2024", "Swiggy / Zomato Restaurant Growth Guides"]
        }

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": findings,
            "assumptions": assumptions,
            "risks": risks,
            "confidence": "High",
            "sources": ["Digital Marketing Index", "Hyperlocal Acquisition Studies"],
            "explainability": explainability,
            "data": {
                "total_marketing_budget": marketing_budget,
                "phases": phases,
                "channels": channels,
                "target_blended_cac": f"{currency} 58",
                "projected_ltv_cac_ratio": "4.2x"
            }
        }
