import pytest
from fastapi.testclient import TestClient
from app.db.init_db import init_db
from app.main import app
from app.agents.business_understanding import BusinessUnderstandingAgent
from app.agents.market_research import MarketResearchAgent
from app.agents.customer_analysis import CustomerAnalysisAgent
from app.agents.competitor_analysis import CompetitorAnalysisAgent
from app.agents.location_analysis import LocationAnalysisAgent
from app.agents.business_model import BusinessModelAgent
from app.agents.capital_planning import CapitalPlanningAgent
from app.agents.cost_revenue import CostRevenueAgent
from app.agents.compliance import ComplianceAgent
from app.agents.marketing import MarketingAgent
from app.agents.risk_critic import RiskCriticAgent
from app.agents.strategy import StrategyAgent
from app.services.scoring_engine import calculate_feasibility_score
from app.services.what_if_engine import simulate_what_if

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    init_db()

client = TestClient(app)

def test_health_check():
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "NEXORA" in data["service"]

def test_get_sectors():
    resp = client.get("/api/v1/sectors")
    assert resp.status_code == 200
    sectors = resp.json()
    assert len(sectors) >= 8
    slugs = [s["slug"] for s in sectors]
    assert "food-beverage" in slugs
    assert "software-saas" in slugs

def test_guest_auth():
    resp = client.post("/api/v1/auth/guest")
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["is_guest"] is True

def test_all_12_agents_execution():
    context = {
        "profile": {
            "business_name": "Artisan Bowls & Brew",
            "sector": "food-beverage",
            "business_type": "Artisanal Cloud Kitchen & Quick Service",
            "location": "Hyderabad",
            "capital": 1000000.0,
            "currency": "INR",
            "business_start_mode": "Physical Store",
            "risk_preference": "Moderate",
            "time_horizon": "3 years",
            "experience_level": "Beginner",
            "target_customer": "Tech employees and young urbanites"
        }
    }

    bu = BusinessUnderstandingAgent().run(context)
    assert bu["status"] == "completed"
    assert "data" in bu and bu["data"]["normalized_capital"] == 1000000.0

    mr = MarketResearchAgent().run(context)
    assert mr["status"] == "completed"
    assert "TAM" in mr["findings"][0]["metric"]

    ca = CustomerAnalysisAgent().run(context)
    assert len(ca["data"]["personas"]) >= 3

    comp = CompetitorAnalysisAgent().run(context)
    assert len(comp["data"]["competitors"]) >= 3

    loc = LocationAnalysisAgent().run(context)
    assert len(loc["data"]["recommended_zones"]) >= 1

    bm = BusinessModelAgent().run(context)
    assert len(bm["data"]["revenue_streams"]) >= 3

    cap = CapitalPlanningAgent().run(context)
    assert len(cap["data"]["chart_data"]) == 8

    cost = CostRevenueAgent().run(context)
    assert "baseline" in cost["data"]["scenarios"]

    cmp = ComplianceAgent().run(context)
    assert len(cmp["data"]["checklist"]) >= 4

    mkt = MarketingAgent().run(context)
    assert len(mkt["data"]["phases"]) == 3

    critic = RiskCriticAgent().run({"profile": context["profile"], "critic_iteration": 1, "capital_data": cap["data"], "cost_data": cost["data"]})
    assert "verdict" in critic["data"]

    strat = StrategyAgent().run(context)
    assert len(strat["data"]["roadmap"]) == 9

def test_critic_feedback_and_revision_loop():
    profile = {
        "business_name": "Artisan Bowls & Brew",
        "sector": "food-beverage",
        "location": "Hyderabad",
        "capital": 1000000.0,
        "currency": "INR",
        "business_start_mode": "Physical Store",
        "risk_preference": "Moderate"
    }
    
    cap_initial = CapitalPlanningAgent().run({"profile": profile, "is_revision": False})
    cost_initial = CostRevenueAgent().run({"profile": profile, "is_revision": False})
    
    critic_pass_1 = RiskCriticAgent().run({
        "profile": profile,
        "critic_iteration": 1,
        "capital_data": cap_initial["data"],
        "cost_data": cost_initial["data"]
    })
    assert critic_pass_1["data"]["revision_needed"] is True
    assert "capital_planning" in critic_pass_1["data"]["target_agents"]
    
    cap_revised = CapitalPlanningAgent().run({
        "profile": profile,
        "is_revision": True,
        "critic_instruction": critic_pass_1["data"]["revision_instruction"]
    })
    assert cap_revised["data"]["safety_buffer_ratio"] == 25.0
    
    critic_pass_2 = RiskCriticAgent().run({
        "profile": profile,
        "critic_iteration": 2,
        "capital_data": cap_revised["data"],
        "cost_data": cost_initial["data"]
    })
    assert critic_pass_2["data"]["revision_needed"] is False
    assert critic_pass_2["data"]["verdict"] == "VALIDATION_APPROVED"

def test_scoring_and_what_if():
    profile = {
        "business_name": "Artisan Bowls",
        "sector": "food-beverage",
        "location": "Hyderabad",
        "capital": 1000000.0,
        "currency": "INR",
        "risk_preference": "Moderate",
        "business_type": "Artisanal Quick Service Cafe",
        "target_customer": "Urban professionals"
    }
    score_res = calculate_feasibility_score(profile, {})
    assert 0 <= score_res["overall_score"] <= 100
    assert score_res["capital_fit"] > 0
    assert score_res["market_attractiveness"] > 0

    mock_plan = {
        "id": "mock-plan-1",
        "feasibility_score": score_res["overall_score"],
        "profile": profile,
        "capital_allocation": {"breakdown": {"Working Capital Reserve": 180000.0}},
        "cost_analysis": {"monthly_operating_cost": 120000.0},
        "revenue_scenarios": {"baseline": {"year1_revenue": 2150000.0}},
        "break_even_analysis": {"break_even_month": 7}
    }
    sim_res = simulate_what_if(mock_plan, {"capital": 1800000.0, "scale_factor": 1.2})
    assert sim_res["new_score"] >= sim_res["previous_score"]
    assert len(sim_res["changes"]) >= 2


def test_end_to_end_plan_flow():
    # 1. Create plan profile
    payload = {
        "business_name": "Artisan Bowls Hyderabad",
        "sector": "food-beverage",
        "business_type": "Artisanal Cloud Kitchen & Quick Service",
        "location": "Hyderabad",
        "capital": 1000000.0,
        "currency": "INR",
        "objective": "Launch high-growth cloud kitchen in Hitec City with strong unit economics",
        "risk_preference": "Moderate",
        "time_horizon": "3 years",
        "experience_level": "Beginner",
        "target_customer": "IT employees and young urbanites in Madhapur/Gachibowli",
        "constraints": "Keep initial capex under 40% of capital"
    }
    create_resp = client.post("/api/v1/plans/", json=payload)
    assert create_resp.status_code == 200
    plan_info = create_resp.json()
    plan_id = plan_info["plan_id"]
    assert plan_id is not None

    # 2. Execute plan synchronously
    exec_resp = client.post(f"/api/v1/plans/{plan_id}/execute-sync")
    assert exec_resp.status_code == 200

    # 3. Retrieve complete plan
    get_resp = client.get(f"/api/v1/plans/{plan_id}")
    assert get_resp.status_code == 200
    plan_data = get_resp.json()
    assert plan_data["status"] == "completed"
    assert plan_data["feasibility_score"] >= 70.0
    assert len(plan_data["agent_runs"]) >= 12
    assert plan_data["capital_allocation"] is not None
    assert plan_data["revenue_scenarios"] is not None
    assert plan_data["launch_roadmap"] is not None
    assert plan_data["compliance_checklist"] is not None
    assert plan_data["critic_feedback"] is not None

    # 4. Check What-If simulation against this real created plan
    sim_resp = client.post("/api/v1/what-if", json={
        "plan_id": plan_id,
        "capital": 1500000.0,
        "scale_factor": 1.2
    })
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert sim_data["previous_score"] == plan_data["feasibility_score"]
    assert "changes" in sim_data

def test_idea_classifier_nlp():
    # 1. Test natural language idea understanding endpoint
    resp = client.post("/api/v1/business/understand", json={
        "idea_text": "I have ₹3 lakh and want to start a homemade healthy snacks business in Hyderabad."
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    profile = data["parsed_profile"]
    assert profile["sector"] == "food-beverage"
    assert profile["business_start_mode"] == "Home-Based"
    assert profile["capital"] == 300000.0
    assert profile["currency"] == "INR"
    assert "Hyderabad" in profile["city"]
    assert len(profile["initial_equipment"]) >= 2
    assert len(profile["key_permits"]) >= 2

def test_location_benchmarks_and_comparison():
    # 1. Test get locations
    resp = client.get("/api/v1/locations")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert len(data["cities"]) >= 4

    # 2. Test compare locations
    comp_resp = client.post("/api/v1/location/compare", json={
        "locations": ["Kondapur", "Miyapur"],
        "sector": "food-beverage",
        "start_mode": "Home-Based",
        "capital": 300000.0
    })
    assert comp_resp.status_code == 200
    comp_data = comp_resp.json()
    assert comp_data["success"] is True
    assert "recommended_location" in comp_data["comparison"]
    assert len(comp_data["comparison"]["locations_compared"]) >= 2

def test_early_revenue_and_growth_agents():
    from app.agents.early_revenue import EarlyRevenueAgent
    from app.agents.growth import GrowthAgent

    ctx = {
        "profile": {
            "business_name": "NutriBites Kitchen",
            "sector": "food-beverage",
            "business_start_mode": "Home-Based",
            "capital": 300000.0,
            "currency": "INR",
            "location": "Kondapur, Hyderabad"
        }
    }
    
    er_res = EarlyRevenueAgent().run(ctx)
    assert er_res["status"] == "completed"
    assert "first_10_playbook" in er_res["data"]
    assert len(er_res["data"]["action_plan_30_days"]) == 4
    assert "launch_offer" in er_res["data"]

    gr_res = GrowthAgent().run(ctx)
    assert gr_res["status"] == "completed"
    assert "retention_engine" in gr_res["data"]
    assert len(gr_res["data"]["growth_milestones"]) == 3
    assert len(gr_res["data"]["growth_kpis"]) >= 4

def test_signature_demo_home_based_snacks():
    # End-to-end run for the featured ₹3 Lakh Home-Based Healthy Snacks business in Hyderabad
    payload = {
        "business_name": "NutriBites Artisanal Kitchen",
        "sector": "food-beverage",
        "business_type": "Homemade Healthy Snacks & Millet Treats",
        "business_start_mode": "Home-Based",
        "location": "Kondapur, Hyderabad",
        "locality": "Kondapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "capital": 300000.0,
        "currency": "INR",
        "objective": "Launch high-margin home-based healthy snack brand with rapid neighborhood adoption",
        "risk_preference": "Moderate",
        "time_horizon": "3 years",
        "experience_level": "Beginner",
        "primary_usp": "100% natural, preservative-free artisanal millet snacks freshly prepared"
    }

    create_resp = client.post("/api/v1/plans/", json=payload)
    assert create_resp.status_code == 200
    plan_id = create_resp.json()["plan_id"]

    exec_resp = client.post(f"/api/v1/plans/{plan_id}/execute-sync")
    assert exec_resp.status_code == 200

    plan_resp = client.get(f"/api/v1/plans/{plan_id}")
    assert plan_resp.status_code == 200
    plan = plan_resp.json()
    assert plan["status"] == "completed"
    assert plan["early_revenue_plan"] is not None
    assert plan["growth_plan"] is not None
    assert plan["early_revenue_plan"]["first_10_playbook"]["title"] is not None
    assert len(plan["growth_plan"]["growth_milestones"]) == 3
    # Check that home-based model did not incur commercial lease deposit
    assert "Setup & Lease Security Deposit" not in plan["capital_allocation"]["categories"]

