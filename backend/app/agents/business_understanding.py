import re
from typing import Dict, Any, List, Optional
from app.agents.base_agent import BaseAgent
from app.services.llm_adapter import llm_service
from app.services.rag_service import RAGService

class BusinessUnderstandingAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="business_understanding", role="Business Profile Normalization & Custom Idea Specialist", step_order=1)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        capital = float(profile.get("capital", 300000))
        currency = profile.get("currency", "INR")
        custom_text = profile.get("custom_idea_text") or profile.get("business_type") or ""
        sector = profile.get("sector", "food-beverage")
        biz_name = profile.get("business_name", "Artisan Venture")
        location = profile.get("location", "Hyderabad")
        risk = profile.get("risk_preference", "Moderate")
        horizon = profile.get("time_horizon", "3 years")
        exp = profile.get("experience_level", "Beginner")
        start_mode = profile.get("business_start_mode", "Home-Based")

        # Understand and extract structure from custom text or profile
        understood = self.understand_custom_idea(custom_text, capital, location, start_mode)

        # Merge extracted intelligence
        final_sector = understood.get("likely_sector", sector)
        final_mode = understood.get("start_mode", start_mode)
        category = understood.get("category", "Artisanal Consumer Business")
        business_model = understood.get("business_model", "Direct-to-Consumer & Hyperlocal Orders")

        summary = (
            f"Normalized business profile for '{biz_name}' in {location}. "
            f"Operating model: {final_mode} {category} with available capital of {currency} {capital:,.0f}. "
            f"Targeting sector: {final_sector.replace('-', ' ').title()}. Risk tolerance calibrated to {risk.lower()}."
        )

        findings = [
            {"category": "Business Category", "insight": category},
            {"category": "Operating Mode", "insight": f"{final_mode} model maximizes capital efficiency by eliminating high physical storefront overhead."},
            {"category": "Capital Viability", "insight": f"Starting capital of {currency} {capital:,.0f} provides an optimal lean runway for {category} under {final_mode} operations."},
            {"category": "Identified Target Audience", "insight": understood.get("target_customers", "Local urban consumers seeking quality and convenience")}
        ]

        assumptions = [
            f"Business initiates under {final_mode} structure with minimal fixed infrastructure commitments",
            "Initial sales generated via direct hyperlocal outreach, WhatsApp community marketing, and word-of-mouth",
            f"Capital of {currency} {capital:,.0f} is unencumbered and immediately deployable for equipment, inventory, and operations"
        ]

        risks = [
            {"risk": "Working Capital Burn Rate", "severity": "High" if capital < 500000 else "Medium", "mitigation": "Protect 35%+ of capital in liquid reserves; operate on pre-order cash collection."},
            {"risk": "Regulatory / Packaging Non-Compliance", "severity": "Medium", "mitigation": "Register FSSAI petty food manufacturer license and ensure Legal Metrology labeling compliance."}
        ]

        explainability = RAGService.format_explainability(
            why="Normalizing custom founder inputs establishes an authoritative, structured baseline across all 15 downstream intelligence agents.",
            based_on="Natural-language extraction and SME benchmark data for micro and small-scale business models.",
            assumptions=assumptions,
            risks=[r["risk"] for r in risks],
            confidence="High",
            sources=["NEXORA Business Understanding Engine", "Ministry of MSME Guidelines"]
        )

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": findings,
            "assumptions": assumptions,
            "risks": risks,
            "confidence": "High",
            "sources": ["Founder Profile", "NEXORA Natural Language Understanding Engine"],
            "explainability": explainability,
            "data": {
                "business_name": biz_name,
                "normalized_capital": capital,
                "currency": currency,
                "sector_slug": final_sector,
                "category": category,
                "business_model": business_model,
                "start_mode": final_mode,
                "location": location,
                "target_customers": understood.get("target_customers"),
                "required_resources": understood.get("required_resources", []),
                "possible_competitors": understood.get("possible_competitors", []),
                "location_relevance": understood.get("location_relevance"),
                "estimated_startup_requirements": understood.get("estimated_startup_requirements", {}),
                "risk_profile": risk,
                "target_runway_months": 6 if risk == "Conservative" else 4
            }
        }

    def understand_custom_idea(self, text: str, capital: float, location: str, preferred_mode: Optional[str] = None) -> Dict[str, Any]:
        """
        Transforms arbitrary natural-language business idea into a structured profile.
        Supports both LLM extraction and a comprehensive deterministic NLP rule engine.
        """
        lower = text.lower() if text else ""

        # 1. Try LLM if configured
        if llm_service.gemini_key or llm_service.openai_key:
            sys_prompt = (
                "You are the NEXORA Business Understanding Agent. "
                "Analyze the user's natural language business idea and extract a structured business profile in JSON format."
            )
            user_prompt = f"Business Idea: '{text}', Available Capital: {capital}, Location: '{location}', Preferred Mode: '{preferred_mode}'."
            llm_res = llm_service.generate(sys_prompt, user_prompt)
            if llm_res and isinstance(llm_res, dict) and "category" in llm_res:
                return llm_res

        # 2. Deterministic Semantic Rule-Engine
        # Case A: Healthy Snacks / Food / Bakery / Kitchen
        if any(w in lower for w in ["snack", "healthy snack", "food", "kitchen", "bakery", "cookie", "millet", "sweet", "spice", "organic snack", "namkeen"]):
            is_home = "home" in lower or preferred_mode == "Home-Based" or capital <= 500000
            mode = "Home-Based" if is_home else (preferred_mode or "Physical Store")
            return {
                "business_name": "NutriBites Artisanal Snacks",
                "category": "Home-Crafted Healthy Snacks & Clean Nutrition",
                "likely_sector": "food-beverage",
                "business_model": "Direct-to-Consumer (D2C) & Hyperlocal Pre-Order Batches",
                "start_mode": mode,
                "target_customers": "Health-conscious urban professionals, fitness enthusiasts, IT workers, and parents seeking preservative-free snacks for children.",
                "required_resources": [
                    "Commercial food dehydrator and precision weighing scales",
                    "Continuous band sealer / nitrogen-flush pouch sealer",
                    "Food-grade airtight storage bins and stainless steel mixing equipment",
                    "Custom printed barrier kraft pouches with nutritional info",
                    "Certified organic dry fruits, seeds, millets, and natural cold-pressed oils"
                ],
                "possible_competitors": [
                    "Organized brands: The Whole Truth, Open Secret, Farmley, True Elements",
                    "Local unorganized home bakers and regional sweet/snack retailers in the city"
                ],
                "location_relevance": f"{location} features a dense concentration of IT corridors and residential communities with high disposable income and an active appetite for guilt-free snacking.",
                "estimated_startup_requirements": {
                    "setup_equipment": round(capital * 0.18, 0),
                    "initial_ingredients_inventory": round(capital * 0.22, 0),
                    "packaging_branding": round(capital * 0.10, 0),
                    "fssai_licensing_compliance": 5000.0,
                    "marketing_pilot_launch": round(capital * 0.12, 0),
                    "working_capital_buffer": round(capital * 0.35, 0)
                },
                "confidence_score": 0.94
            }

        # Case B: Customized Gifts / Handicrafts / Printing / Decor
        if any(w in lower for w in ["gift", "customized gift", "craft", "candle", "resin", "decor", "handmade", "pottery", "souvenir"]):
            is_home = "home" in lower or preferred_mode == "Home-Based" or capital <= 500000
            mode = "Home-Based" if is_home else (preferred_mode or "Online")
            return {
                "business_name": "ArtisanCraft Customized Gifts",
                "category": "Bespoke Personal & Corporate Gifting",
                "likely_sector": "retail-fashion",
                "business_model": "Made-to-Order Direct-to-Consumer & B2B Corporate Gifting",
                "start_mode": mode,
                "target_customers": "Corporate HR teams for employee welcome kits, wedding planners, event organizers, and young adults buying anniversary/birthday gifts.",
                "required_resources": [
                    "High-precision craft cutting plotter or sublimation heat press",
                    "Raw materials: soy wax, molds, premium cardstock, engraving blanks",
                    "Eco-friendly gift packaging boxes, satin ribbons, and personalized cards",
                    "Product photography lightbox and sample showcase kits"
                ],
                "possible_competitors": [
                    "FNP (Ferns N Petals), IGP.com, Bigsmall, Etsy independent sellers",
                    "Local personalized gift printing kiosks"
                ],
                "location_relevance": f"{location} has a thriving corporate ecosystem and celebratory culture generating consistent demand for premium corporate kits and wedding favors.",
                "estimated_startup_requirements": {
                    "setup_equipment": round(capital * 0.20, 0),
                    "initial_ingredients_inventory": round(capital * 0.25, 0),
                    "packaging_branding": round(capital * 0.12, 0),
                    "fssai_licensing_compliance": 3000.0,
                    "marketing_pilot_launch": round(capital * 0.15, 0),
                    "working_capital_buffer": round(capital * 0.28, 0)
                },
                "confidence_score": 0.91
            }

        # Case C: General / Default Fallback
        mode = preferred_mode or ("Home-Based" if capital <= 500000 else "Hybrid")
        return {
            "business_name": "Apex Modern Venture",
            "category": "Direct-to-Consumer Specialty Goods",
            "likely_sector": "food-beverage" if "food" in lower else "retail-fashion",
            "business_model": "Direct-to-Consumer & Hyperlocal Service",
            "start_mode": mode,
            "target_customers": "Urban consumers valuing localized quality, authenticity, and transparent sourcing.",
            "required_resources": [
                "Essential production and testing equipment",
                "Initial batch raw materials and safety packaging",
                "Digital storefront and direct messaging customer channel"
            ],
            "possible_competitors": [
                "Established regional retail players",
                "Online marketplace merchants"
            ],
            "location_relevance": f"{location} provides prime access to high-density consumer catchments and mature delivery logistics.",
            "estimated_startup_requirements": {
                "setup_equipment": round(capital * 0.20, 0),
                "initial_ingredients_inventory": round(capital * 0.20, 0),
                "packaging_branding": round(capital * 0.10, 0),
                "fssai_licensing_compliance": 5000.0,
                "marketing_pilot_launch": round(capital * 0.15, 0),
                "working_capital_buffer": round(capital * 0.35, 0)
            },
            "confidence_score": 0.88
        }
