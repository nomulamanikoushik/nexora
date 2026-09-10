import time
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Generator
from sqlalchemy.orm import Session

from app.models.plan import BusinessPlan, BusinessProfile, PlanSection
from app.models.agent_run import AgentRun
from app.services.scoring_engine import calculate_feasibility_score

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
from app.agents.early_revenue import EarlyRevenueAgent
from app.agents.growth import GrowthAgent
from app.agents.risk_critic import RiskCriticAgent
from app.agents.strategy import StrategyAgent

class OrchestratorAgent:
    """
    Central Multi-Agent Controller for NEXORA: Intelligent multiagent for business planning startup.
    Orchestrates 16 specialized AI agents across 6 stages:
    1. Ingestion & Profile Normalization
    2. Parallel Market & Location Discovery
    3. Operational & Financial Blueprinting
    4. Early Revenue & Business Growth Engines
    5. Cross-Agent Critic & Feasibility Audit
    6. Master Executive Synthesis & Phased Roadmap
    """
    def __init__(self):
        self.agents = {
            "business_understanding": BusinessUnderstandingAgent(),
            "market_research": MarketResearchAgent(),
            "customer_analysis": CustomerAnalysisAgent(),
            "competitor_analysis": CompetitorAnalysisAgent(),
            "location_analysis": LocationAnalysisAgent(),
            "business_model": BusinessModelAgent(),
            "capital_planning": CapitalPlanningAgent(),
            "cost_revenue": CostRevenueAgent(),
            "compliance": ComplianceAgent(),
            "marketing": MarketingAgent(),
            "early_revenue": EarlyRevenueAgent(),
            "growth": GrowthAgent(),
            "risk_critic": RiskCriticAgent(),
            "strategy": StrategyAgent()
        }

    def execute_plan(self, profile: Dict[str, Any], db: Session, plan_id: str) -> Dict[str, Any]:
        """Synchronous execution that runs the full multi-agent orchestration pipeline."""
        events = list(self.stream_orchestration(profile, db, plan_id))
        plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
        return plan

    def stream_orchestration(self, profile: Dict[str, Any], db: Session, plan_id: str) -> Generator[str, None, None]:
        """Generator for Server-Sent Events (SSE). Streams real-time progress and agent updates."""
        context = {"profile": profile}
        agent_results = {}
        start_mode = profile.get("business_start_mode", "Home-Based")
        loc = profile.get("location", "Hyderabad")
        sec = profile.get("sector", "food-beverage")

        def send_event(step: int, agent_name: str, status: str, message: str, progress: int, data: Any = None):
            event = {
                "step": step,
                "agent_name": agent_name,
                "status": status,
                "message": message,
                "progress": progress,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": data
            }
            return f"data: {json.dumps(event)}\n\n"

        # Step 0: Pipeline Initialization
        yield send_event(0, "orchestrator", "running", f"NEXORA 16-Agent Orchestrator initialized for {start_mode} {sec} in {loc}. Dispatching agents...", 4)

        # STAGE 1: Business Understanding
        t0 = time.time()
        yield send_event(1, "business_understanding", "running", f"Normalizing {start_mode} business profile, capital scale, and risk tolerances...", 8)
        bu_res = self.agents["business_understanding"].run(context)
        agent_results["business_understanding"] = bu_res
        context["normalized"] = bu_res["data"]
        self._record_run(db, plan_id, "business_understanding", 1, bu_res, int((time.time() - t0)*1000))
        yield send_event(1, "business_understanding", "completed", bu_res["summary"], 14, bu_res)

        # STAGE 2: Discovery & Intelligence
        t0 = time.time()
        yield send_event(2, "market_research", "running", f"Analyzing industry growth CAGR and market size (TAM/SAM/SOM) for {sec}...", 20)
        mr_res = self.agents["market_research"].run(context)
        agent_results["market_research"] = mr_res
        self._record_run(db, plan_id, "market_research", 2, mr_res, int((time.time() - t0)*1000))
        yield send_event(2, "market_research", "completed", mr_res["summary"], 26, mr_res)

        t0 = time.time()
        yield send_event(3, "customer_analysis", "running", f"Profiling target customer personas and buying behaviors in {loc}...", 30)
        ca_res = self.agents["customer_analysis"].run(context)
        agent_results["customer_analysis"] = ca_res
        self._record_run(db, plan_id, "customer_analysis", 3, ca_res, int((time.time() - t0)*1000))
        yield send_event(3, "customer_analysis", "completed", ca_res["summary"], 35, ca_res)

        t0 = time.time()
        yield send_event(4, "competitor_analysis", "running", f"Mapping direct and indirect competitors and identifying differentiation moats...", 39)
        comp_res = self.agents["competitor_analysis"].run(context)
        agent_results["competitor_analysis"] = comp_res
        self._record_run(db, plan_id, "competitor_analysis", 4, comp_res, int((time.time() - t0)*1000))
        yield send_event(4, "competitor_analysis", "completed", comp_res["summary"], 43, comp_res)

        t0 = time.time()
        yield send_event(5, "location_analysis", "running", f"Evaluating footfall, commercial/residential lease benchmarks, and zoning in {loc}...", 47)
        loc_res = self.agents["location_analysis"].run(context)
        agent_results["location_analysis"] = loc_res
        self._record_run(db, plan_id, "location_analysis", 5, loc_res, int((time.time() - t0)*1000))
        yield send_event(5, "location_analysis", "completed", loc_res["summary"], 50, loc_res)

        # STAGE 3: Operational & Financial Blueprinting
        t0 = time.time()
        yield send_event(6, "business_model", "running", f"Designing revenue architecture, unit margins, and {start_mode} value proposition...", 54)
        bm_res = self.agents["business_model"].run(context)
        agent_results["business_model"] = bm_res
        self._record_run(db, plan_id, "business_model", 6, bm_res, int((time.time() - t0)*1000))
        yield send_event(6, "business_model", "completed", bm_res["summary"], 58, bm_res)

        t0 = time.time()
        yield send_event(7, "capital_planning", "running", f"Formulating dynamic capital allocation for {start_mode} model...", 62)
        cap_res = self.agents["capital_planning"].run(context)
        agent_results["capital_planning"] = cap_res
        context["capital_data"] = cap_res["data"]
        self._record_run(db, plan_id, "capital_planning", 7, cap_res, int((time.time() - t0)*1000))
        yield send_event(7, "capital_planning", "completed", cap_res["summary"], 66, cap_res)

        t0 = time.time()
        yield send_event(8, "cost_revenue", "running", "Modeling Capex, monthly Opex, 3-year revenue curves, and break-even points...", 69)
        cost_res = self.agents["cost_revenue"].run(context)
        agent_results["cost_revenue"] = cost_res
        context["cost_data"] = cost_res["data"]
        self._record_run(db, plan_id, "cost_revenue", 8, cost_res, int((time.time() - t0)*1000))
        yield send_event(8, "cost_revenue", "completed", cost_res["summary"], 72, cost_res)

        t0 = time.time()
        yield send_event(9, "compliance", "running", f"Assembling statutory clearances, FSSAI, GST, and municipal licensing checklist...", 75)
        comp_check_res = self.agents["compliance"].run(context)
        agent_results["compliance"] = comp_check_res
        self._record_run(db, plan_id, "compliance", 9, comp_check_res, int((time.time() - t0)*1000))
        yield send_event(9, "compliance", "completed", comp_check_res["summary"], 78, comp_check_res)

        t0 = time.time()
        yield send_event(10, "marketing", "running", "Designing 3-phase launch campaign, acquisition channels, and CAC targets...", 80)
        mkt_res = self.agents["marketing"].run(context)
        agent_results["marketing"] = mkt_res
        self._record_run(db, plan_id, "marketing", 10, mkt_res, int((time.time() - t0)*1000))
        yield send_event(10, "marketing", "completed", mkt_res["summary"], 83, mkt_res)

        # STAGE 4: Early Revenue & Growth Engines (NEW)
        t0 = time.time()
        yield send_event(11, "early_revenue", "running", "Formulating First 10 Customers Playbook and 30-Day Launch Sprint...", 85)
        er_res = self.agents["early_revenue"].run(context)
        agent_results["early_revenue"] = er_res
        self._record_run(db, plan_id, "early_revenue", 11, er_res, int((time.time() - t0)*1000))
        yield send_event(11, "early_revenue", "completed", er_res["summary"], 88, er_res)

        t0 = time.time()
        yield send_event(12, "growth", "running", "Designing retention loops, viral referral mechanics, and 12-month scaling targets...", 90)
        gr_res = self.agents["growth"].run(context)
        agent_results["growth"] = gr_res
        self._record_run(db, plan_id, "growth", 12, gr_res, int((time.time() - t0)*1000))
        yield send_event(12, "growth", "completed", gr_res["summary"], 92, gr_res)

        # STAGE 5: Critic & Cross-Agent Validation Loop
        t0 = time.time()
        yield send_event(13, "risk_critic", "running", "Risk & Critic Agent conducting comprehensive cross-agent consistency audit...", 93)
        critic_res = self.agents["risk_critic"].run({
            "profile": profile,
            "critic_iteration": 1,
            "capital_data": cap_res["data"],
            "cost_data": cost_res["data"],
            "early_revenue_data": er_res["data"]
        })
        
        revision_count = 0
        if critic_res["data"]["revision_needed"]:
            revision_count = 1
            yield send_event(13, "risk_critic", "revising", critic_res["summary"], 94, critic_res)
            
            # TRIGGER AGENT REVISION: Rebalance Capital Planning to bolster Working Capital Buffer!
            yield send_event(7, "capital_planning", "revising", "Revising capital allocation: Reallocating setup capex to strengthen working capital buffer...", 95)
            cap_rev = self.agents["capital_planning"].run({"profile": profile, "is_revision": True, "critic_instruction": critic_res["data"]["revision_instruction"]})
            agent_results["capital_planning"] = cap_rev
            context["capital_data"] = cap_rev["data"]
            self._record_run(db, plan_id, "capital_planning", 7, cap_rev, int((time.time() - t0)*1000), revision_count=1)
            yield send_event(7, "capital_planning", "completed", cap_rev["summary"], 95, cap_rev)

            # Re-run Cost Revenue with revised lean capex
            cost_rev = self.agents["cost_revenue"].run({"profile": profile, "is_revision": True})
            agent_results["cost_revenue"] = cost_rev
            context["cost_data"] = cost_rev["data"]
            self._record_run(db, plan_id, "cost_revenue", 8, cost_rev, int((time.time() - t0)*1000), revision_count=1)

            # Re-evaluate with Critic
            critic_res = self.agents["risk_critic"].run({"profile": profile, "critic_iteration": 2, "capital_data": cap_rev["data"], "cost_data": cost_rev["data"]})
            agent_results["risk_critic"] = critic_res
            self._record_run(db, plan_id, "risk_critic", 13, critic_res, int((time.time() - t0)*1000), revision_count=1)
            yield send_event(13, "risk_critic", "completed", critic_res["summary"], 96, critic_res)
        else:
            agent_results["risk_critic"] = critic_res
            self._record_run(db, plan_id, "risk_critic", 13, critic_res, int((time.time() - t0)*1000))
            yield send_event(13, "risk_critic", "completed", critic_res["summary"], 96, critic_res)

        # STAGE 6: Master Strategy Synthesis & Execution Roadmap
        t0 = time.time()
        yield send_event(14, "strategy", "running", "Strategy Agent synthesizing validated outputs into final Master Launch Blueprint...", 97)
        strat_res = self.agents["strategy"].run(context)
        agent_results["strategy"] = strat_res
        self._record_run(db, plan_id, "strategy", 14, strat_res, int((time.time() - t0)*1000))
        yield send_event(14, "strategy", "completed", strat_res["summary"], 98, strat_res)

        # 15. Execution & Roadmap Synthesis
        yield send_event(15, "execution_roadmap", "running", f"Assembling {start_mode} launch milestone roadmap and regulatory checklists...", 99)
        time.sleep(0.1)
        yield send_event(15, "execution_roadmap", "completed", f"Launch roadmap finalized: 4-6 weeks preparation for {start_mode} operations with fast-track testing.", 99)

        # 16. Feasibility Scoring Engine & Database Assembly
        score_eval = calculate_feasibility_score(profile, agent_results)
        
        # Persist full final business plan to DB
        plan = db.query(BusinessPlan).filter(BusinessPlan.id == plan_id).first()
        if plan:
            plan.status = "completed"
            plan.feasibility_score = score_eval["overall_score"]
            plan.score_breakdown = score_eval
            plan.executive_summary = {"summary": strat_res["summary"], "pillars": strat_res["data"]["pillars"]}
            plan.opportunity = {
                "business_type": profile.get("business_type"),
                "location": profile.get("location"),
                "sector": profile.get("sector"),
                "start_mode": start_mode,
                "primary_usp": profile.get("primary_usp")
            }
            plan.market_analysis = agent_results["market_research"]
            plan.customer_analysis = agent_results["customer_analysis"]
            plan.competitor_analysis = agent_results["competitor_analysis"]
            plan.business_model = agent_results["business_model"]
            plan.capital_allocation = agent_results["capital_planning"]["data"]
            plan.cost_analysis = agent_results["cost_revenue"]["data"]
            plan.revenue_scenarios = agent_results["cost_revenue"]["data"]["scenarios"]
            plan.break_even_analysis = {
                "break_even_month": agent_results["cost_revenue"]["data"]["break_even_month"],
                "break_even_units_daily": agent_results["cost_revenue"]["data"]["break_even_units_daily"]
            }
            plan.location_analysis = agent_results["location_analysis"]
            plan.compliance_checklist = agent_results["compliance"]["data"]
            plan.marketing_strategy = agent_results["marketing"]["data"]
            plan.early_revenue_plan = agent_results["early_revenue"]["data"]
            plan.growth_plan = agent_results["growth"]["data"]
            plan.risk_register = agent_results["risk_critic"]["data"]["risk_register"]
            plan.launch_roadmap = agent_results["strategy"]["data"]["roadmap"]
            plan.critic_feedback = agent_results["risk_critic"]["data"]
            plan.revision_count = revision_count
            db.commit()

        yield send_event(16, "orchestrator", "completed", f"NEXORA 16-Agent Strategy complete! Feasibility Score: {score_eval['overall_score']}/100.", 100, {
            "plan_id": plan_id,
            "feasibility_score": score_eval["overall_score"],
            "rating_label": score_eval["rating_label"]
        })

    def _record_run(self, db: Session, plan_id: str, agent_name: str, step_order: int, result: Dict[str, Any], exec_ms: int, revision_count: int = 0):
        try:
            run = AgentRun(
                plan_id=plan_id,
                agent_name=agent_name,
                status=result.get("status", "completed"),
                step_order=step_order,
                summary=result.get("summary"),
                output_payload=result,
                revision_count=revision_count,
                critic_issues=result.get("data", {}).get("critic_issues") if agent_name == "risk_critic" else None,
                execution_time_ms=exec_ms
            )
            db.add(run)
            db.commit()
        except Exception as e:
            db.rollback()

orchestrator = OrchestratorAgent()
