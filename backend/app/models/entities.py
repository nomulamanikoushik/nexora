import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class BusinessIdea(Base):
    __tablename__ = 'business_ideas'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    raw_text = Column(Text, nullable=False)
    business_name = Column(String(255), nullable=True)
    category = Column(String(128), nullable=True)
    sector_slug = Column(String(64), nullable=True)
    business_model = Column(String(128), nullable=True)
    start_mode = Column(String(64), default='Home-Based')
    target_customers = Column(Text, nullable=True)
    required_resources = Column(JSON, nullable=True)
    possible_competitors = Column(JSON, nullable=True)
    location_relevance = Column(Text, nullable=True)
    estimated_startup_requirements = Column(JSON, nullable=True)
    confidence_score = Column(Float, default=0.85)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Location(Base):
    __tablename__ = 'locations'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country = Column(String(64), default='India')
    state = Column(String(64), default='Telangana')
    city = Column(String(64), nullable=False, index=True)
    locality = Column(String(128), nullable=True)
    avg_rent_sqft_inr = Column(Float, default=75.0)
    footfall_index = Column(Float, default=80.0)
    demographics = Column(Text, nullable=True)
    delivery_access = Column(String(64), default='High')
    demand_score = Column(Float, default=85.0)
    competition_density = Column(String(64), default='Moderate')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class MarketSnapshot(Base):
    __tablename__ = 'market_snapshots'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    tam = Column(String(64), nullable=True)
    sam = Column(String(64), nullable=True)
    som = Column(String(64), nullable=True)
    cagr = Column(Float, default=0.12)
    drivers = Column(JSON, nullable=True)
    headwinds = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Competitor(Base):
    __tablename__ = 'competitors'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    tier = Column(String(64), default='Organized Chain')
    pricing_level = Column(String(64), default='Mid-Range')
    strengths = Column(JSON, nullable=True)
    moats = Column(JSON, nullable=True)

class Customer(Base):
    __tablename__ = 'customers'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    persona_name = Column(String(128), nullable=False)
    age_range = Column(String(32), default='22-38')
    occupation = Column(String(128), nullable=True)
    aov = Column(Float, default=450.0)
    buying_frequency = Column(String(64), default='Weekly')
    pain_points = Column(JSON, nullable=True)

class CostTemplate(Base):
    __tablename__ = 'cost_templates'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    start_mode = Column(String(64), default='Home-Based')
    capex_items = Column(JSON, nullable=True)
    monthly_fixed_opex = Column(Float, default=25000.0)
    variable_cost_pct = Column(Float, default=0.35)

class RevenueModel(Base):
    __tablename__ = 'revenue_models'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    start_mode = Column(String(64), default='Home-Based')
    revenue_streams = Column(JSON, nullable=True)
    default_gross_margin = Column(Float, default=0.60)
    sales_cycle_days = Column(Integer, default=3)

class RiskItem(Base):
    __tablename__ = 'risk_items'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    category = Column(String(64), default='Financial')
    risk_title = Column(String(255), nullable=False)
    severity = Column(String(32), default='Medium')
    probability = Column(String(32), default='Moderate')
    impact = Column(String(32), default='Moderate')
    trigger_indicators = Column(Text, nullable=True)
    mitigation_strategy = Column(Text, nullable=True)

class ComplianceItem(Base):
    __tablename__ = 'compliance_items'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    authority = Column(String(128), nullable=False)
    timeline = Column(String(64), default='15-30 days')
    mandatory = Column(Boolean, default=True)
    applicable_start_modes = Column(JSON, nullable=True)

class MarketingStrategy(Base):
    __tablename__ = 'marketing_strategies'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sector_slug = Column(String(64), nullable=False, index=True)
    start_mode = Column(String(64), default='Home-Based')
    channel_name = Column(String(128), nullable=False)
    cac_target_inr = Column(Float, default=150.0)
    conversion_rate = Column(Float, default=0.04)
    funnel_phase = Column(String(64), default='First 10 Customers')

class GrowthMetric(Base):
    __tablename__ = 'growth_metrics'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), ForeignKey('business_plans.id'), nullable=False)
    metric_name = Column(String(128), nullable=False)
    metric_key = Column(String(64), nullable=False)
    target_value = Column(Float, default=0.0)
    unit = Column(String(32), default='units')
    description = Column(Text, nullable=True)
    explainability = Column(JSON, nullable=True)
