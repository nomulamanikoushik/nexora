from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.location_benchmarks import get_all_locations_flat, compare_locations, LOCATION_BENCHMARKS

router = APIRouter()

class LocationCompareRequest(BaseModel):
    locations: List[str] = Field(..., min_items=1, description="List of location or locality names to compare")
    sector: Optional[str] = Field(default="food-beverage", description="Target industry sector")
    start_mode: Optional[str] = Field(default="Home-Based", description="Home-Based, Online, Physical Store, Mobile Business, Hybrid")
    capital: Optional[float] = Field(default=300000.0, description="Available starting capital")

@router.get("/locations")
def list_locations() -> Dict[str, Any]:
    """Returns supported cities, localities, and market density benchmarks."""
    return {
        "success": True,
        "cities": LOCATION_BENCHMARKS,
        "flat_localities": get_all_locations_flat()
    }

@router.post("/location/compare")
@router.post("/locations/compare")
def compare_locations_endpoint(payload: LocationCompareRequest) -> Dict[str, Any]:
    """Compares multiple locations side-by-side with scoring and suitability analysis."""
    try:
        results = compare_locations(
            location_names=payload.locations,
            sector=payload.sector,
            start_mode=payload.start_mode,
            capital=payload.capital
        )
        return {
            "success": True,
            "comparison": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location comparison failed: {str(e)}")
