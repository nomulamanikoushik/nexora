import uuid
from sqlalchemy import Column, String, Float, JSON
from app.db.base import Base

class Sector(Base):
    __tablename__ = 'sectors'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    description = Column(String(1000), nullable=True)
    avg_startup_capex_inr = Column(Float, nullable=False, default=1000000.0)
    default_gross_margin = Column(Float, nullable=False, default=0.5)
    default_net_margin = Column(Float, nullable=False, default=0.2)
    cagr = Column(Float, nullable=False, default=0.12)
    market_size_inr = Column(String(64), nullable=True)
    capital_weights = Column(JSON, nullable=True)
    compliance_items = Column(JSON, nullable=True)
    locations_data = Column(JSON, nullable=True)
