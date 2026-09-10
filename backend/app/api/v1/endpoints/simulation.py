import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.plan import BusinessPlan, Scenario
from app.schemas.simulation import WhatIfRequest, WhatIfResponse
from app.services.what_if_engine import simulate_what_if

router = APIRouter()

@router.post("/what-if")
def run_what_if_simulation(req: WhatIfRequest, db: Session = Depends(get_db)):
    plan = db.query(BusinessPlan).filter(BusinessPlan.id == req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")

    prof = plan.profile
    profile_dict = {
        "business_name": prof.business_name if prof else "Venture",
        "sector": prof.sector if prof else "food-beverage",
        "business_type": prof.business_type if prof else "Startup",
        "location": prof.location if prof else "Hyderabad",
        "capital": prof.capital if prof else 1000000.0,
        "currency": prof.currency if prof else "INR",
        "risk_preference": prof.risk_preference if prof else "Moderate",
        "time_horizon": prof.time_horizon if prof else "3 years"
    }

    plan_data = {
        "id": plan.id,
        "feasibility_score": plan.feasibility_score,
        "profile": profile_dict,
        "capital_allocation": plan.capital_allocation or {},
        "cost_analysis": plan.cost_analysis or {},
        "revenue_scenarios": plan.revenue_scenarios or {},
        "break_even_analysis": plan.break_even_analysis or {}
    }

    changes_dict = {}
    if req.capital is not None:
        changes_dict["capital"] = req.capital
    if req.risk_preference:
        changes_dict["risk_preference"] = req.risk_preference
    if req.time_horizon:
        changes_dict["time_horizon"] = req.time_horizon
    if req.location:
        changes_dict["location"] = req.location
    if req.scale_factor is not None:
        changes_dict["scale_factor"] = req.scale_factor

    simulation_result = simulate_what_if(plan_data, changes_dict)

    # Persist scenario run
    try:
        scenario_record = Scenario(
            id=str(uuid.uuid4()),
            plan_id=plan.id,
            name=f"What-If: Capital={req.capital or prof.capital} / Scale={req.scale_factor}x",
            capital_delta=(req.capital - prof.capital) if req.capital and prof else 0.0,
            revenue_impact=simulation_result["revenue_comparison"]["new_baseline_year1"] - simulation_result["revenue_comparison"]["original_baseline_year1"],
            runway_months=simulation_result["cost_comparison"]["new_runway_months"],
            feasibility_delta=simulation_result["score_delta"],
            params_json=changes_dict,
            results_json=simulation_result
        )
        db.add(scenario_record)
        db.commit()
    except Exception as e:
        db.rollback()

    return simulation_result
