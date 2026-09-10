from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.profile import BusinessProfileResponse
from app.schemas.agent import AgentRunResponse

class ScoreBreakdown(BaseModel):
    overall_score: float
    rating_label: str  # Highly Feasible, Moderate Feasibility, High Risk
    capital_fit: float
    market_attractiveness: float
    customer_demand: float
    competition_intensity: float
    location_suitability: float
    financial_feasibility: float
    risk_resilience: float
    business_model_strength: float
    explanation: str

class BusinessPlanResponse(BaseModel):
    id: str
    profile_id: str
    title: str
    status: str
    feasibility_score: float
    score_breakdown: Optional[Dict[str, Any]] = None
    
    profile: BusinessProfileResponse
    executive_summary: Optional[Dict[str, Any]] = None
    opportunity: Optional[Dict[str, Any]] = None
    market_analysis: Optional[Dict[str, Any]] = None
    customer_analysis: Optional[Dict[str, Any]] = None
    competitor_analysis: Optional[Dict[str, Any]] = None
    business_model: Optional[Dict[str, Any]] = None
    capital_allocation: Optional[Dict[str, Any]] = None
    cost_analysis: Optional[Dict[str, Any]] = None
    revenue_scenarios: Optional[Dict[str, Any]] = None
    break_even_analysis: Optional[Dict[str, Any]] = None
    location_analysis: Optional[Dict[str, Any]] = None
    compliance_checklist: Optional[Dict[str, Any]] = None
    marketing_strategy: Optional[Dict[str, Any]] = None
    early_revenue_plan: Optional[Dict[str, Any]] = None
    growth_plan: Optional[Dict[str, Any]] = None
    risk_register: Optional[Dict[str, Any]] = None
    launch_roadmap: Optional[Dict[str, Any]] = None
    critic_feedback: Optional[Dict[str, Any]] = None
    
    revision_count: int = 0
    agent_runs: Optional[List[AgentRunResponse]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PlanSummaryResponse(BaseModel):
    id: str
    title: str
    sector: str
    location: str
    capital: float
    currency: str
    feasibility_score: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
