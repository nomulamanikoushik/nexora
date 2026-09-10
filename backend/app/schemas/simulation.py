from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class WhatIfRequest(BaseModel):
    plan_id: str
    capital: Optional[float] = None
    risk_preference: Optional[str] = None
    time_horizon: Optional[str] = None
    location: Optional[str] = None
    scale_factor: Optional[float] = Field(default=1.0, description='Operational scale: 0.5 (lean/micro), 1.0 (standard), 1.5 (growth/expanded)')

class ParameterDiff(BaseModel):
    field: str
    original_value: Any
    new_value: Any
    delta_display: str

class WhatIfResponse(BaseModel):
    plan_id: str
    changes: List[ParameterDiff]
    previous_score: float
    new_score: float
    score_delta: float
    score_breakdown: Dict[str, Any]
    
    capital_allocation_comparison: Dict[str, Any]
    cost_comparison: Dict[str, Any]
    revenue_comparison: Dict[str, Any]
    break_even_comparison: Dict[str, Any]
    risk_delta: List[Dict[str, Any]]
    roadmap_adjustments: List[str]
    summary_insight: str
