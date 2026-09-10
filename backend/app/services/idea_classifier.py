import re
from typing import Dict, Any, Optional

def parse_currency_and_capital(text: str) -> tuple[Optional[float], str]:
    """Extracts numeric capital and currency code from natural language text."""
    clean = text.lower().replace(',', '')
    
    # Currency symbol or keyword detection
    currency = "INR"
    if "$" in text or "usd" in clean or "dollars" in clean:
        currency = "USD"
    elif "€" in text or "eur" in clean or "euros" in clean:
        currency = "EUR"
    elif "£" in text or "gbp" in clean or "pounds" in clean:
        currency = "GBP"
    
    # Check for Lakh / Lac / L
    lakh_match = re.search(r'(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lacs|lac|l\b)', clean)
    if lakh_match:
        val = float(lakh_match.group(1))
        return val * 100_000, "INR"
    
    # Check for Crore / Cr
    cr_match = re.search(r'(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:crore|cr\b)', clean)
    if cr_match:
        val = float(cr_match.group(1))
        return val * 10_000_000, "INR"
    
    # Check for K (thousands)
    k_match = re.search(r'(?:[\$€£₹]|rs\.?|inr|usd)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:k\b|thousand)', clean)
    if k_match:
        val = float(k_match.group(1))
        return val * 1_000, currency
    
    # Direct numbers with currency prefix or standalone numbers
    num_match = re.search(r'(?:[\$€£₹]|rs\.?|inr|usd)\s*([0-9]+(?:\.[0-9]+)?)', clean)
    if num_match:
        return float(num_match.group(1)), currency
        
    return None, currency

def detect_start_mode(text: str) -> str:
    """Detects the most appropriate business start mode."""
    t = text.lower()
    if any(k in t for k in ["home", "homemade", "from home", "kitchen", "apartment", "living room", "cottage"]):
        return "Home-Based"
    if any(k in t for k in ["mobile", "van", "truck", "food truck", "cart", "kiosk", "roaming", "pop-up", "on-the-go"]):
        return "Mobile Business"
    if any(k in t for k in ["online", "ecommerce", "e-commerce", "d2c", "website", "app", "saas", "software", "digital", "remote", "dropship"]):
        return "Online"
    if any(k in t for k in ["hybrid", "takeaway and online", "cloud and dine", "omnichannel"]):
        return "Hybrid"
    if any(k in t for k in ["store", "shop", "boutique", "cafe", "restaurant", "clinic", "gym", "salon", "outlet", "showroom", "physical", "retail"]):
        return "Physical Store"
    return "Home-Based" if "snack" in t or "bake" in t or "cook" in t else "Physical Store"

def detect_sector_and_category(text: str) -> tuple[str, str, str]:
    """Returns (sector_slug, category_title, specific_type)"""
    t = text.lower()
    
    if any(k in t for k in ["snack", "food", "kitchen", "cafe", "coffee", "bakery", "restaurant", "tea", "juice", "sweet", "catering", "millet", "cookie", "cake", "meal"]):
        if any(k in t for k in ["snack", "millet", "cookie", "homemade", "healthy", "packaged"]):
            return "food-beverage", "Packaged Healthy Food & Artisanal Snacks", "Homemade Healthy Snacks & Nutrition Packs"
        if "cloud kitchen" in t:
            return "food-beverage", "Cloud Kitchen & Delivery Brand", "Specialty Regional Cloud Kitchen"
        if "cafe" in t or "coffee" in t:
            return "food-beverage", "Specialty Coffee & Beverages", "Neighborhood Artisanal Cafe"
        return "food-beverage", "Food & Culinary Ventures", "Artisanal Food Concept"
        
    if any(k in t for k in ["saas", "software", "app", "platform", "b2b tool", "ai tool", "automation", "tech", "web platform"]):
        return "software-saas", "B2B Software & AI Automation", "SaaS Productivity & Workflow Platform"
        
    if any(k in t for k in ["retail", "clothing", "apparel", "boutique", "jewelry", "fashion", "accessories", "shoes", "gifting"]):
        return "retail", "Curated Retail & Lifestyle", "Direct-to-Consumer Lifestyle Brand"
        
    if any(k in t for k in ["health", "clinic", "wellness", "yoga", "gym", "fitness", "nutrition", "physio", "spa", "ayurveda"]):
        return "healthcare", "Health, Wellness & Preventive Care", "Modern Wellness & Lifestyle Studio"
        
    if any(k in t for k in ["tutor", "coaching", "school", "course", "edtech", "training", "academy", "learning"]):
        return "edtech", "Education & Skill Accelerator", "Specialized Skill Mastery Academy"
        
    if any(k in t for k in ["agency", "marketing", "consulting", "design", "freelance", "service", "cleaning", "repair", "logistics"]):
        return "services", "Professional & Managed Services", "Bespoke Managed Services Agency"
        
    return "food-beverage", "Consumer Products & Lifestyle", "Bespoke Consumer Brand"

def detect_location(text: str) -> tuple[str, str, str]:
    """Returns (city, locality, state)"""
    t = text.lower()
    
    cities = {
        "hyderabad": ("Hyderabad", "Telangana", ["kondapur", "miyapur", "gachibowli", "madhapur", "hitech city", "jubilee hills", "banjara hills", "kukatpally", "begumpet"]),
        "bengaluru": ("Bengaluru", "Karnataka", ["koramangala", "indiranagar", "hsr layout", "whitefield", "jp nagar", "jayanagar", "electronic city"]),
        "bangalore": ("Bengaluru", "Karnataka", ["koramangala", "indiranagar", "hsr layout", "whitefield", "jp nagar", "jayanagar"]),
        "mumbai": ("Mumbai", "Maharashtra", ["bandra", "andheri", "juhu", "powai", "colaba", "worli", "dadar", "thane"]),
        "pune": ("Pune", "Maharashtra", ["kothrud", "viman nagar", "koregaon park", "baner", "wakad", "hinjewadi", "aundh"]),
        "delhi": ("Delhi-NCR", "Delhi", ["hauz khas", "connaught place", "gurugram", "noida", "south extension", "saket"]),
        "chennai": ("Chennai", "Tamil Nadu", ["t nagar", "anna nagar", "adyar", "velachery", "besant nagar", "omr"]),
        "kolkata": ("Kolkata", "West Bengal", ["salt lake", "new town", "park street", "ballygunge", "alipore"]),
        "austin": ("Austin", "Texas, USA", ["downtown", "south congress", "domain", "east austin"]),
        "london": ("London", "United Kingdom", ["shoreditch", "soho", "camden", "canary wharf"]),
        "singapore": ("Singapore", "Singapore", ["marina bay", "orchard", "tanjong pagar", "tiong bahru"])
    }
    
    for city_key, (city_name, state_name, localities) in cities.items():
        if city_key in t:
            found_locality = localities[0].title()
            for loc in localities:
                if loc in t:
                    found_locality = loc.title()
                    break
            return city_name, found_locality, state_name
            
    for city_key, (city_name, state_name, localities) in cities.items():
        for loc in localities:
            if loc in t:
                return city_name, loc.title(), state_name
                
    return "Hyderabad", "Kondapur", "Telangana"

def classify_and_understand_idea(
    idea_text: str,
    explicit_capital: Optional[float] = None,
    explicit_currency: Optional[str] = None,
    explicit_location: Optional[str] = None,
    explicit_mode: Optional[str] = None,
    risk_preference: Optional[str] = None,
    experience_level: Optional[str] = None
) -> Dict[str, Any]:
    """
    Takes natural language idea input and optional explicit overrides,
    producing a complete, validated, structured business launch profile.
    """
    raw_text = (idea_text or "").strip()
    
    extracted_cap, extracted_curr = parse_currency_and_capital(raw_text)
    final_capital = explicit_capital or extracted_cap or 300_000.0
    final_currency = explicit_currency or extracted_curr or "INR"
    
    detected_mode = explicit_mode or detect_start_mode(raw_text)
    sector_slug, category_title, specific_type = detect_sector_and_category(raw_text)
    
    city, locality, state = detect_location(raw_text)
    if explicit_location and explicit_location.strip():
        city = explicit_location.strip()
        locality = f"{city} Center"
        
    generated_name = ""
    words = [w for w in re.split(r'\W+', raw_text) if len(w) > 3]
    if "snack" in raw_text.lower():
        generated_name = "NutriBites Artisanal Kitchen"
    elif "cafe" in raw_text.lower() or "coffee" in raw_text.lower():
        generated_name = "Aura Roast Specialty Cafe"
    elif "saas" in raw_text.lower() or "software" in raw_text.lower():
        generated_name = "PulseOps AI Suite"
    elif "clinic" in raw_text.lower() or "health" in raw_text.lower():
        generated_name = "Zenith Wellness & Care"
    else:
        generated_name = f"Nova {category_title.split()[0]} Studio"

    if sector_slug == "food-beverage":
        target_audience = "Health-conscious working professionals, urban parents, gym-goers, and busy households seeking guilt-free snack alternatives."
        primary_usp = "100% natural, preservative-free ingredients, traditional millet & seed superfoods, delivered freshly prepared in eco-friendly packaging."
        initial_equipment = ["Food-grade commercial dehydrator / convection oven", "Vacuum seal packaging machine", "Digital high-precision scales & storage bins", "Sanitized prep tables & stainless steel cookware"]
        key_permits = ["FSSAI Basic Registration (₹100/yr for <₹12L turnover)", "Shop & Establishment Act Registration", "GSTIN (Exempt if turnover < ₹40L, recommended for B2B)"]
    elif sector_slug == "software-saas":
        target_audience = "Small to mid-market B2B teams, freelance agencies, and remote operators needing streamlined automation."
        primary_usp = "Lightweight, zero-code onboarding with automated workflow triggers and integrated analytics dashboard."
        initial_equipment = ["Developer workstations & staging cloud servers (AWS/Vercel)", "Database & authentication subscription", "SSL & domain security suite"]
        key_permits = ["Private Limited / LLP Incorporation", "GST Registration", "Software Data Privacy Compliance (GDPR/DPDP)"]
    else:
        target_audience = "Discerning local urban consumers prioritizing quality, authenticity, and personalized customer care."
        primary_usp = "Hyper-curated product selection with transparent sourcing, competitive pricing, and high-touch customer support."
        initial_equipment = ["Point of Sale (POS) system & barcode scanner", "Display shelving / workspace fixtures", "Inventory storage containers"]
        key_permits = ["Trade License / Municipal Shop Permit", "GST Registration", "Basic Labor Welfare Compliance"]

    monthly_burn_estimate = {
        "Home-Based": max(15_000, final_capital * 0.08),
        "Online": max(25_000, final_capital * 0.10),
        "Physical Store": max(55_000, final_capital * 0.14),
        "Mobile Business": max(30_000, final_capital * 0.11),
        "Hybrid": max(45_000, final_capital * 0.12)
    }.get(detected_mode, 30_000)
    
    estimated_runway_months = round(final_capital / (monthly_burn_estimate or 1), 1)

    readiness_score = 82.0
    if final_capital >= 500_000:
        readiness_score = 88.0
    elif final_capital < 150_000:
        readiness_score = 74.0

    return {
        "business_name": generated_name,
        "sector": sector_slug,
        "category": category_title,
        "business_type": specific_type,
        "business_start_mode": detected_mode,
        "capital": final_capital,
        "currency": final_currency,
        "city": city,
        "locality": locality,
        "state": state,
        "country": "India" if final_currency == "INR" else "Global",
        "location": f"{locality}, {city}",
        "risk_preference": risk_preference or "Moderate",
        "experience_level": experience_level or "Beginner",
        "time_horizon": "3 years",
        "objective": f"Launch a profitable {detected_mode} {category_title} with quick break-even and sustainable growth.",
        "target_audience": target_audience,
        "primary_usp": primary_usp,
        "initial_equipment": initial_equipment,
        "key_permits": key_permits,
        "estimated_monthly_burn": round(monthly_burn_estimate, 2),
        "estimated_runway_months": estimated_runway_months,
        "recommended_launch_timeline": "30-45 Days" if detected_mode == "Home-Based" else "60-90 Days",
        "readiness_score": readiness_score,
        "analysis_notes": f"Detected {detected_mode} model in {category_title}. High capital efficiency due to low overheads, enabling strong early unit economics."
    }
