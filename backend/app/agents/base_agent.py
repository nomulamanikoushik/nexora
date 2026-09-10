import os
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.services.llm_adapter import llm_service

class BaseAgent:
    def __init__(self, name: str, role: str, step_order: int):
        self.name = name
        self.role = role
        self.step_order = step_order

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError
