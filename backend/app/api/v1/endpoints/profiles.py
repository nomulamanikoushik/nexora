import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.plan import BusinessProfile
from app.schemas.profile import BusinessProfileCreate, BusinessProfileResponse

router = APIRouter()

@router.post("/business-profiles", response_model=BusinessProfileResponse)
def create_business_profile(profile_in: BusinessProfileCreate, db: Session = Depends(get_db)):
    """Validates and persists a structured business profile."""
    profile_id = str(uuid.uuid4())
    profile = BusinessProfile(
        id=profile_id,
        business_name=profile_in.business_name,
        sector=profile_in.sector,
        business_type=profile_in.business_type,
        location=profile_in.location,
        capital=profile_in.capital,
        currency=profile_in.currency,
        objective=profile_in.objective,
        risk_preference=profile_in.risk_preference,
        time_horizon=profile_in.time_horizon,
        experience_level=profile_in.experience_level,
        business_start_mode=profile_in.business_start_mode,
        custom_idea_text=profile_in.custom_idea_text,
        locality=profile_in.locality,
        city=profile_in.city,
        state=profile_in.state,
        country=profile_in.country,
        target_audience_notes=profile_in.target_audience_notes,
        primary_usp=profile_in.primary_usp,
        target_customer=profile_in.target_customer,
        constraints=profile_in.constraints
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/business-profiles/{profile_id}", response_model=BusinessProfileResponse)
def get_business_profile(profile_id: str, db: Session = Depends(get_db)):
    profile = db.query(BusinessProfile).filter(BusinessProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return profile
