import json
import os
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.sector import Sector
from app.models.plan import BusinessProfile, BusinessPlan, PlanSection, Scenario
from app.models.agent_run import AgentRun
from app.models.entities import Location
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Safe column migration for SQLite
    new_profile_cols = [
        "ALTER TABLE business_profiles ADD COLUMN business_start_mode VARCHAR(50) DEFAULT 'Physical Store';",
        "ALTER TABLE business_profiles ADD COLUMN custom_idea_text TEXT;",
        "ALTER TABLE business_profiles ADD COLUMN locality VARCHAR(100);",
        "ALTER TABLE business_profiles ADD COLUMN city VARCHAR(100);",
        "ALTER TABLE business_profiles ADD COLUMN state VARCHAR(100);",
        "ALTER TABLE business_profiles ADD COLUMN country VARCHAR(100) DEFAULT 'India';",
        "ALTER TABLE business_profiles ADD COLUMN target_audience_notes TEXT;",
        "ALTER TABLE business_profiles ADD COLUMN primary_usp TEXT;",
        "ALTER TABLE business_plans ADD COLUMN early_revenue_plan JSON;",
        "ALTER TABLE business_plans ADD COLUMN growth_plan JSON;"
    ]
    with engine.connect() as conn:
        for stmt in new_profile_cols:
            try:
                conn.execute(text(stmt))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        # 1. Check demo user
        demo_user = db.query(User).filter(User.email == 'demo@nexora.ai').first()
        if not demo_user:
            demo_user = User(
                email='demo@nexora.ai',
                full_name='Demo Founder',
                hashed_password=get_password_hash('NexoraLaunch2026!'),
                is_active=True,
                is_guest=False
            )
            db.add(demo_user)

        # 2. Check and seed locations
        if db.query(Location).count() == 0:
            default_locations = [
                Location(country='India', state='Telangana', city='Hyderabad', locality='Madhapur / Hitec City', avg_rent_sqft_inr=75.0, footfall_index=92.0, demographics='IT professionals, corporate workforce, high disposable income, active food delivery & artisanal goods buyers', delivery_access='High', demand_score=94.0, competition_density='Moderate'),
                Location(country='India', state='Telangana', city='Hyderabad', locality='Gachibowli', avg_rent_sqft_inr=70.0, footfall_index=88.0, demographics='Tech workforce, young families, residential gated communities', delivery_access='High', demand_score=91.0, competition_density='Moderate'),
                Location(country='India', state='Telangana', city='Hyderabad', locality='Jubilee Hills / Banjara Hills', avg_rent_sqft_inr=115.0, footfall_index=85.0, demographics='Affluent families, premium lifestyle buyers, organic and gourmet snack enthusiasts', delivery_access='High', demand_score=96.0, competition_density='High'),
                Location(country='India', state='Telangana', city='Hyderabad', locality='Kukatpally / KPHB', avg_rent_sqft_inr=55.0, footfall_index=90.0, demographics='Dense middle-class families, students, budget conscious yet high volume', delivery_access='High', demand_score=87.0, competition_density='High'),
                Location(country='India', state='Karnataka', city='Bengaluru', locality='Koramangala', avg_rent_sqft_inr=95.0, footfall_index=94.0, demographics='Startup founders, tech workers, early adopters of healthy foods & artisanal snacks', delivery_access='Very High', demand_score=95.0, competition_density='Very High'),
                Location(country='India', state='Karnataka', city='Bengaluru', locality='Indiranagar', avg_rent_sqft_inr=105.0, footfall_index=92.0, demographics='Premium demographic, cafe culture, high spending power on wellness goods', delivery_access='High', demand_score=93.0, competition_density='High'),
                Location(country='India', state='Karnataka', city='Bengaluru', locality='HSR Layout', avg_rent_sqft_inr=80.0, footfall_index=89.0, demographics='Tech startup clusters, young professionals, fitness focused', delivery_access='High', demand_score=92.0, competition_density='Moderate'),
                Location(country='India', state='Maharashtra', city='Mumbai', locality='Bandra West', avg_rent_sqft_inr=145.0, footfall_index=95.0, demographics='High net worth, media/entertainment, trendsetters for healthy snack brands', delivery_access='High', demand_score=98.0, competition_density='Very High'),
                Location(country='India', state='Maharashtra', city='Mumbai', locality='Andheri West', avg_rent_sqft_inr=110.0, footfall_index=93.0, demographics='High density, media professionals, high online food ordering rate', delivery_access='High', demand_score=90.0, competition_density='High'),
                Location(country='India', state='Tamil Nadu', city='Chennai', locality='T. Nagar', avg_rent_sqft_inr=85.0, footfall_index=96.0, demographics='Massive commercial retail hub, traditional and modern snack consumption', delivery_access='High', demand_score=89.0, competition_density='High'),
                Location(country='India', state='Tamil Nadu', city='Chennai', locality='Adyar / OMR', avg_rent_sqft_inr=65.0, footfall_index=84.0, demographics='IT corridor, college campuses, health conscious software workers', delivery_access='High', demand_score=88.0, competition_density='Moderate'),
                Location(country='India', state='Delhi NCR', city='New Delhi', locality='Connaught Place / South Ex', avg_rent_sqft_inr=160.0, footfall_index=96.0, demographics='Corporate headquarters, government offices, premium shoppers', delivery_access='High', demand_score=94.0, competition_density='High'),
                Location(country='India', state='Delhi NCR', city='Gurugram', locality='Cyber City / Golf Course Rd', avg_rent_sqft_inr=120.0, footfall_index=91.0, demographics='MNC executives, high disposable income, premium packaging affinity', delivery_access='High', demand_score=95.0, competition_density='Moderate')
            ]
            for loc in default_locations:
                db.add(loc)

        # 3. Check and seed sectors
        if db.query(Sector).count() == 0:
            seed_candidates = [
                os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'seed_data.json'),
                r'C:\Users\nomul\.gemini\antigravity\scratch\nexora\data\seed_data.json',
                os.path.join(os.getcwd(), 'data', 'seed_data.json')
            ]
            seed_file = None
            for cand in seed_candidates:
                if os.path.exists(cand):
                    seed_file = cand
                    break

            if seed_file:
                with open(seed_file, 'r', encoding='utf-8') as f:
                    seed = json.load(f)
                    for item in seed.get('sectors', []):
                        sec = Sector(
                            slug=item['slug'],
                            name=item['name'],
                            description=item['description'],
                            avg_startup_capex_inr=float(item.get('avg_startup_capex_inr', 1000000)),
                            default_gross_margin=float(item.get('default_gross_margin', 0.5)),
                            default_net_margin=float(item.get('default_net_margin', 0.2)),
                            cagr=float(item.get('cagr', 0.12)),
                            market_size_inr=item.get('market_size_inr', ''),
                            capital_weights=item.get('capital_weights'),
                            compliance_items=item.get('compliance'),
                            locations_data=item.get('locations')
                        )
                        db.add(sec)
        db.commit()
        print('Database initialized and seeded successfully.')
    except Exception as e:
        db.rollback()
        print(f'Error initializing db: {e}')
    finally:
        db.close()

if __name__ == '__main__':
    init_db()
