from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.sector import Sector

router = APIRouter()

@router.get("/")
def get_sectors(db: Session = Depends(get_db)):
    sectors = db.query(Sector).all()
    return [
        {
            "id": s.id,
            "slug": s.slug,
            "name": s.name,
            "description": s.description,
            "avg_startup_capex_inr": s.avg_startup_capex_inr,
            "default_gross_margin": s.default_gross_margin,
            "default_net_margin": s.default_net_margin,
            "cagr": s.cagr,
            "market_size_inr": s.market_size_inr,
            "capital_weights": s.capital_weights,
            "compliance_items": s.compliance_items,
            "locations_data": s.locations_data
        }
        for s in sectors
    ]

@router.get("/{slug}")
def get_sector_by_slug(slug: str, db: Session = Depends(get_db)):
    sector = db.query(Sector).filter(Sector.slug == slug).first()
    if not sector:
        raise HTTPException(status_code=404, detail=f"Sector '{slug}' not found.")
    return {
        "id": sector.id,
        "slug": sector.slug,
        "name": sector.name,
        "description": sector.description,
        "avg_startup_capex_inr": sector.avg_startup_capex_inr,
        "default_gross_margin": sector.default_gross_margin,
        "default_net_margin": sector.default_net_margin,
        "cagr": sector.cagr,
        "market_size_inr": sector.market_size_inr,
        "capital_weights": sector.capital_weights,
        "compliance_items": sector.compliance_items,
        "locations_data": sector.locations_data
    }
