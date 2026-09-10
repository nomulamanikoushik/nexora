import os
import json
import logging
import requests
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("nexora.llm")

class LLMAdapter:
    """
    Pluggable LLM Adapter:
    Supports Gemini API, OpenAI API, and an intelligent Benchmark Heuristic Simulator.
    Guarantees deterministic, rich, domain-grounded business planning even without external API keys.
    """
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.provider = settings.DEFAULT_LLM_PROVIDER

    def generate(self, system_prompt: str, user_prompt: str, json_schema: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        # 1. Try Gemini if configured
        if self.gemini_key and (self.provider in ["gemini", "auto"]):
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                payload = {
                    "contents": [{"role": "user", "parts": [{"text": f"{system_prompt}\n\nTask:\n{user_prompt}\n\nReturn strictly valid JSON only."}]}],
                    "generationConfig": {"response_mime_type": "application/json", "temperature": 0.2}
                }
                resp = requests.post(url, json=payload, timeout=20)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(raw_text)
            except Exception as e:
                logger.warning(f"Gemini call failed or skipped, falling back: {e}")

        # 2. Try OpenAI if configured
        if self.openai_key and (self.provider in ["openai", "auto"]):
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {self.openai_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": f"{system_prompt}\nReturn JSON strictly."},
                        {"role": "user", "content": user_prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["choices"][0]["message"]["content"]
                    return json.loads(raw_text)
            except Exception as e:
                logger.warning(f"OpenAI call failed or skipped, falling back: {e}")

        # 3. Default fallback to None (caller will use deterministic heuristic benchmark simulator)
        return None

llm_service = LLMAdapter()
