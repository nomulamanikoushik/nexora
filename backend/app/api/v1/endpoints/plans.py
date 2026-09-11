import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.plan import BusinessProfile, BusinessPlan, PlanSection
from app.models.agent_run import AgentRun
from app.schemas.profile import BusinessProfileCreate
from app.schemas.plan import BusinessPlanResponse, PlanSummaryResponse
from app.agents.orchestrator import orchestrator

router = APIRouter()

@router.post("/")
def create_plan(profile_in: BusinessProfileCreate, db: Session = Depends(get_db)):
    """
    Creates a new Business Profile and initiates a Business Plan.
    Returns plan_id to allow real-time SSE streaming or synchronous execution.
    """
    profile_id = str(uuid.uuid4())
    plan_id = str(uuid.uuid4())

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

    plan = BusinessPlan(
        id=plan_id,
        profile_id=profile_id,
        title=f"{profile_in.business_name} — {profile_in.sector.replace('-', ' ').title()} Strategic Blueprint",
        status="running",
        feasibility_score=0.0
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    return {
        "id": plan_id,
        "plan_id": plan_id,
        "profile_id": profile_id,
        "status": "initialized",
        "stream_url": f"/api/v1/plans/{plan_id}/stream",
        "sync_url": f"/api/v1/plans/{plan_id}/execute-sync"
    }

@router.get("/{plan_id}/stream")
def stream_plan_execution(plan_id: str, db: Session = Depends(get_db)):
    """
    Server-Sent Events (SSE) endpoint:
    Streams live multi-agent execution events, critic loop debates, and progress percentages.
    """
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    
    profile = db.query(BusinessProfile).filter(BusinessProfile.id == plan.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    profile_dict = {
        "business_name": profile.business_name,
        "sector": profile.sector,
        "business_type": profile.business_type,
        "location": profile.location,
        "capital": profile.capital,
        "currency": profile.currency,
        "objective": profile.objective,
        "risk_preference": profile.risk_preference,
        "time_horizon": profile.time_horizon,
        "experience_level": profile.experience_level,
        "business_start_mode": getattr(profile, "business_start_mode", "Home-Based") or "Home-Based",
        "custom_idea_text": getattr(profile, "custom_idea_text", None),
        "locality": getattr(profile, "locality", None),
        "city": getattr(profile, "city", None),
        "state": getattr(profile, "state", None),
        "country": getattr(profile, "country", "India"),
        "primary_usp": getattr(profile, "primary_usp", None),
        "target_audience_notes": getattr(profile, "target_audience_notes", None),
        "target_customer": profile.target_customer,
        "constraints": profile.constraints
    }

    return StreamingResponse(
        orchestrator.stream_orchestration(profile_dict, db, plan_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/{plan_id}/execute-sync")
def execute_plan_sync(plan_id: str, db: Session = Depends(get_db)):
    """
    Executes the entire multi-agent pipeline synchronously and returns the completed plan.
    """
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    
    profile = db.query(BusinessProfile).filter(BusinessProfile.id == plan.profile_id).first()
    profile_dict = {
        "business_name": profile.business_name,
        "sector": profile.sector,
        "business_type": profile.business_type,
        "location": profile.location,
        "capital": profile.capital,
        "currency": profile.currency,
        "objective": profile.objective,
        "risk_preference": profile.risk_preference,
        "time_horizon": profile.time_horizon,
        "experience_level": profile.experience_level,
        "business_start_mode": getattr(profile, "business_start_mode", "Home-Based") or "Home-Based",
        "custom_idea_text": getattr(profile, "custom_idea_text", None),
        "locality": getattr(profile, "locality", None),
        "city": getattr(profile, "city", None),
        "state": getattr(profile, "state", None),
        "country": getattr(profile, "country", "India"),
        "primary_usp": getattr(profile, "primary_usp", None),
        "target_audience_notes": getattr(profile, "target_audience_notes", None),
        "target_customer": profile.target_customer,
        "constraints": profile.constraints
    }

    orchestrator.execute_plan(profile_dict, db, plan_id)
    db.refresh(plan)
    return plan

@router.get("/")
def list_plans(db: Session = Depends(get_db)):
    plans = db.query(BusinessPlan).order_by(BusinessPlan.created_at.desc()).all()
    results = []
    for p in plans:
        prof = p.profile
        results.append({
            "id": p.id,
            "title": p.title,
            "sector": prof.sector if prof else "General",
            "location": prof.location if prof else "Metropolitan",
            "capital": prof.capital if prof else 0.0,
            "currency": prof.currency if prof else "INR",
            "feasibility_score": p.feasibility_score,
            "status": p.status,
            "revision_count": p.revision_count,
            "created_at": p.created_at
        })
    return results

@router.get("/{plan_id}")
def get_plan(plan_id: str, db: Session = Depends(get_db)):
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    
    # Also fetch agent runs
    runs = db.query(AgentRun).filter(AgentRun.plan_id == plan_id).order_by(AgentRun.step_order.asc(), AgentRun.created_at.asc()).all()
    
    return {
        "id": plan.id,
        "profile_id": plan.profile_id,
        "title": plan.title,
        "status": plan.status,
        "feasibility_score": plan.feasibility_score,
        "score_breakdown": plan.score_breakdown,
        "profile": {
            "business_name": plan.profile.business_name,
            "sector": plan.profile.sector,
            "business_type": plan.profile.business_type,
            "location": plan.profile.location,
            "capital": plan.profile.capital,
            "currency": plan.profile.currency,
            "objective": plan.profile.objective,
            "risk_preference": plan.profile.risk_preference,
            "time_horizon": plan.profile.time_horizon,
            "experience_level": plan.profile.experience_level,
            "business_start_mode": getattr(plan.profile, "business_start_mode", "Home-Based") or "Home-Based",
            "custom_idea_text": getattr(plan.profile, "custom_idea_text", None),
            "locality": getattr(plan.profile, "locality", None),
            "city": getattr(plan.profile, "city", None),
            "state": getattr(plan.profile, "state", None),
            "country": getattr(plan.profile, "country", "India"),
            "primary_usp": getattr(plan.profile, "primary_usp", None),
            "target_audience_notes": getattr(plan.profile, "target_audience_notes", None),
            "target_customer": plan.profile.target_customer,
            "constraints": plan.profile.constraints
        } if plan.profile else None,
        "executive_summary": plan.executive_summary,
        "opportunity": plan.opportunity,
        "market_analysis": plan.market_analysis,
        "customer_analysis": plan.customer_analysis,
        "competitor_analysis": plan.competitor_analysis,
        "business_model": plan.business_model,
        "capital_allocation": plan.capital_allocation,
        "cost_analysis": plan.cost_analysis,
        "revenue_scenarios": plan.revenue_scenarios,
        "break_even_analysis": plan.break_even_analysis,
        "location_analysis": plan.location_analysis,
        "compliance_checklist": plan.compliance_checklist,
        "marketing_strategy": plan.marketing_strategy,
        "early_revenue_plan": plan.early_revenue_plan,
        "growth_plan": plan.growth_plan,
        "risk_register": plan.risk_register,
        "launch_roadmap": plan.launch_roadmap,
        "critic_feedback": plan.critic_feedback,
        "revision_count": plan.revision_count,
        "agent_runs": [
            {
                "id": r.id,
                "agent_name": r.agent_name,
                "status": r.status,
                "step_order": r.step_order,
                "summary": r.summary,
                "output_payload": r.output_payload,
                "revision_count": r.revision_count,
                "critic_issues": r.critic_issues,
                "execution_time_ms": r.execution_time_ms,
                "created_at": r.created_at
            }
            for r in runs
        ],
        "created_at": plan.created_at,
        "updated_at": plan.updated_at
    }

@router.get("/{plan_id}/agents")
def get_plan_agents(plan_id: str, db: Session = Depends(get_db)):
    runs = db.query(AgentRun).filter(AgentRun.plan_id == plan_id).order_by(AgentRun.step_order.asc()).all()
    return [
        {
            "id": r.id,
            "agent_name": r.agent_name,
            "status": r.status,
            "step_order": r.step_order,
            "summary": r.summary,
            "output_payload": r.output_payload,
            "revision_count": r.revision_count,
            "critic_issues": r.critic_issues,
            "execution_time_ms": r.execution_time_ms,
            "created_at": r.created_at
        }
        for r in runs
    ]

@router.get("/{plan_id}/report")
def get_plan_report(plan_id: str, db: Session = Depends(get_db)):
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    
    return {
        "title": plan.title,
        "prepared_by": "NEXORA Multi-Agent Planning Platform",
        "generated_at": plan.updated_at or plan.created_at,
        "profile": {
            "name": plan.profile.business_name,
            "sector": plan.profile.sector,
            "location": plan.profile.location,
            "capital": plan.profile.capital,
            "currency": plan.profile.currency
        } if plan.profile else {},
        "feasibility_score": plan.feasibility_score,
        "score_breakdown": plan.score_breakdown,
        "executive_summary": plan.executive_summary,
        "capital_allocation": plan.capital_allocation,
        "financial_scenarios": plan.revenue_scenarios,
        "break_even": plan.break_even_analysis,
        "compliance_checklist": plan.compliance_checklist,
        "risk_register": plan.risk_register,
        "launch_roadmap": plan.launch_roadmap
    }
