from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class BusinessModelAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="business_model", role="Business Model & Revenue Architecture Specialist", step_order=6)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        sector = profile.get("sector", "food-beverage")
        currency = profile.get("currency", "INR")
        biz_name = profile.get("business_name", "New Venture")

        revenue_streams = [
            {"channel": "Direct Walk-in & Takeaway", "share": "45%", "margin": "68%", "desc": "Zero platform commission, high-margin customer capture."},
            {"channel": "Online Delivery Aggregators (Swiggy / Zomato)", "share": "40%", "margin": "52%", "desc": "Volume scale and customer acquisition reach (after 18-22% commission)."},
            {"channel": "Pre-ordered Corporate Meals & Event Catering", "share": "15%", "margin": "72%", "desc": "B2B bulk orders with predictable cash flow and advance payments."}
        ]

        canvas = {
            "value_proposition": f"Premium artisanal quality with rapid convenience and transparent clean preparation for {biz_name}.",
            "customer_segments": "Urban professionals, discerning families, and young digital natives.",
            "channels": "On-premise counter, proprietary WhatsApp/web ordering, and major food delivery aggregators.",
            "customer_relationships": "Automated digital loyalty programs, personalized order tracking, and chef feedback loops.",
            "key_activities": "Fresh food preparation, consistent inventory management, quality assurance SOPs, and local digital marketing.",
            "key_resources": "Commercial-grade kitchen equipment, skilled head chef and prep team, standardized recipes, POS and inventory software.",
            "key_partners": "Direct-from-farm vegetable and dairy suppliers, eco-friendly packaging manufacturers, local delivery fleet.",
            "cost_structure": "Cost of Goods Sold (COGS 32-35%), Rent & Utilities (12%), Staff Payroll (18%), Marketing (8-10%), Packaging & Tech (6%)."
        }

        unit_economics = {
            "average_ticket_size": f"{currency} 420",
            "cogs_percentage": "32%",
            "gross_margin_percentage": "68%",
            "packaging_and_delivery_cost": f"{currency} 45 per order",
            "net_contribution_margin": f"{currency} 165 per order (39%)"
        }

        summary = (
            f"Formulated a resilient hybrid business model for {biz_name}. "
            f"Combines direct walk-in takeaway (45% share, 68% margin) with online delivery (40% share) and "
            f"corporate catering (15% share). Target unit contribution margin is healthy at 39%."
        )

        findings = [
            {"component": "Revenue Diversification", "detail": "Triple revenue stream mitigates over-dependency on any single food aggregator platform."},
            {"component": "Unit Economics", "detail": f"Strong contribution margin of {unit_economics['net_contribution_margin']} provides profitability headroom."},
            {"component": "Operational Scalability", "detail": "Standardized prep stations allow adding 2nd and 3rd satellite cloud pods with minimal incremental capex."}
        ]

        assumptions = [
            "COGS can be maintained below 35% through standardized portion control and bulk procurement",
            "Delivery aggregators do not raise baseline commission fees beyond 22%"
        ]

        risks = [
            {"risk": "Aggregator Commission Erosion", "severity": "Medium", "mitigation": "Offer 10% instant discount on direct WhatsApp/phone orders to transition customers off platforms."}
        ]

        explainability = {
            "why_this_recommendation": "Lean hybrid structure balances high walk-in margins with delivery discovery volume.",
            "key_assumptions": assumptions,
            "main_risks": [r["risk"] for r in risks],
            "confidence_level": "High",
            "data_sources": ["NRAI Cloud Kitchen Playbook 2024", "Standard SME Unit Economics Models"]
        }

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": findings,
            "assumptions": assumptions,
            "risks": risks,
            "confidence": "High",
            "sources": ["SME Business Model Database", "Quick Service Restaurant Benchmarks"],
            "explainability": explainability,
            "data": {
                "canvas": canvas,
                "revenue_streams": revenue_streams,
                "unit_economics": unit_economics
            }
        }
