from typing import List, Dict, Any

LOCATION_BENCHMARKS = [
    {
        "city": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "tier": "Tier 1",
        "localities": [
            {
                "locality": "Kondapur",
                "avg_commercial_rent_sqft": 85,
                "avg_residential_rent_2bhk": 28000,
                "home_business_suitability": "Very High",
                "foot_traffic_score": 88,
                "target_demographic": "IT Tech professionals, young dual-income couples, health enthusiasts",
                "density_per_sqkm": 9400,
                "sector_demand": {"food-beverage": 92, "retail": 80, "software-saas": 85, "healthcare": 88},
                "competition_level": "Moderate",
                "regulatory_ease": 90,
                "permits_required": ["GHMC Trade License", "FSSAI Basic", "Shop & Establishment Act"]
            },
            {
                "locality": "Miyapur",
                "avg_commercial_rent_sqft": 55,
                "avg_residential_rent_2bhk": 18000,
                "home_business_suitability": "Exceptional",
                "foot_traffic_score": 78,
                "target_demographic": "Dense residential communities, budget-conscious families, metro commuters",
                "density_per_sqkm": 11200,
                "sector_demand": {"food-beverage": 89, "retail": 84, "software-saas": 70, "healthcare": 82},
                "competition_level": "Low-to-Moderate",
                "regulatory_ease": 92,
                "permits_required": ["GHMC Trade License", "FSSAI Basic"]
            },
            {
                "locality": "Hitech City / Madhapur",
                "avg_commercial_rent_sqft": 135,
                "avg_residential_rent_2bhk": 38000,
                "home_business_suitability": "Moderate",
                "foot_traffic_score": 96,
                "target_demographic": "Corporate executives, premium tech workforce, high disposable income",
                "density_per_sqkm": 12500,
                "sector_demand": {"food-beverage": 95, "retail": 90, "software-saas": 98, "healthcare": 86},
                "competition_level": "High",
                "regulatory_ease": 85,
                "permits_required": ["GHMC Trade License", "FSSAI State", "Fire Safety NOC", "Signage Permit"]
            },
            {
                "locality": "Jubilee Hills / Banjara Hills",
                "avg_commercial_rent_sqft": 175,
                "avg_residential_rent_2bhk": 55000,
                "home_business_suitability": "Moderate",
                "foot_traffic_score": 90,
                "target_demographic": "Ultra-HNIs, affluent families, luxury & organic lifestyle consumers",
                "density_per_sqkm": 7200,
                "sector_demand": {"food-beverage": 94, "retail": 96, "software-saas": 82, "healthcare": 94},
                "competition_level": "High",
                "regulatory_ease": 80,
                "permits_required": ["GHMC Premium Trade License", "FSSAI State", "Pollution Control NOC"]
            }
        ]
    },
    {
        "city": "Bengaluru",
        "state": "Karnataka",
        "country": "India",
        "tier": "Tier 1",
        "localities": [
            {
                "locality": "Koramangala",
                "avg_commercial_rent_sqft": 150,
                "avg_residential_rent_2bhk": 42000,
                "home_business_suitability": "High",
                "foot_traffic_score": 95,
                "target_demographic": "Startup founders, VC ecosystem, early tech adopters, Gen Z foodies",
                "density_per_sqkm": 13000,
                "sector_demand": {"food-beverage": 96, "retail": 88, "software-saas": 99, "healthcare": 85},
                "competition_level": "High",
                "regulatory_ease": 82,
                "permits_required": ["BBMP Trade License", "FSSAI Registration/License", "Bescom Commercial"]
            },
            {
                "locality": "HSR Layout",
                "avg_commercial_rent_sqft": 110,
                "avg_residential_rent_2bhk": 34000,
                "home_business_suitability": "Very High",
                "foot_traffic_score": 89,
                "target_demographic": "Young tech couples, health & organic lifestyle adopters, remote workers",
                "density_per_sqkm": 10500,
                "sector_demand": {"food-beverage": 91, "retail": 86, "software-saas": 95, "healthcare": 88},
                "competition_level": "Moderate",
                "regulatory_ease": 88,
                "permits_required": ["BBMP Trade License", "FSSAI Basic"]
            },
            {
                "locality": "Indiranagar",
                "avg_commercial_rent_sqft": 165,
                "avg_residential_rent_2bhk": 46000,
                "home_business_suitability": "Moderate",
                "foot_traffic_score": 94,
                "target_demographic": "Affluent urbanites, creative professionals, weekend culinary explorers",
                "density_per_sqkm": 9800,
                "sector_demand": {"food-beverage": 97, "retail": 94, "software-saas": 90, "healthcare": 87},
                "competition_level": "High",
                "regulatory_ease": 80,
                "permits_required": ["BBMP Trade License", "FSSAI State", "Fire NOC"]
            }
        ]
    },
    {
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "tier": "Tier 1",
        "localities": [
            {
                "locality": "Bandra West",
                "avg_commercial_rent_sqft": 260,
                "avg_residential_rent_2bhk": 85000,
                "home_business_suitability": "High",
                "foot_traffic_score": 98,
                "target_demographic": "Celebrities, media executives, high disposable income trendsetters",
                "density_per_sqkm": 19000,
                "sector_demand": {"food-beverage": 98, "retail": 97, "software-saas": 84, "healthcare": 92},
                "competition_level": "Very High",
                "regulatory_ease": 76,
                "permits_required": ["BMC Gumasta License", "FSSAI State License", "Police NOC"]
            },
            {
                "locality": "Andheri West",
                "avg_commercial_rent_sqft": 140,
                "avg_residential_rent_2bhk": 50000,
                "home_business_suitability": "Very High",
                "foot_traffic_score": 92,
                "target_demographic": "Entertainment professionals, affluent middle class, high residential footfall",
                "density_per_sqkm": 17500,
                "sector_demand": {"food-beverage": 93, "retail": 90, "software-saas": 82, "healthcare": 88},
                "competition_level": "High",
                "regulatory_ease": 80,
                "permits_required": ["BMC Gumasta License", "FSSAI Registration"]
            }
        ]
    },
    {
        "city": "Pune",
        "state": "Maharashtra",
        "country": "India",
        "tier": "Tier 1",
        "localities": [
            {
                "locality": "Kothrud",
                "avg_commercial_rent_sqft": 80,
                "avg_residential_rent_2bhk": 24000,
                "home_business_suitability": "Exceptional",
                "foot_traffic_score": 85,
                "target_demographic": "Traditional families, students, upper-middle class professionals",
                "density_per_sqkm": 11000,
                "sector_demand": {"food-beverage": 90, "retail": 85, "software-saas": 78, "healthcare": 90},
                "competition_level": "Moderate",
                "regulatory_ease": 88,
                "permits_required": ["PMC Trade License", "FSSAI Basic"]
            },
            {
                "locality": "Viman Nagar / Koregaon Park",
                "avg_commercial_rent_sqft": 125,
                "avg_residential_rent_2bhk": 36000,
                "home_business_suitability": "High",
                "foot_traffic_score": 93,
                "target_demographic": "Young IT workforce, expats, university students, high weekend spending",
                "density_per_sqkm": 10200,
                "sector_demand": {"food-beverage": 95, "retail": 91, "software-saas": 88, "healthcare": 86},
                "competition_level": "Moderate-to-High",
                "regulatory_ease": 85,
                "permits_required": ["PMC Trade License", "FSSAI State"]
            }
        ]
    },
    {
        "city": "Delhi-NCR",
        "state": "Delhi / Haryana",
        "country": "India",
        "tier": "Tier 1",
        "localities": [
            {
                "locality": "Gurugram Cyber Hub / DLF",
                "avg_commercial_rent_sqft": 155,
                "avg_residential_rent_2bhk": 45000,
                "home_business_suitability": "High",
                "foot_traffic_score": 94,
                "target_demographic": "MNC corporate employees, premium lifestyle consumers",
                "density_per_sqkm": 11500,
                "sector_demand": {"food-beverage": 96, "retail": 92, "software-saas": 95, "healthcare": 88},
                "competition_level": "High",
                "regulatory_ease": 82,
                "permits_required": ["MCG Trade License", "FSSAI License", "Fire NOC"]
            }
        ]
    }
]

def get_all_locations_flat() -> List[Dict[str, Any]]:
    """Returns flat list of all locations and localities."""
    results = []
    for city_obj in LOCATION_BENCHMARKS:
        for loc in city_obj["localities"]:
            results.append({
                "city": city_obj["city"],
                "state": city_obj["state"],
                "country": city_obj["country"],
                "tier": city_obj["tier"],
                **loc
            })
    return results

def compare_locations(
    location_names: List[str],
    sector: str = "food-beverage",
    start_mode: str = "Home-Based",
    capital: float = 300000.0
) -> Dict[str, Any]:
    """Compares multiple locations side-by-side with scoring and suitability analysis."""
    flat_data = get_all_locations_flat()
    
    selected = []
    for q in location_names:
        clean_q = q.lower().strip()
        matched = None
        for item in flat_data:
            loc_str = f"{item['locality']} {item['city']}".lower()
            if clean_q in loc_str or item["locality"].lower() in clean_q or item["city"].lower() in clean_q:
                matched = item
                break
        if matched and matched not in selected:
            selected.append(matched)
            
    # Fallback to defaults if not found
    if len(selected) < 2:
        default_kondapur = next((x for x in flat_data if x["locality"] == "Kondapur"), flat_data[0])
        default_miyapur = next((x for x in flat_data if x["locality"] == "Miyapur"), flat_data[1])
        default_koramangala = next((x for x in flat_data if x["locality"] == "Koramangala"), flat_data[2])
        selected = [default_kondapur, default_miyapur, default_koramangala]

    comparisons = []
    best_loc = None
    highest_score = -1.0

    for loc in selected:
        sector_score = loc["sector_demand"].get(sector, 80)
        
        # Calculate suitability score based on start_mode
        if start_mode == "Home-Based":
            # Rent matters less, home suitability and local density matter more
            home_mult = {"Exceptional": 95, "Very High": 90, "High": 85, "Moderate": 70}.get(loc["home_business_suitability"], 80)
            score = (home_mult * 0.4) + (sector_score * 0.3) + (loc["regulatory_ease"] * 0.2) + (min(100, loc["density_per_sqkm"] / 120) * 0.1)
        elif start_mode == "Physical Store":
            # Commercial rent and foot traffic heavily impact
            rent_burden = max(0, 100 - (loc["avg_commercial_rent_sqft"] * 0.5))
            score = (loc["foot_traffic_score"] * 0.35) + (sector_score * 0.3) + (rent_burden * 0.2) + (loc["regulatory_ease"] * 0.15)
        else: # Online / Mobile / Hybrid
            score = (sector_score * 0.4) + (loc["regulatory_ease"] * 0.3) + (loc["foot_traffic_score"] * 0.3)
            
        score = round(score, 1)
        
        # Monthly cost impact
        if start_mode == "Home-Based":
            est_rent = 0 # home utilized
        elif start_mode == "Physical Store":
            est_rent = loc["avg_commercial_rent_sqft"] * 350 # 350 sqft small shop
        else:
            est_rent = loc["avg_commercial_rent_sqft"] * 150

        summary = {
            "locality": loc["locality"],
            "city": loc["city"],
            "state": loc["state"],
            "suitability_score": score,
            "sector_demand_score": sector_score,
            "foot_traffic_score": loc["foot_traffic_score"],
            "avg_commercial_rent_sqft": loc["avg_commercial_rent_sqft"],
            "avg_residential_rent_2bhk": loc["avg_residential_rent_2bhk"],
            "home_suitability": loc["home_business_suitability"],
            "estimated_monthly_space_cost": est_rent,
            "regulatory_ease": loc["regulatory_ease"],
            "competition_level": loc["competition_level"],
            "target_demographic": loc["target_demographic"],
            "permits": loc["permits_required"]
        }
        comparisons.append(summary)

        if score > highest_score:
            highest_score = score
            best_loc = summary

    # Sort descending by suitability score
    comparisons.sort(key=lambda x: x["suitability_score"], reverse=True)

    return {
        "sector": sector,
        "start_mode": start_mode,
        "capital": capital,
        "recommended_location": best_loc["locality"] + ", " + best_loc["city"],
        "recommendation_reason": f"{best_loc['locality']} offers the highest composite score ({best_loc['suitability_score']}/100) for a {start_mode} model, combining high target demographic density with favorable overheads.",
        "locations_compared": comparisons
    }
