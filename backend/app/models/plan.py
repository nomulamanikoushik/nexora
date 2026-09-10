import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class BusinessProfile(Base):
    __tablename__ = 'business_profiles'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    business_name = Column(String(255), nullable=False)
    sector = Column(String(100), nullable=False)
    business_type = Column(String(255), nullable=False)
    location = Column(String(100), nullable=False)
    capital = Column(Float, nullable=False)
    currency = Column(String(10), default='INR')
    objective = Column(Text, nullable=True)
    risk_preference = Column(String(50), default='Moderate')
    time_horizon = Column(String(50), default='3 years')
    experience_level = Column(String(50), default='Beginner')
    business_start_mode = Column(String(50), default='Physical Store')
    custom_idea_text = Column(Text, nullable=True)
    locality = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), default='India')
    target_audience_notes = Column(Text, nullable=True)
    primary_usp = Column(Text, nullable=True)
    target_customer = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)
    normalized_profile = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='profiles')
    plans = relationship('BusinessPlan', back_populates='profile', cascade='all, delete-orphan')

class BusinessPlan(Base):
    __tablename__ = 'business_plans'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String(36), ForeignKey('business_profiles.id'), nullable=False)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default='completed')  # running, completed, revising, failed
    
    feasibility_score = Column(Float, default=0.0)
    score_breakdown = Column(JSON, nullable=True)
    
    executive_summary = Column(JSON, nullable=True)
    opportunity = Column(JSON, nullable=True)
    market_analysis = Column(JSON, nullable=True)
    customer_analysis = Column(JSON, nullable=True)
    competitor_analysis = Column(JSON, nullable=True)
    business_model = Column(JSON, nullable=True)
    capital_allocation = Column(JSON, nullable=True)
    cost_analysis = Column(JSON, nullable=True)
    revenue_scenarios = Column(JSON, nullable=True)
    break_even_analysis = Column(JSON, nullable=True)
    location_analysis = Column(JSON, nullable=True)
    compliance_checklist = Column(JSON, nullable=True)
    marketing_strategy = Column(JSON, nullable=True)
    early_revenue_plan = Column(JSON, nullable=True)
    growth_plan = Column(JSON, nullable=True)
    risk_register = Column(JSON, nullable=True)
    launch_roadmap = Column(JSON, nullable=True)
    critic_feedback = Column(JSON, nullable=True)
    
    revision_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    profile = relationship('BusinessProfile', back_populates='plans')
    user = relationship('User', back_populates='plans')
    sections = relationship('PlanSection', back_populates='plan', cascade='all, delete-orphan')
    agent_runs = relationship('AgentRun', back_populates='plan', cascade='all, delete-orphan')
    scenarios = relationship('Scenario', back_populates='plan', cascade='all, delete-orphan')

class PlanSection(Base):
    __tablename__ = 'plan_sections'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), ForeignKey('business_plans.id'), nullable=False)
    section_key = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    content_json = Column(JSON, nullable=True)
    confidence = Column(String(20), default='high')
    explainability_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    plan = relationship('BusinessPlan', back_populates='sections')

class Scenario(Base):
    __tablename__ = 'scenarios'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), ForeignKey('business_plans.id'), nullable=False)
    name = Column(String(255), nullable=False)
    capital_delta = Column(Float, default=0.0)
    revenue_impact = Column(Float, default=0.0)
    runway_months = Column(Float, default=0.0)
    feasibility_delta = Column(Float, default=0.0)
    params_json = Column(JSON, nullable=True)
    results_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    plan = relationship('BusinessPlan', back_populates='scenarios')
