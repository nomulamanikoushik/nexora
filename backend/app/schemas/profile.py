from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict

class BusinessProfileCreate(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=150, description='Proposed or working business name')
    sector: str = Field(..., description='Industry sector (e.g. food-beverage, software-saas, retail)')
    business_type: str = Field(..., min_length=3, max_length=250, description='Specific idea (e.g. Artisanal Cloud Kitchen & Specialty Cafe)')
    location: str = Field(..., min_length=2, max_length=100, description='Target location or city (e.g. Hyderabad, Bengaluru)')
    capital: float = Field(..., gt=0, description='Total available starting capital')
    currency: str = Field(default='INR', description='Currency code: INR, USD, EUR, GBP')
    objective: Optional[str] = Field(default='Launch a profitable scalable business with strong unit economics', description='Core startup objective')
    risk_preference: str = Field(default='Moderate', description='Conservative, Moderate, or Aggressive')
    time_horizon: str = Field(default='3 years', description='1 year, 3 years, 5 years')
    experience_level: str = Field(default='Beginner', description='Beginner, Intermediate, Experienced')
    business_start_mode: str = Field(default='Home-Based', description='Home-Based, Online, Physical Store, Mobile Business, Hybrid')
    custom_idea_text: Optional[str] = Field(default=None, description='Free-form natural language description of the business idea')
    locality: Optional[str] = Field(default=None, description='Neighborhood or sub-locality, e.g. Kondapur, Koramangala')
    city: Optional[str] = Field(default=None, description='Target city, e.g. Hyderabad, Bengaluru')
    state: Optional[str] = Field(default=None, description='State or province, e.g. Telangana, Karnataka')
    country: Optional[str] = Field(default='India', description='Country name')
    target_audience_notes: Optional[str] = Field(default=None, description='Target demographic details')
    primary_usp: Optional[str] = Field(default=None, description='Unique selling proposition')
    target_customer: Optional[str] = Field(default=None, description='Known target customer segments')
    constraints: Optional[str] = Field(default=None, description='Any special physical, legal, or capital constraints')

class BusinessProfileResponse(BusinessProfileCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    normalized_profile: Optional[Dict[str, Any]] = None
    created_at: datetime

class BusinessUnderstandRequest(BaseModel):
    idea: str = Field(..., min_length=5, description='Natural language description of the business idea')
    capital: Optional[float] = Field(default=None, description='Starting capital if mentioned or known')
    location: Optional[str] = Field(default=None, description='City or locality if known')
    currency: Optional[str] = Field(default='INR', description='Currency code')
    start_mode: Optional[str] = Field(default=None, description='Optional preferred mode: Home-Based, Online, Physical Store, Mobile, Hybrid')

class BusinessUnderstandResponse(BaseModel):
    business_name: str
    category: str
    likely_sector: str
    business_model: str
    start_mode: str
    target_customers: str
    required_resources: List[str]
    possible_competitors: List[str]
    location_relevance: str
    estimated_startup_requirements: Dict[str, Any]
    confidence_score: float
    suggested_profile: Dict[str, Any]
    explanation: str

class LocationCompareRequest(BaseModel):
    locations: List[str] = Field(..., min_length=2, description='List of 2 or more cities/localities to compare')
    sector: Optional[str] = Field(default='food-beverage', description='Sector context')
    business_type: Optional[str] = Field(default='Small-Scale Business', description='Type of business')
    capital: Optional[float] = Field(default=1000000.0, description='Capital in INR')

class LocationCompareResponse(BaseModel):
    compared_locations: List[Dict[str, Any]]
    comparison_matrix: Dict[str, Any]
    recommended_location: str
    recommendation_reason: str
    key_tradeoffs: List[str]
