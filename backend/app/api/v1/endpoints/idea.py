from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.idea_classifier import classify_and_understand_idea

router = APIRouter()

class IdeaUnderstandRequest(BaseModel):
    idea_text: str = Field(..., min_length=3, description="Natural language description of the business idea")
    capital: Optional[float] = Field(default=None, description="Starting capital if known")
    currency: Optional[str] = Field(default="INR", description="Currency code")
    location: Optional[str] = Field(default=None, description="Target location or city if known")
    start_mode: Optional[str] = Field(default=None, description="Home-Based, Online, Physical Store, Mobile Business, Hybrid")
    risk_preference: Optional[str] = Field(default="Moderate", description="Conservative, Moderate, Aggressive")
    experience_level: Optional[str] = Field(default="Beginner", description="Beginner, Intermediate, Experienced")

@router.post("/understand")
def understand_idea(payload: IdeaUnderstandRequest) -> Dict[str, Any]:
    """
    Analyzes raw, unstructured natural-language business concepts and transforms them
    into a structured business launch profile with detected sector, start mode, estimated runway,
    equipment needs, and compliance permits.
    """
    try:
        structured_profile = classify_and_understand_idea(
            idea_text=payload.idea_text,
            explicit_capital=payload.capital,
            explicit_currency=payload.currency,
            explicit_location=payload.location,
            explicit_mode=payload.start_mode,
            risk_preference=payload.risk_preference,
            experience_level=payload.experience_level
        )
        return {
            "success": True,
            "parsed_profile": structured_profile
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse business idea: {str(e)}")
