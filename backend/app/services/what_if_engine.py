from typing import Dict, Any, List
from app.services.scoring_engine import calculate_feasibility_score

def simulate_what_if(original_plan: Dict[str, Any], changes: Dict[str, Any]) -> Dict[str, Any]:
    """
    Interactive What-If Simulation Engine:
    Recalculates capital allocation, cost-revenue curves, break-even timelines,
    and feasibility scores based on user modifications.
    """
    profile = original_plan.get("profile", {})
    original_capital = float(profile.get("capital", 1000000))
    currency = profile.get("currency", "INR")
    
    new_capital = float(changes.get("capital", original_capital))
    new_risk = changes.get("risk_preference", profile.get("risk_preference", "Moderate"))
    new_horizon = changes.get("time_horizon", profile.get("time_horizon", "3 years"))
    new_location = changes.get("location", profile.get("location", "Hyderabad"))
    scale_factor = float(changes.get("scale_factor", 1.0))
    
    # Track changed parameters
    diffs = []
    if new_capital != original_capital:
        delta = new_capital - original_capital
        sign = "+" if delta > 0 else ""
        diffs.append({
            "field": "Available Capital",
            "original_value": f"{currency} {original_capital:,.0f}",
            "new_value": f"{currency} {new_capital:,.0f}",
            "delta_display": f"{sign}{currency} {delta:,.0f} ({((new_capital/original_capital)-1)*100:+.1f}%)"
        })
    if new_risk != profile.get("risk_preference"):
        diffs.append({
            "field": "Risk Preference",
            "original_value": profile.get("risk_preference"),
            "new_value": new_risk,
            "delta_display": f"Shifted to {new_risk}"
        })
    if new_horizon != profile.get("time_horizon"):
        diffs.append({
            "field": "Time Horizon",
            "original_value": profile.get("time_horizon"),
            "new_value": new_horizon,
            "delta_display": f"Adjusted to {new_horizon}"
        })
    if new_location != profile.get("location"):
        diffs.append({
            "field": "Location",
            "original_value": profile.get("location"),
            "new_value": new_location,
            "delta_display": f"Relocated to {new_location}"
        })
    if scale_factor != 1.0:
        diffs.append({
            "field": "Operational Scale",
            "original_value": "1.0x (Standard)",
            "new_value": f"{scale_factor}x",
            "delta_display": f"{((scale_factor - 1.0)*100):+.0f}% scale adjustment"
        })

    # Recalculate Profile copy
    sim_profile = dict(profile)
    sim_profile["capital"] = new_capital
    sim_profile["risk_preference"] = new_risk
    sim_profile["time_horizon"] = new_horizon
    sim_profile["location"] = new_location
    
    # Recalculate Feasibility Score
    prev_score = float(original_plan.get("feasibility_score", 78.0))
    new_scoring = calculate_feasibility_score(sim_profile, original_plan)
    new_score = new_scoring["overall_score"]
    score_delta = round(new_score - prev_score, 1)

    # Recalculate Capital Allocation
    orig_alloc = original_plan.get("capital_allocation", {}).get("breakdown", {})
    alloc_weights = {
        "Setup & Infrastructure": 0.18,
        "Equipment & Machinery": 0.25,
        "Initial Inventory": 0.10,
        "Employees & Staffing": 0.15,
        "Marketing & Customer Acquisition": 0.12,
        "Technology & POS": 0.05,
        "Working Capital Reserve": 0.10 if new_risk.lower() != "conservative" else 0.15,
        "Emergency Contingency": 0.05
    }
    
    new_alloc = {}
    for cat, weight in alloc_weights.items():
        new_alloc[cat] = round(new_capital * weight, 0)
        
    # Cost & Revenue comparison
    orig_costs = original_plan.get("cost_analysis", {})
    orig_rev = original_plan.get("revenue_scenarios", {})
    
    # Capital impact on runway
    orig_monthly_burn = float(orig_costs.get("monthly_operating_cost", 120000))
    new_monthly_burn = round(orig_monthly_burn * (0.6 + 0.4 * scale_factor) * (new_capital / original_capital)**0.25, 0)
    
    orig_runway = round(original_capital * 0.15 / max(1, orig_monthly_burn), 1)
    new_runway = round((new_alloc["Working Capital Reserve"] + new_alloc["Emergency Contingency"]) / max(1, new_monthly_burn), 1)

    # Break-even shifts
    orig_be_months = int(original_plan.get("break_even_analysis", {}).get("break_even_month", 7))
    if new_capital > original_capital and scale_factor >= 1.0:
        new_be_months = max(4, orig_be_months - 1)
    elif new_capital < original_capital:
        new_be_months = orig_be_months + 2
    else:
        new_be_months = orig_be_months

    # Risk deltas
    risk_delta = []
    if new_capital < original_capital:
        risk_delta.append({
            "type": "INCREASED_RISK",
            "title": "Tight Working Capital Runway",
            "detail": f"Runway reduced from {orig_runway} to {new_runway} months. Requires strict break-even execution."
        })
    elif new_capital > original_capital:
        risk_delta.append({
            "type": "REDUCED_RISK",
            "title": "Comfortable Cash Cushion",
            "detail": f"Runway extended to {new_runway} months. Allows higher marketing experimentation and customer retention programs."
        })

    if new_risk.lower() == "aggressive":
        risk_delta.append({
            "type": "CAUTION",
            "title": "Aggressive Growth Risk",
            "detail": "Higher marketing allocation accelerates customer acquisition but increases vulnerability to ad fatigue."
        })

    summary_insight = (
        f"By adjusting capital to {currency} {new_capital:,.0f} and scale to {scale_factor}x, "
        f"the overall feasibility score changes by {score_delta:+.1f} points (now {new_score}/100). "
        f"Estimated cash runway is now {new_runway} months with break-even anticipated around Month {new_be_months}."
    )

    return {
        "plan_id": original_plan.get("id", ""),
        "changes": diffs,
        "previous_score": prev_score,
        "new_score": new_score,
        "score_delta": score_delta,
        "score_breakdown": new_scoring,
        "capital_allocation_comparison": {
            "original": orig_alloc,
            "new": new_alloc
        },
        "cost_comparison": {
            "original_monthly_burn": orig_monthly_burn,
            "new_monthly_burn": new_monthly_burn,
            "original_runway_months": orig_runway,
            "new_runway_months": new_runway
        },
        "revenue_comparison": {
            "original_baseline_year1": orig_rev.get("baseline", {}).get("year1_revenue", 1800000),
            "new_baseline_year1": round(float(orig_rev.get("baseline", {}).get("year1_revenue", 1800000)) * (new_capital / original_capital)**0.35 * scale_factor, 0)
        },
        "break_even_comparison": {
            "original_month": orig_be_months,
            "new_month": new_be_months,
            "variance_months": new_be_months - orig_be_months
        },
        "risk_delta": risk_delta,
        "roadmap_adjustments": [
            f"Phase 4 Financials updated with {currency} {new_alloc['Working Capital Reserve']:,.0f} reserve balance",
            f"Phase 7 Launch marketing scaled by {scale_factor}x to match updated burn profile",
            f"Target operational break-even milestone recalibrated to Month {new_be_months}"
        ],
        "summary_insight": summary_insight
    }
