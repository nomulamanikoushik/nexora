from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import Location

METRO_LOCATIONS = {
    "hyderabad": {
        "city": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "tier": "Tier 1 Metro",
        "avg_rent_sqft_inr": 75.0,
        "home_based_friendly_score": 92.0,
        "logistics_infrastructure_score": 90.0,
        "food_snack_market_demand": 93.0,
        "competition_intensity": "Moderate",
        "cost_of_living_index": "Moderate (Lower than BLR/MUM)",
        "demographic_summary": "Growing IT/corporate workforce, high density of double-income households, rapidly expanding demand for healthy & artisanal homemade foods.",
        "key_hubs": ["Madhapur", "Gachibowli", "Jubilee Hills", "Kondapur", "Kukatpally", "Banjara Hills"],
        "local_advantages": [
            "Lower commercial and residential overhead compared to Mumbai and Bengaluru (25-35% savings)",
            "Exceptional quick-commerce delivery density (Blinkit, Zepto, Swiggy Instamart) and local courier hubs (Dunzo, Porter)",
            "Supportive MSME state startup environment and streamlined TS-iPASS single window permissions"
        ]
    },
    "bengaluru": {
        "city": "Bengaluru",
        "state": "Karnataka",
        "country": "India",
        "tier": "Tier 1 Metro",
        "avg_rent_sqft_inr": 95.0,
        "home_based_friendly_score": 94.0,
        "logistics_infrastructure_score": 94.0,
        "food_snack_market_demand": 96.0,
        "competition_intensity": "Very High",
        "cost_of_living_index": "High",
        "demographic_summary": "Highest density of early-adopter tech workforce and fitness/wellness enthusiasts willing to pay premium prices for healthy snacks.",
        "key_hubs": ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Jayanagar"],
        "local_advantages": [
            "Highest willingness-to-pay and Average Order Value (AOV 20-25% higher)",
            "Extremely active weekend farmers markets, organic pop-up bazaars, and corporate flea markets",
            "Strong density of packaging suppliers and organic ingredient wholesale aggregators"
        ]
    },
    "chennai": {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "country": "India",
        "tier": "Tier 1 Metro",
        "avg_rent_sqft_inr": 80.0,
        "home_based_friendly_score": 88.0,
        "logistics_infrastructure_score": 86.0,
        "food_snack_market_demand": 88.0,
        "competition_intensity": "Moderate to High",
        "cost_of_living_index": "Moderate",
        "demographic_summary": "Traditional taste preferences shifting toward clean-label, preservative-free traditional snacks like millet crunch and roasted savory bites.",
        "key_hubs": ["T. Nagar", "Adyar", "Velachery", "Anna Nagar", "OMR"],
        "local_advantages": [
            "High customer loyalty and repeat order rates once trust is established",
            "Lower customer acquisition cost through local residential associations and apartment WhatsApp groups",
            "Robust road and coastal logistics connectivity"
        ]
    },
    "mumbai": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "tier": "Tier 1 Metro",
        "avg_rent_sqft_inr": 140.0,
        "home_based_friendly_score": 90.0,
        "logistics_infrastructure_score": 95.0,
        "food_snack_market_demand": 97.0,
        "competition_intensity": "Extremely High",
        "cost_of_living_index": "Very High",
        "demographic_summary": "Massive urban sprawl, time-starved corporate commuters, massive snacking culture, but high commercial rent barrier.",
        "key_hubs": ["Bandra West", "Andheri West", "Lower Parel", "Powai", "Thane"],
        "local_advantages": [
            "Massive market volume and round-the-clock consumption appetite",
            "High-end gifting and corporate holiday gifting market is largest in India",
            "Extensive suburban rail and hyper-dense hyperlocal delivery delivery corridors"
        ]
    },
    "delhi-ncr": {
        "city": "Delhi NCR",
        "state": "Delhi NCR",
        "country": "India",
        "tier": "Tier 1 Metro",
        "avg_rent_sqft_inr": 125.0,
        "home_based_friendly_score": 89.0,
        "logistics_infrastructure_score": 93.0,
        "food_snack_market_demand": 95.0,
        "competition_intensity": "Very High",
        "cost_of_living_index": "High",
        "demographic_summary": "Huge gifting market, high festive demand, strong affinity for rich packaged snacks and premium dry-fruit roasted blends.",
        "key_hubs": ["Cyber City Gurugram", "South Extension", "Noida Sector 18", "Connaught Place"],
        "local_advantages": [
            "Enormous wedding and corporate festive gifting spend",
            "Central logistics hub for all North India distribution",
            "High density of packaging manufacturers and printing presses in Okhla/Naraina"
        ]
    }
}

class LocationService:
    @staticmethod
    def get_all_locations(db: Optional[Session] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        results = []
        if db:
            query = db.query(Location)
            if search:
                query = query.filter(Location.city.ilike(f"%{search}%") | Location.locality.ilike(f"%{search}%"))
            db_locs = query.all()
            for loc in db_locs:
                results.append({
                    "id": loc.id,
                    "country": loc.country,
                    "state": loc.state,
                    "city": loc.city,
                    "locality": loc.locality,
                    "avg_rent_sqft_inr": loc.avg_rent_sqft_inr,
                    "footfall_index": loc.footfall_index,
                    "demographics": loc.demographics,
                    "delivery_access": loc.delivery_access,
                    "demand_score": loc.demand_score,
                    "competition_density": loc.competition_density
                })
        
        if not results:
            for k, v in METRO_LOCATIONS.items():
                if not search or search.lower() in v["city"].lower():
                    results.append({
                        "id": k,
                        "country": v["country"],
                        "state": v["state"],
                        "city": v["city"],
                        "locality": ", ".join(v["key_hubs"][:3]),
                        "avg_rent_sqft_inr": v["avg_rent_sqft_inr"],
                        "footfall_index": 88.0,
                        "demographics": v["demographic_summary"],
                        "delivery_access": "High",
                        "demand_score": v["food_snack_market_demand"],
                        "competition_density": v["competition_intensity"]
                    })
        return results

    @staticmethod
    def compare_locations(locations: List[str], sector: str = "food-beverage", business_type: str = "Small-Scale Business", capital: float = 300000.0) -> Dict[str, Any]:
        compared = []
        matrix = {
            "market_potential": {},
            "competition_intensity": {},
            "commercial_rent_sqft": {},
            "logistics_accessibility": {},
            "target_demographic_fit": {},
            "composite_score": {}
        }

        best_loc = None
        highest_score = -1.0

        for raw_name in locations:
            slug = raw_name.lower().replace(" ", "-")
            matched_data = None
            for k, v in METRO_LOCATIONS.items():
                if k in slug or slug in k or v["city"].lower() in slug or slug in v["city"].lower():
                    matched_data = v
                    break
            
            if not matched_data:
                matched_data = {
                    "city": raw_name.title(),
                    "state": "Regional Hub",
                    "country": "India",
                    "tier": "Tier 2 Emerging Hub",
                    "avg_rent_sqft_inr": 55.0,
                    "home_based_friendly_score": 85.0,
                    "logistics_infrastructure_score": 82.0,
                    "food_snack_market_demand": 84.0,
                    "competition_intensity": "Moderate",
                    "cost_of_living_index": "Moderate",
                    "demographic_summary": f"Growing consumer base in {raw_name} with strong community networks and lower operational costs.",
                    "key_hubs": ["Central Market", "Main Commercial Corridor"],
                    "local_advantages": ["Significantly lower rental & staff burn", "Stronger local community cohesion"]
                }

            rent_score = max(50.0, 100.0 - (matched_data["avg_rent_sqft_inr"] / 1.5))
            demand_score = matched_data["food_snack_market_demand"]
            logistics_score = matched_data["logistics_infrastructure_score"]
            home_friendliness = matched_data["home_based_friendly_score"]
            comp_penalty = 12.0 if matched_data["competition_intensity"] == "Very High" else (8.0 if matched_data["competition_intensity"] == "High" else 4.0)

            composite = round((demand_score * 0.35) + (rent_score * 0.25) + (logistics_score * 0.20) + (home_friendliness * 0.20) - comp_penalty, 1)

            if composite > highest_score:
                highest_score = composite
                best_loc = matched_data["city"]

            loc_entry = {
                "city": matched_data["city"],
                "state": matched_data["state"],
                "country": matched_data["country"],
                "tier": matched_data["tier"],
                "avg_rent_sqft_inr": matched_data["avg_rent_sqft_inr"],
                "competition_intensity": matched_data["competition_intensity"],
                "market_demand_score": demand_score,
                "logistics_score": logistics_score,
                "home_based_friendly_score": home_friendliness,
                "composite_score": composite,
                "demographic_summary": matched_data["demographic_summary"],
                "key_hotspots": matched_data["key_hubs"],
                "local_advantages": matched_data["local_advantages"]
            }
            compared.append(loc_entry)

            city_key = matched_data["city"]
            matrix["market_potential"][city_key] = f"{demand_score}/100"
            matrix["competition_intensity"][city_key] = matched_data["competition_intensity"]
            matrix["commercial_rent_sqft"][city_key] = f"INR {matched_data['avg_rent_sqft_inr']}/sq.ft"
            matrix["logistics_accessibility"][city_key] = f"{logistics_score}/100"
            matrix["target_demographic_fit"][city_key] = f"{home_friendliness}/100"
            matrix["composite_score"][city_key] = f"{composite}/100"

        tradeoffs = [
            f"{best_loc} offers the most favorable balance of high demand density, manageable operating costs, and strong delivery logistics for a capital base of INR {capital:,.0f}.",
            "Bengaluru and Mumbai deliver higher purchasing power and AOV, but require larger marketing budgets to break through intense incumbent noise.",
            "Hyderabad provides an optimal launchpad with 25-30% lower overhead burn, allowing 4-5 months of runway preservation."
        ]

        return {
            "compared_locations": compared,
            "comparison_matrix": matrix,
            "recommended_location": best_loc or locations[0],
            "recommendation_reason": f"{best_loc} demonstrates the highest operational efficiency score ({highest_score}/100) combining robust delivery networks and lower setup capex.",
            "key_tradeoffs": tradeoffs
        }
