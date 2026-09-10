from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.services.rag_service import RAGService

class CapitalPlanningAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="capital_planning", role="Practical Capital Allocation Strategist", step_order=8)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        capital = float(profile.get("capital", 300000))
        currency = profile.get("currency", "INR")
        start_mode = profile.get("business_start_mode", "Home-Based")
        is_revision = context.get("is_revision", False)
        critic_instruction = context.get("critic_instruction", "")

        # Practical Capital Allocation Buckets based on Business Start Mode
        if start_mode in ["Home-Based", "Online"]:
            if is_revision:
                # Revised by Critic: even leaner initial Capex, reinforced working capital & marketing
                weights = {
                    "Initial Setup & Tools": 0.12,
                    "Production Equipment & Sealer": 0.14,
                    "Initial Raw Materials & Packaging": 0.20,
                    "Marketing & Early Customer Acquisition": 0.14,
                    "Digital Storefront & POS Tools": 0.05,
                    "Working Capital Reserve (Burn Buffer)": 0.25,
                    "Emergency Buffer & Contingency": 0.10
                }
                revision_note = "Revised per Critic feedback: Trimmed equipment spend by 4%, fortified working capital reserve to 25% and emergency buffer to 10% (35% total cash safety net)."
            else:
                weights = {
                    "Initial Setup & Tools": 0.15,
                    "Production Equipment & Sealer": 0.18,
                    "Initial Raw Materials & Packaging": 0.20,
                    "Marketing & Early Customer Acquisition": 0.12,
                    "Digital Storefront & POS Tools": 0.05,
                    "Working Capital Reserve (Burn Buffer)": 0.20,
                    "Emergency Buffer & Contingency": 0.10
                }
                revision_note = f"Standard baseline allocation for {start_mode} model with zero commercial lease overhead."
        else:
            # Physical Store or Hybrid
            if is_revision:
                weights = {
                    "Initial Setup & Lease Deposit": 0.14,
                    "Commercial Machinery & Fixtures": 0.20,
                    "Initial Inventory & Packaging": 0.10,
                    "Staffing Reserve (3 Months)": 0.16,
                    "Marketing & Customer Acquisition": 0.10,
                    "Technology, POS & Licensing": 0.05,
                    "Working Capital Reserve (Burn Buffer)": 0.18,
                    "Emergency Buffer & Contingency": 0.07
                }
                revision_note = "Revised per Critic review: Downscaled heavy fixtures and lease deposit, boosting working capital buffer to 25% total."
            else:
                weights = {
                    "Initial Setup & Lease Deposit": 0.18,
                    "Commercial Machinery & Fixtures": 0.25,
                    "Initial Inventory & Packaging": 0.10,
                    "Staffing Reserve (3 Months)": 0.15,
                    "Marketing & Customer Acquisition": 0.10,
                    "Technology, POS & Licensing": 0.05,
                    "Working Capital Reserve (Burn Buffer)": 0.12,
                    "Emergency Buffer & Contingency": 0.05
                }
                revision_note = "Standard baseline allocation for physical retail store."

        breakdown = {}
        chart_data = []
        for cat, weight in weights.items():
            amount = round(capital * weight, 0)
            breakdown[cat] = amount
            chart_data.append({
                "category": cat,
                "amount": amount,
                "percentage": round(weight * 100, 1),
                "currency": currency
            })

        # Practical 5 Pillars of Capital Display
        setup_amount = sum(amount for cat, amount in breakdown.items() if any(k in cat for k in ["Setup", "Machinery", "Equipment", "Fixtures"]))
        working_cap_amount = breakdown.get("Working Capital Reserve (Burn Buffer)", round(capital * 0.20, 0))
        emergency_amount = breakdown.get("Emergency Buffer & Contingency", round(capital * 0.10, 0))
        marketing_amount = breakdown.get("Marketing & Early Customer Acquisition", breakdown.get("Marketing & Customer Acquisition", round(capital * 0.12, 0)))
        operating_reserve = working_cap_amount + emergency_amount

        practical_pillars = {
            "initial_setup": {
                "amount": setup_amount,
                "percentage": round((setup_amount / capital) * 100, 1),
                "explanation": f"Allocated for production tools, packaging machinery, and essential kitchen equipment without incurring expensive commercial real estate commitments." if "Home" in start_mode else "Lease deposit, interior fit-out, and initial commercial kitchen machinery."
            },
            "operating_reserve": {
                "amount": operating_reserve,
                "percentage": round((operating_reserve / capital) * 100, 1),
                "explanation": f"Liquid cushion guaranteeing 4-6 months of low-overhead operations ({currency} {operating_reserve:,.0f}), safeguarding against demand fluctuations."
            },
            "marketing_budget": {
                "amount": marketing_amount,
                "percentage": round((marketing_amount / capital) * 100, 1),
                "explanation": "Dedicated funds for sample tasting kits, hyper-local community distribution, Instagram reels, and introductory launch bundle promotions."
            },
            "working_capital": {
                "amount": working_cap_amount,
                "percentage": round((working_cap_amount / capital) * 100, 1),
                "explanation": "Sustains inventory replenishment cycles and direct ingredient bulk purchases before customer invoice settlements."
            },
            "emergency_buffer": {
                "amount": emergency_amount,
                "percentage": round((emergency_amount / capital) * 100, 1),
                "explanation": "Strictly restricted reserve to handle unforeseen ingredient price spikes, equipment maintenance, or packaging reprint contingencies."
            }
        }

        safety_ratio = round((operating_reserve / capital) * 100, 1)

        summary = (
            f"Capital Planning formulated practical allocation for {currency} {capital:,.0f} under {start_mode} mode. "
            f"Physical setup/equipment capped at {round((setup_amount/capital)*100, 1)}% ({currency} {setup_amount:,.0f}), while liquid operating reserve "
            f"is fortified at {safety_ratio}% ({currency} {operating_reserve:,.0f}). {revision_note}"
        )

        findings = [
            {"dimension": "Initial Setup Allocation", "value": f"{currency} {setup_amount:,.0f}", "insight": f"Calculated for {start_mode} footprint with low physical overhead."},
            {"dimension": "Marketing & Acquisition", "value": f"{currency} {marketing_amount:,.0f}", "insight": "Focused on low-cost customer acquisition and sample tasting kits."},
            {"dimension": "Liquid Safety Buffer", "value": f"{safety_ratio}% ({currency} {operating_reserve:,.0f})", "insight": f"Provides {'exceptional' if safety_ratio >= 25 else 'adequate'} runway cushion against early cash volatility."}
        ]

        explainability = RAGService.format_explainability(
            why=f"Structuring capital around a {start_mode} model preserves founders' cash runway, allocating capital into customer-generating channels and liquid reserves.",
            based_on="SME Lean Startup Methodology & Capital Preservation Frameworks.",
            assumptions=[
                f"Starting setup will occur primarily at existing home/shared facilities under {start_mode}",
                "Operating reserves will not be depleted for non-essential promotional spending"
            ],
            risks=["Early over-spending on custom packaging or high-end machinery before initial batch validation"],
            confidence="High",
            sources=["NEXORA Capital Allocation Matrix", "SME Financial Prudence Benchmarks"]
        )

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": findings,
            "assumptions": [
                "No heavy commercial real estate broker fees or multi-month security deposits needed for Home-Based start",
                "Raw materials purchased in small pilot batches to maximize inventory turnover"
            ],
            "risks": [
                {"risk": "Premature Capex Overhang", "severity": "Medium", "mitigation": "Strict policy: only purchase tools needed for initial 100 units."}
            ],
            "confidence": "High",
            "sources": ["NEXORA Capital Planning Matrix", "Reserve Bank of India MSME Prudence Guidelines"],
            "explainability": explainability,
            "data": {
                "total_capital": capital,
                "currency": currency,
                "start_mode": start_mode,
                "breakdown": breakdown,
                "categories": breakdown,
                "chart_data": chart_data,
                "practical_pillars": practical_pillars,
                "safety_buffer_amount": operating_reserve,
                "safety_buffer_ratio": safety_ratio,
                "is_revised": is_revision,
                "revision_note": revision_note
            }
        }
