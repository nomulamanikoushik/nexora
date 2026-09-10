from typing import List, Dict, Any, Optional

VERIFIED_KNOWLEDGE_BASE = {
    "fssai_registration": {
        "title": "FSSAI Food Business Operator Registration (Petty Food Manufacturer)",
        "source": "Food Safety and Standards Authority of India (FSSAI) Act, 2006 & Compendium 2023",
        "type": "Verified Regulatory Data",
        "threshold": "Annual turnover up to INR 12 Lakhs",
        "fee": "INR 100 / year",
        "timeline": "7-14 days online via FoSCoS portal",
        "applicability": "Home-based food production, cloud kitchens, artisanal snack makers",
        "key_requirements": [
            "Photo ID and Address Proof of Proprietor",
            "Proof of premises possession (Electricity bill or Rental agreement)",
            "Basic food safety hygiene undertaking"
        ]
    },
    "msme_udyam": {
        "title": "Udyam MSME Registration (Micro Enterprise)",
        "source": "Ministry of Micro, Small and Medium Enterprises, Govt. of India",
        "type": "Verified Regulatory Data",
        "threshold": "Investment in plant & machinery under INR 1 Crore, Turnover under INR 5 Crores",
        "fee": "Free of cost (Official Udyam portal)",
        "timeline": "Instant to 48 hours",
        "applicability": "All micro-businesses, home-based manufacturing, artisanal brands",
        "benefits": [
            "Priority sector lending from banks without collateral under CGTMSE",
            "50% subsidy on trademark registration",
            "Protection against delayed payments under MSMED Act"
        ]
    },
    "gst_threshold": {
        "title": "Goods & Services Tax (GST) Threshold Exemption",
        "source": "Central Board of Indirect Taxes and Customs (CBIC) Notification",
        "type": "Verified Regulatory Data",
        "threshold": "INR 40 Lakhs for intra-state supply of goods (INR 20 Lakhs for services / special states)",
        "fee": "Free government registration",
        "timeline": "3-7 working days",
        "applicability": "Mandatory only once annual turnover breaches threshold, OR if selling inter-state or via e-commerce marketplaces (Amazon, Flipkart)",
        "advisory": "Home-based businesses selling locally via WhatsApp/direct pickup are exempt until INR 40 Lakh threshold is crossed."
    },
    "packaging_labeling_rules": {
        "title": "Legal Metrology (Packaged Commodities) Rules & FSSAI Labelling Standards",
        "source": "Department of Consumer Affairs & FSSAI Labelling Regulations 2020",
        "type": "Verified Regulatory Data",
        "mandatory_display": [
            "FSSAI Logo and 14-digit Registration Number",
            "Veg / Non-Veg Green/Brown symbol",
            "Name and complete address of the manufacturer",
            "Net weight / quantity, Date of manufacture, Best before / Expiry date",
            "Complete ingredient list in descending order of weight",
            "Nutritional information per 100g serving"
        ]
    }
}

class RAGService:
    @staticmethod
    def get_compliance_guidance(sector: str, start_mode: str = "Home-Based") -> List[Dict[str, Any]]:
        guidance = []
        if "food" in sector.lower() or "snack" in sector.lower() or "beverage" in sector.lower():
            guidance.append(VERIFIED_KNOWLEDGE_BASE["fssai_registration"])
            guidance.append(VERIFIED_KNOWLEDGE_BASE["packaging_labeling_rules"])
        
        guidance.append(VERIFIED_KNOWLEDGE_BASE["msme_udyam"])
        guidance.append(VERIFIED_KNOWLEDGE_BASE["gst_threshold"])
        return guidance

    @staticmethod
    def format_explainability(
        why: str,
        based_on: str,
        assumptions: List[str],
        risks: List[str],
        confidence: str = "High",
        sources: Optional[List[str]] = None,
        is_verified: bool = False
    ) -> Dict[str, Any]:
        return {
            "why_this_recommendation": why,
            "based_on": based_on,
            "key_assumptions": assumptions,
            "main_risks": risks,
            "confidence_level": confidence,
            "data_sources": sources or ["NEXORA Heuristic Benchmark Engine"],
            "verification_badge": "Verified Official Data" if is_verified else "AI-Modeled Benchmark Assumption"
        }
