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
        business_start_mode=profile_in.business_start_mode,
        custom_idea_text=profile_in.custom_idea_text,
        location=profile_in.location,
        locality=profile_in.locality,
        city=profile_in.city or profile_in.location,
        state=profile_in.state,
        country=profile_in.country or "India",
        capital=profile_in.capital,
        currency=profile_in.currency,
        objective=profile_in.objective,
        risk_preference=profile_in.risk_preference,
        time_horizon=profile_in.time_horizon,
        experience_level=profile_in.experience_level,
        target_customer=profile_in.target_customer,
        constraints=profile_in.constraints
    )
    db.add(profile)

    plan = BusinessPlan(
        id=plan_id,
        profile_id=profile_id,
        title=f"{profile_in.business_name} — {profile_in.business_start_mode} Strategic Launch Plan",
        status="running",
        feasibility_score=0.0
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    return {
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
    Streams live 16-agent execution events, critic loop debates, and progress percentages.
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
        "business_start_mode": profile.business_start_mode,
        "custom_idea_text": profile.custom_idea_text,
        "location": profile.location,
        "locality": profile.locality,
        "city": profile.city,
        "state": profile.state,
        "country": profile.country,
        "capital": profile.capital,
        "currency": profile.currency,
        "objective": profile.objective,
        "risk_preference": profile.risk_preference,
        "time_horizon": profile.time_horizon,
        "experience_level": profile.experience_level,
        "target_customer": profile.target_customer,
        "constraints": profile.constraints
    }

    return StreamingResponse(
        orchestrator.stream_orchestration(profile_dict, db, plan_id),
        media_type="text/event-stream"
    )

@router.post("/{plan_id}/execute-sync")
def execute_plan_sync(plan_id: str, db: Session = Depends(get_db)):
    """
    Executes the entire 16-agent multi-agent pipeline synchronously and returns the completed plan.
    """
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    
    profile = db.query(BusinessProfile).filter(BusinessProfile.id == plan.profile_id).first()
    profile_dict = {
        "business_name": profile.business_name,
        "sector": profile.sector,
        "business_type": profile.business_type,
        "business_start_mode": profile.business_start_mode,
        "custom_idea_text": profile.custom_idea_text,
        "location": profile.location,
        "locality": profile.locality,
        "city": profile.city,
        "state": profile.state,
        "country": profile.country,
        "capital": profile.capital,
        "currency": profile.currency,
        "objective": profile.objective,
        "risk_preference": profile.risk_preference,
        "time_horizon": profile.time_horizon,
        "experience_level": profile.experience_level,
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
            "business_start_mode": prof.business_start_mode if prof else "Home-Based",
            "location": prof.location if prof else "Hyderabad",
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
            "business_start_mode": plan.profile.business_start_mode,
            "custom_idea_text": plan.profile.custom_idea_text,
            "location": plan.profile.location,
            "locality": plan.profile.locality,
            "city": plan.profile.city,
            "state": plan.profile.state,
            "country": plan.profile.country,
            "capital": plan.profile.capital,
            "currency": plan.profile.currency,
            "objective": plan.profile.objective,
            "risk_preference": plan.profile.risk_preference,
            "time_horizon": plan.profile.time_horizon,
            "experience_level": plan.profile.experience_level,
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
    """
    Generates a professional 22-section Business Launch Report.
    """
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    
    prof = plan.profile
    early_rev = plan.early_revenue_plan or {}
    growth = plan.growth_plan or {}
    roadmap = plan.launch_roadmap or {}
    tactical_30d = roadmap.get("tactical_30d", []) if isinstance(roadmap, dict) else []
    master_9 = roadmap.get("master_9_phase", []) if isinstance(roadmap, dict) else (roadmap if isinstance(roadmap, list) else [])

    return {
        "report_title": f"NEXORA Master Launch & Strategy Blueprint: {plan.title}",
        "prepared_for": prof.business_name if prof else "Founder",
        "generated_at": plan.updated_at or plan.created_at,
        "platform_version": "NEXORA Multi-Agent Platform v2.0",
        
        # Section 1: Executive Summary
        "section_1_executive_summary": plan.executive_summary or {"summary": "Executive summary generated by Strategy Agent."},
        
        # Section 2: Business Idea
        "section_2_business_idea": {
            "business_name": prof.business_name if prof else "Venture",
            "start_mode": prof.business_start_mode if prof else "Home-Based",
            "sector": prof.sector if prof else "food-beverage",
            "idea_description": prof.custom_idea_text or prof.business_type if prof else "Artisanal Product",
            "capital": prof.capital if prof else 300000.0,
            "currency": prof.currency if prof else "INR"
        },
        
        # Section 3: Business Model
        "section_3_business_model": plan.business_model or {},
        
        # Section 4: Market Analysis
        "section_4_market_analysis": plan.market_analysis or {},
        
        # Section 5: Customer Analysis
        "section_5_customer_analysis": plan.customer_analysis or {},
        
        # Section 6: Competitor Analysis
        "section_6_competitor_analysis": plan.competitor_analysis or {},
        
        # Section 7: Location Analysis
        "section_7_location_analysis": plan.location_analysis or {},
        
        # Section 8: Capital Allocation
        "section_8_capital_allocation": plan.capital_allocation or {},
        
        # Section 9: Cost Analysis
        "section_9_cost_analysis": plan.cost_analysis or {},
        
        # Section 10: Revenue Scenarios
        "section_10_revenue_scenarios": plan.revenue_scenarios or {},
        
        # Section 11: Break-even Assumptions
        "section_11_break_even_assumptions": plan.break_even_analysis or {},
        
        # Section 12: Early Revenue Strategy
        "section_12_early_revenue_strategy": {
            "opportunity": early_rev.get("early_revenue_opportunity"),
            "recommended_channels": early_rev.get("recommended_channels"),
            "launch_offer": early_rev.get("launch_offer")
        },
        
        # Section 13: First 10 Customers Plan
        "section_13_first_10_customers_plan": early_rev.get("first_10_customer_strategy", []),
        
        # Section 14: 30-Day Marketing Plan
        "section_14_30_day_marketing_plan": plan.marketing_strategy or {},
        
        # Section 15: Growth Strategy
        "section_15_growth_strategy": {
            "brand_positioning": growth.get("brand_positioning"),
            "campaign_ideas": growth.get("campaign_ideas"),
            "growth_kpis": growth.get("growth_kpis")
        },
        
        # Section 16: Compliance Checklist
        "section_16_compliance_checklist": plan.compliance_checklist or {},
        
        # Section 17: Risk Register
        "section_17_risk_register": plan.risk_register or [],
        
        # Section 18: Risk Mitigation
        "section_18_risk_mitigation": [
            {"risk": r.get("risk"), "mitigation": r.get("mitigation")} 
            for r in (plan.risk_register or []) if isinstance(r, dict)
        ],
        
        # Section 19: 30-Day Launch Plan
        "section_19_30_day_launch_plan": tactical_30d or early_rev.get("revenue_action_plan_30d", {}),
        
        # Section 20: Long-Term Roadmap
        "section_20_long_term_roadmap": master_9,
        
        # Section 21: Assumptions
        "section_21_assumptions": [
            f"Business maintains lean {prof.business_start_mode if prof else 'Home-Based'} overhead",
            "Founder actively executes customer sampling and community outreach",
            "Working capital reserve is protected and not diverted into non-essential early tooling"
        ],
        
        # Section 22: Confidence & Responsible AI Disclaimer
        "section_22_confidence_and_disclaimer": {
            "feasibility_score": plan.feasibility_score,
            "rating_label": plan.score_breakdown.get("rating_label") if plan.score_breakdown else "High Feasibility",
            "confidence_rating": "High (Cross-Agent Validated with Critic Loop)",
            "disclaimer": (
                "NEXORA is a strategic decision-support platform designed to model, test, and de-risk business execution. "
                "All market estimates, customer conversion rates, and revenue curves are calibrated from empirical industry benchmarks. "
                "Founders are advised to verify regional statutory licensing requirements before committing capital."
            )
        }
    }
