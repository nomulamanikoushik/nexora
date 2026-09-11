from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.idea_classifier import classify_and_understand_idea

router = APIRouter()

class IdeaUnderstandRequest(BaseModel):
    idea_text: Optional[str] = Field(default=None, description="Natural language description of the business idea")
    idea: Optional[str] = Field(default=None, description="Alternative field for natural language description")
    capital: Optional[float] = Field(default=None, description="Starting capital if known")
    currency: Optional[str] = Field(default="INR", description="Currency code")
    location: Optional[str] = Field(default=None, description="Target location or city if known")
    start_mode: Optional[str] = Field(default=None, description="Home-Based, Online, Physical Store, Mobile Business, Hybrid")
    risk_preference: Optional[str] = Field(default="Moderate", description="Conservative, Moderate, Aggressive")
    experience_level: Optional[str] = Field(default="Beginner", description="Beginner, Intermediate, Experienced")

@router.post("/understand")
@router.post("/business/understand")
def understand_idea(payload: IdeaUnderstandRequest) -> Dict[str, Any]:
    """
    Analyzes raw, unstructured natural-language business concepts and transforms them
    into a structured business launch profile with detected sector, start mode, estimated runway,
    equipment needs, and compliance permits.
    """
    text = payload.idea_text or payload.idea
    if not text or len(text.strip()) < 3:
        raise HTTPException(status_code=400, detail="Please provide a valid 'idea_text' or 'idea' description (minimum 3 characters).")
    
    try:
        structured_profile = classify_and_understand_idea(
            idea_text=text,
            explicit_capital=payload.capital,
            explicit_currency=payload.currency,
            explicit_location=payload.location,
            explicit_mode=payload.start_mode,
            risk_preference=payload.risk_preference,
            experience_level=payload.experience_level
        )
        return {
            "success": True,
            "parsed_profile": structured_profile,
            "business_name": structured_profile.get("business_name", "Artisan Venture"),
            "category": structured_profile.get("category_title", "Custom Business"),
            "likely_sector": structured_profile.get("sector", "food-beverage"),
            "business_model": structured_profile.get("business_model", "D2C"),
            "start_mode": structured_profile.get("business_start_mode", "Home-Based"),
            "target_customers": structured_profile.get("target_customer", "Urban consumers"),
            "required_resources": [eq["name"] for eq in structured_profile.get("equipment_checklist", [])],
            "possible_competitors": structured_profile.get("possible_competitors", []),
            "location_relevance": f"High relevance for {structured_profile.get('location', 'Hyderabad')}",
            "estimated_startup_requirements": {
                "capital": structured_profile.get("capital"),
                "runway_months": structured_profile.get("estimated_runway_months")
            },
            "confidence_score": 0.92,
            "suggested_profile": structured_profile
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse business idea: {str(e)}")
