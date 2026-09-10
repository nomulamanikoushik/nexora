# NEXORA: Intelligent multiagent for business planning startup

**Project Title**: **NEXORA: Intelligent multiagent for business planning startup**  
**Tagline**: **?From Capital to Business.?**

---

## 1. High-Level Architectural Blueprint

NEXORA is built on an enterprise-grade, asynchronous, multi-agent orchestration pattern. It avoids shallow single-prompt chat interactions by decomposing business planning into specialized autonomous agents that execute sequentially and in parallel, cross-validate each other's outputs, and actively demand revisions when financial, operational, or regulatory inconsistencies are detected.

```mermaid
graph TD
    User([Founder / Entrepreneur]) --> Frontend[React 18 + Vite + Tailwind CSS + Recharts]
    Frontend -->|REST API + SSE Stream| Backend[FastAPI Core Server]
    
    subgraph Backend_Services [Backend Core Services]
        Backend --> Orchestrator[Orchestrator Agent State Machine]
        Backend --> ScoringEngine[Explainable Feasibility Scoring Engine]
        Backend --> WhatIfEngine[Interactive What-If Simulation Engine]
        Backend --> Auth[JWT & Guest Session Manager]
    end

    subgraph Data_Layer [Data & Persistence]
        Backend --> DB[(SQLAlchemy: SQLite / PostgreSQL)]
        DB --> Models[Users, Profiles, Plans, Runs, Scenarios]
        DB --> SeedBenchmarks[Industry Seed Benchmarks: 8 Sectors]
    end

    subgraph Agentic_Pipeline [The 13 Specialized Agents]
        Orchestrator --> A1[1. Business Understanding Agent]
        A1 --> Stage2[Stage 2: Parallel Market Discovery]
        Stage2 --> A2[2. Market Research Agent]
        Stage2 --> A3[3. Customer Analysis Agent]
        Stage2 --> A4[4. Competitor Analysis Agent]
        Stage2 --> A5[5. Location Analysis Agent]

        Stage2 --> Stage3[Stage 3: Business & Financial Blueprinting]
        Stage3 --> A6[6. Business Model Agent]
        Stage3 --> A7[7. Capital Planning Agent]
        Stage3 --> A8[8. Cost & Revenue Agent]
        Stage3 --> A9[9. Compliance Agent]
        Stage3 --> A10[10. Marketing Agent]

        Stage3 --> Stage4[Stage 4: Risk & Critic Cross-Agent Audit]
        Stage4 --> A11[11. Risk & Critic Agent]
        A11 -->|Inconsistency / Tight Cash Runway| RevisionLoop{Revision Needed?}
        RevisionLoop -->|Yes| Stage3
        RevisionLoop -->|Approved| Stage5[Stage 5: Master Strategy Synthesis]

        Stage5 --> A12[12. Strategy Agent]
        Stage5 --> A13[13. Orchestrator Final Plan Assembly]
    end

    subgraph LLM_Adapter_Layer [Pluggable Intelligence Layer]
        A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 & A10 & A11 & A12 --> LLMAdapter[Pluggable LLM Adapter]
        LLMAdapter --> Gemini[Google Gemini API]
        LLMAdapter --> OpenAI[OpenAI API]
        LLMAdapter --> HeuristicSimulator[High-Fidelity Heuristic Benchmark Simulator]
    end
```

---

## 2. Multi-Agent Collaboration & The Critic Loop

Unlike systems that merge independent prompts, NEXORA agents exchange structured JSON payloads and cross-audit dependencies:

1. **Capital vs. Burn Cross-Audit**: The **Risk & Critic Agent** audits the ratio of `Working Capital Reserve + Contingency` produced by the **Capital Planning Agent** against the `Monthly Operating Burn` modeled by the **Cost & Revenue Agent**.
2. **Dynamic Revision Demand**: If the liquid safety buffer covers less than 2.0 months of operating burn, the Critic flags `verdict = "REVISION_REQUIRED"` and issues concrete rebalancing instructions.
3. **Agent Rebalancing**: The **Capital Planning Agent** re-runs with `is_revision = True`, trimming physical machinery and setup Capex by 8-9% and channeling capital into liquid working capital reserves.
4. **Second-Pass Validation**: The Critic re-evaluates the revised financial envelope and marks `verdict = "VALIDATION_APPROVED"`.
5. **Master Strategy Synthesis**: The **Strategy Agent** integrates all validated findings into an 11-week, 9-phase launch roadmap with SWOT analysis and execution pillars.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3.4, Recharts 2.12, Lucide Icons
- **Backend**: Python 3.11, FastAPI 0.110, Pydantic v2, SQLAlchemy 2.0, Uvicorn
- **Database**: SQLite (default zero-friction local mode) / PostgreSQL (production docker mode)
- **Agent Framework**: Custom Directed Acyclic Graph (DAG) state machine with Server-Sent Events (SSE) streaming
- **Authentication**: JWT Bearer Tokens + Instant 1-Click Guest Founder session
- **Testing**: Pytest test suite covering all 13 agents, critic loop, and endpoints
