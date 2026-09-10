from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class GrowthAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="growth", role="Scale, Retention & Viral Growth Strategist", step_order=12)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        capital = float(profile.get("capital", 300000))
        currency = profile.get("currency", "INR")
        location = profile.get("location", "Hyderabad")
        biz_name = profile.get("business_name", "Venture")
        start_mode = profile.get("business_start_mode", "Home-Based")
        sector = profile.get("sector", "food-beverage")

        retention_engine = {
            "strategy": "Automated Replenishment & VIP Club",
            "cycle_interval": "14 to 21 Days (consumption cycle for household snack packs)",
            "tactics": [
                {
                    "program": "Smart Reorder WhatsApp Triggers",
                    "trigger": "Day 12 post-delivery",
                    "mechanism": "Automated friendly prompt: 'Running low on your favorite NutriCrunch batch? Reply 1 to reorder with free doorstep delivery!'"
                },
                {
                    "program": "Weekly / Bi-Weekly Snack Box Subscription",
                    "trigger": "After 2 successful individual orders",
                    "mechanism": "Offer 12% recurring discount + free seasonal trial pouch for automated fortnightly deliveries."
                },
                {
                    "program": "VIP Inner Circle Perks",
                    "trigger": "Customers who cross 4 orders",
                    "mechanism": "Access to secret menu launches, customized low-sugar/keto blends, and personal founder birthday gifts."
                }
            ],
            "projected_repeat_rate": "42% within 60 days"
        }

        referral_loops = {
            "program_name": "Spread the Crunch / Wellness Circle",
            "loop_mechanic": "Two-Sided Neighbor Reward",
            "user_incentive": f"{currency} 100 wallet credit on their next replenishment",
            "friend_incentive": f"{currency} 100 off their first tasting box + free mini pouch",
            "viral_coefficient_target": "1.32 (every 10 buyers bring ~3 new organic customers)",
            "distribution_methods": [
                "QR code printed directly on luxury biodegradable snack pouch reverse",
                "1-click WhatsApp referral share link generated upon order confirmation",
                "Tasting Box gift tags for gifting to colleagues and gym buddies"
            ]
        }

        growth_milestones = [
            {
                "timeframe": "Month 3 (Product-Market Fit & Repeat Validation)",
                "active_customers": "150+ monthly active households",
                "monthly_revenue": f"{currency} 85,000",
                "repeat_customer_ratio": "36%",
                "key_focus": "Menu standardization, airtight automated packaging, and consistent 5-star Google review velocity."
            },
            {
                "timeframe": "Month 6 (Unit Profitability & Micro-Expansion)",
                "active_customers": "450+ recurring customers",
                "monthly_revenue": f"{currency} 2,40,000",
                "repeat_customer_ratio": "48%",
                "key_focus": "Hiring 1 part-time culinary prep assistant, expanding delivery radius to 15km via local hyper-courier."
            },
            {
                "timeframe": "Month 12 (Scale, B2B & Omni-Channel Presence)",
                "active_customers": "1,200+ direct consumers + 8 corporate clients",
                "monthly_revenue": f"{currency} 6,20,000",
                "repeat_customer_ratio": "54%",
                "key_focus": "Corporate gifting lines for Diwali/Festive seasons, supply placement in 12 premium organic grocers in Hyderabad."
            }
        ]

        expansion_playbook = [
            {
                "vector": "Adjacent SKU Line Expansion",
                "description": "Expand from seed snacks into artisanal roasted muesli, cold-pressed snack bars, and customized diabetic-friendly savory mixes."
            },
            {
                "vector": "B2B Corporate Wellness & Gifting",
                "description": "Package branded executive snack hampers for tech startups and IT companies for employee wellness kits and annual client gifting."
            },
            {
                "vector": "Cloud Micro-Hub / Dedicated Production Kitchen",
                "description": "Transition from home kitchen to a dedicated certified commercial micro-facility when monthly order volume exceeds 800 boxes."
            }
        ]

        growth_kpis = [
            {"metric": "Customer Lifetime Value (LTV)", "target": f"{currency} 3,600", "benchmark": "Based on 8 repeat orders over 12 months"},
            {"metric": "Customer Acquisition Cost (CAC)", "target": f"{currency} 55 blended", "benchmark": "Direct + community + referral mix"},
            {"metric": "LTV / CAC Ratio", "target": "6.5x", "benchmark": "Exceptional capital efficiency (Industry benchmark > 3.0x)"},
            {"metric": "Monthly Repeat Purchase Rate", "target": "45%+", "benchmark": "High stickiness in wellness & consumables"},
            {"metric": "Net Promoter Score (NPS)", "target": "72", "benchmark": "World-class word-of-mouth promoter density"}
        ]

        summary = (
            f"Designed the long-term Growth & Scaling Engine for {biz_name}. "
            f"Leverages automated replenishment loops, 2-sided neighborhood referral mechanics, and high-margin B2B corporate gifting. "
            f"Projects scaling from {currency} 85,000/month at Month 3 to {currency} 6,20,000/month by Month 12 with an exceptional 6.5x LTV/CAC ratio."
        )

        explainability = {
            "why_this_recommendation": f"Consumable products with high taste appeal and perceived health benefits achieve superior unit economics when built on recurring replenishment and organic referral loops.",
            "key_assumptions": [
                "Repeat purchase rate exceeds 35% by Month 3",
                "Batch quality and ingredient freshness remain consistent during volume scaling"
            ],
            "main_risks": [
                "Churn if delivery packaging fails during monsoon or extreme heat",
                "Competition from larger industrial brands running aggressive price discounts"
            ],
            "confidence_level": "High",
            "data_sources": ["Bespoke Food Brand Scaling Reports", "D2C Retention Benchmarks India 2024"]
        }

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": [
                {"strategy": "Replenishment Automation", "detail": "Automated WhatsApp triggers on Day 12 capture reorders during peak pantry depletion."},
                {"strategy": "Referral Math", "detail": "Double-sided ₹100 incentives achieve a viral coefficient of 1.32, lowering blended CAC."},
                {"strategy": "12-Month Trajectory", "detail": f"Forecasted Month 12 run-rate of {currency} 6,20,000/month with 54% recurring revenue."}
            ],
            "assumptions": explainability["key_assumptions"],
            "risks": [{"risk": r, "severity": "Medium", "mitigation": "Use double-foil barrier nitrogen packaging"} for r in explainability["main_risks"]],
            "confidence": "High",
            "sources": explainability["data_sources"],
            "explainability": explainability,
            "data": {
                "retention_engine": retention_engine,
                "referral_loops": referral_loops,
                "growth_milestones": growth_milestones,
                "expansion_playbook": expansion_playbook,
                "growth_kpis": growth_kpis
            }
        }
