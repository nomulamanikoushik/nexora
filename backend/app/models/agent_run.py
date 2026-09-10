import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class AgentRun(Base):
    __tablename__ = 'agent_runs'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), ForeignKey('business_plans.id'), nullable=False)
    agent_name = Column(String(100), nullable=False)
    status = Column(String(50), default='completed')  # waiting, running, completed, revising, failed
    step_order = Column(Integer, default=1)
    summary = Column(Text, nullable=True)
    input_payload = Column(JSON, nullable=True)
    output_payload = Column(JSON, nullable=True)
    revision_count = Column(Integer, default=0)
    critic_issues = Column(JSON, nullable=True)
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    plan = relationship('BusinessPlan', back_populates='agent_runs')
