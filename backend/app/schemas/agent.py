from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field

class ExplainabilityBlock(BaseModel):
    why_this_recommendation: str
    key_assumptions: List[str]
    main_risks: List[str]
    confidence_level: str = 'High'  # High, Medium, Low
    data_sources: List[str]

class AgentOutputPayload(BaseModel):
    agent_name: str
    status: str = 'completed'  # completed, revising, failed
    summary: str
    findings: List[Dict[str, Any]] = Field(default_factory=list)
    risks: List[Dict[str, Any]] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    confidence: str = 'High'
    sources: List[str] = Field(default_factory=list)
    explainability: Optional[ExplainabilityBlock] = None
    data: Optional[Dict[str, Any]] = None

class AgentRunResponse(BaseModel):
    id: str
    plan_id: str
    agent_name: str
    status: str
    step_order: int
    summary: Optional[str] = None
    output_payload: Optional[Dict[str, Any]] = None
    revision_count: int = 0
    critic_issues: Optional[List[str]] = None
    execution_time_ms: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AgentExecutionEvent(BaseModel):
    step: int
    agent_name: str
    status: str  # waiting, running, completed, revising, failed
    message: str
    progress: int  # 0 - 100
    timestamp: str
    data: Optional[Dict[str, Any]] = None
