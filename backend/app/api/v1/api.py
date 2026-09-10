from fastapi import APIRouter
from app.api.v1.endpoints import auth, health, sectors, plans, simulation, idea, location, profiles

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(sectors.router, prefix="/sectors", tags=["Sectors & Benchmarks"])
api_router.include_router(plans.router, prefix="/plans", tags=["Business Plans & Multi-Agent Orchestrator"])
api_router.include_router(simulation.router, tags=["What-If Simulator"])
api_router.include_router(idea.router, prefix="/business", tags=["Business Understanding & NLP Classifier"])
api_router.include_router(location.router, tags=["Location Intelligence & Benchmarks"])
api_router.include_router(profiles.router, tags=["Business Profiles"])
