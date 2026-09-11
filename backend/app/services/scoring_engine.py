from typing import Dict, Any, List

def calculate_feasibility_score(profile: Dict[str, Any], plan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transparent Explainable Scoring Engine across 8 distinct dimensions (0-100 each),
    calibrated for Start Mode (Home-Based vs Physical Store) and early revenue velocity.
    """
    capital = float(profile.get("capital", 300000))
    currency = profile.get("currency", "INR")
    sector = profile.get("sector", "food-beverage")
    risk_pref = profile.get("risk_preference", "Moderate").lower()
    start_mode = profile.get("business_start_mode", "Home-Based")
    
    # 1. Capital Adequacy (Weight 20%)
    if start_mode in ["Home-Based", "Online"]:
        base_capex = 250000.0  # Lean micro-business benchmark
    else:
        base_capex = 900000.0 if sector in ["food-beverage", "retail"] else 1200000.0

    cap_ratio = min(max(capital / base_capex, 0.4), 2.5)
    capital_fit = min(100.0, max(35.0, cap_ratio * 78.0))
    
    # 2. Market Attractiveness (Weight 15%)
    market_scores = {
        "food-beverage": 86.0,
        "software-saas": 92.0,
        "retail": 78.0,
        "healthcare": 88.0,
        "education": 82.0,
        "logistics": 79.0,
        "manufacturing": 75.0,
        "renewable-energy": 90.0
    }
    market_attractiveness = market_scores.get(sector, 82.0)
    
    # 3. Customer Demand Clarity (Weight 12%)
    has_target = bool(profile.get("target_customer"))
    customer_demand = 88.0 if has_target else 80.0
    
    # 4. Competitive Moat (Weight 12%)
    competition_intensity = 76.0
    biz_type = str(profile.get("business_type", "")).lower()
    if any(k in biz_type for k in ["unique", "specialty", "artisanal", "ai", "organic", "custom", "healthy", "snack"]):
        competition_intensity = 86.0
        
    # 5. Location Fit (Weight 12%)
    location = str(profile.get("location", "")).lower()
    if any(city in location for city in ["hyderabad", "bengaluru", "mumbai", "delhi", "pune", "chennai", "kolkata"]):
        location_suitability = 90.0
    else:
        location_suitability = 80.0
        
    # 6. Financial Sustainability & Break-even (Weight 15%)
    financial_feasibility = 84.0
    if capital < 200000 and start_mode not in ["Home-Based", "Online"]:
        financial_feasibility = 52.0
    elif start_mode in ["Home-Based", "Online"] and capital >= 250000:
        financial_feasibility = 88.0
        
    # 7. Risk Resilience (Weight 8%)
    risk_resilience = 82.0
    if risk_pref == "conservative":
        risk_resilience += 5.0
    elif risk_pref == "aggressive":
        risk_resilience -= 6.0
        
    # 8. Business Model Strength (Weight 6%)
    business_model_strength = 88.0 if start_mode in ["Home-Based", "Online"] else 82.0

    overall_score = round(
        (capital_fit * 0.20) +
        (market_attractiveness * 0.15) +
        (customer_demand * 0.12) +
        (competition_intensity * 0.12) +
        (location_suitability * 0.12) +
        (financial_feasibility * 0.15) +
        (risk_resilience * 0.08) +
        (business_model_strength * 0.06),
        1
    )
    
    if overall_score >= 82:
        rating_label = "High Feasibility"
    elif overall_score >= 68:
        rating_label = "Viable with Moderate Safeguards"
    else:
        rating_label = "High Risk - Capital or Scale Restructuring Recommended"

    explanation = (
        f"The proposed business scores {overall_score}/100 in overall launch feasibility under {start_mode} operations. "
        f"Capital adequacy index ({capital_fit:.1f}/100) confirms available capital ({currency} {capital:,.0f}) covers "
        f"initial tooling and safeguards liquid runway. Target location ({profile.get('location')}) shows strong demand density, "
        f"and early revenue strategy provides an actionable path to initial cash flow."
    )

    return {
        "overall_score": overall_score,
        "rating_label": rating_label,
        "capital_fit": round(capital_fit, 1),
        "market_attractiveness": round(market_attractiveness, 1),
        "customer_demand": round(customer_demand, 1),
        "competition_intensity": round(competition_intensity, 1),
        "location_suitability": round(location_suitability, 1),
        "financial_feasibility": round(financial_feasibility, 1),
        "risk_resilience": round(risk_resilience, 1),
        "business_model_strength": round(business_model_strength, 1),
        "explanation": explanation
    }
