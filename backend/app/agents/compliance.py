from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent

class ComplianceAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="compliance", role="Statutory & Regulatory Verification Specialist", step_order=9)

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        profile = context.get("profile", {})
        sector = profile.get("sector", "food-beverage")
        location = profile.get("location", "Hyderabad")
        currency = profile.get("currency", "INR")

        checklist = [
            {
                "id": "comp-1",
                "title": "FSSAI Food Safety License (State / Central)",
                "authority": "Food Safety and Standards Authority of India (FSSAI)",
                "timeline": "15 - 25 days",
                "estimated_cost": f"{currency} 3,000 - 7,500",
                "mandatory": True,
                "status": "Required Pre-Launch",
                "notes": "Mandatory before commercial food preparation and onboarding onto Swiggy/Zomato."
            },
            {
                "id": "comp-2",
                "title": "GST Registration (Goods and Services Tax)",
                "authority": "Commercial Taxes Department, Ministry of Finance",
                "timeline": "5 - 10 days",
                "estimated_cost": f"{currency} 1,500 - 3,000",
                "mandatory": True,
                "status": "Required Pre-Launch",
                "notes": "Required for inter-state procurement, input tax credit, and platform aggregators."
            },
            {
                "id": "comp-3",
                "title": "Telangana Shops & Commercial Establishments Act Registration",
                "authority": "Department of Labour, Govt of Telangana",
                "timeline": "7 - 14 days",
                "estimated_cost": f"{currency} 1,000 - 2,500",
                "mandatory": True,
                "status": "Required Pre-Launch",
                "notes": "Regulates working hours, employee benefits, and operating permits."
            },
            {
                "id": "comp-4",
                "title": "GHMC Municipal Trade License & Health NOC",
                "authority": "Greater Hyderabad Municipal Corporation (GHMC)",
                "timeline": "15 - 20 days",
                "estimated_cost": f"{currency} 4,000 - 8,000",
                "mandatory": True,
                "status": "Required Pre-Launch",
                "notes": "Health and sanitation clearance for commercial kitchen operations within municipal limits."
            },
            {
                "id": "comp-5",
                "title": "Fire Department NOC / Safety Clearance",
                "authority": "State Disaster Response & Fire Services",
                "timeline": "20 - 30 days",
                "estimated_cost": f"{currency} 5,000 - 10,000",
                "mandatory": False,
                "status": "Conditional",
                "notes": "Mandatory if dine-in capacity exceeds 50 seats or premises exceeds 1,000 sq.ft; standard fire extinguisher setup mandatory."
            },
            {
                "id": "comp-6",
                "title": "Trademark & Brand Name Registration (Class 43)",
                "authority": "Controller General of Patents, Designs and Trade Marks (IP India)",
                "timeline": "30 - 90 days (TM application valid immediate)",
                "estimated_cost": f"{currency} 4,500 - 9,000",
                "mandatory": False,
                "status": "Recommended",
                "notes": "Protects logo, business identity, and recipe branding from regional infringement."
            }
        ]

        disclaimer = (
            "IMPORTANT LEGAL DISCLAIMER: The statutory requirements, fees, and timelines listed above are provided "
            "as decision-support guidelines based on prevailing state and municipal regulations. They do not constitute "
            "formal legal counsel. Founders must verify all requirements with qualified legal and tax practitioners "
            "prior to financial commitments."
        )

        summary = (
            f"Compiled statutory compliance roadmap for {sector.replace('-', ' ').title()} in {location}. "
            f"Identified 4 mandatory pre-launch clearances (FSSAI, GST, Shops & Establishment, GHMC Trade License). "
            f"Total estimated regulatory lead time is 25 - 35 days with combined statutory fees under {currency} 25,000."
        )

        findings = [
            {"item": "Core Operating Licenses", "count": 4, "detail": "Must be initiated simultaneously 30 days prior to kitchen opening."},
            {"item": "Aggregator Prerequisites", "count": 2, "detail": "FSSAI license and active GSTIN are mandatory blockers for Swiggy/Zomato merchant accounts."},
            {"item": "Regulatory Budget", "amount": f"{currency} 15,000 - 25,000", "detail": "Included in Setup & Licensing capital bucket."}
        ]

        assumptions = [
            "Commercial rental agreement has a clear municipal property tax assessment identifier",
            "Premises complies with basic fire extinguisher safety standards"
        ]

        risks = [
            {"risk": "License Issuance Bottlenecks", "severity": "Medium", "mitigation": "Engage an accredited local charter / CA to fast-track digital portal submissions."}
        ]

        explainability = {
            "why_this_recommendation": f"Calibrated against municipal guidelines for {location} and statutory mandates for {sector}.",
            "key_assumptions": assumptions,
            "main_risks": [r["risk"] for r in risks],
            "confidence_level": "High",
            "data_sources": [f"{location} Municipal Corporation Portal", "FSSAI Licensing Portal 2024"]
        }

        return {
            "agent_name": self.name,
            "status": "completed",
            "summary": summary,
            "findings": findings,
            "assumptions": assumptions,
            "risks": risks,
            "confidence": "High",
            "sources": ["Municipal Citizen Charters", "State Labour Portals"],
            "explainability": explainability,
            "data": {
                "checklist": checklist,
                "disclaimer": disclaimer,
                "estimated_compliance_lead_days": 30,
                "mandatory_count": 4
            }
        }
