# Functional Requirements Specification (FRS)

# NEXORA: Intelligent multiagent for business planning startup
**Tagline**: ?From Capital to Business.?

---

## 1. User Input & Onboarding (FR-1)
- **FR-1.1**: The system must provide a responsive onboarding form accepting: Business Name, Industry Sector (8 pre-seeded industries), Business Type/Idea, Location/City, Available Starting Capital, Currency (`INR`, `USD`, `EUR`, `GBP`), Business Objective, Risk Tolerance Posture (`Conservative`, `Moderate`, `Aggressive`), Planning Time Horizon (`1 year`, `3 years`, `5 years`), Experience Level (`Beginner`, `Intermediate`, `Experienced`), Target Customer Persona (optional), and Special Constraints.
- **FR-1.2**: The form must include one-click preset buttons that instantly populate verified realistic business scenarios (e.g., *Hyderabad Artisanal Cloud Kitchen ?10L*, *Bengaluru AI SaaS ?15L*, *Mumbai Retail ?12L*, *Pune Healthcare ?25L*).
- **FR-1.3**: The system must validate inputs (e.g. `capital > 0`, non-empty strings).

---

## 2. Multi-Agent Orchestration & Communication (FR-2)
- **FR-2.1**: The system must execute a central Directed Acyclic Graph (DAG) controller (`OrchestratorAgent`) orchestrating 12 specialized agents across 6 sequential stages.
- **FR-2.2**: Agents must exchange structured JSON payloads rather than unstructured natural language text.
- **FR-2.3**: Stage 1 must normalize inputs (`BusinessUnderstandingAgent`).
- **FR-2.4**: Stage 2 must run parallel market discovery:
  - `MarketResearchAgent`: Computes TAM, SAM, SOM, CAGR, and industry growth drivers.
  - `CustomerAnalysisAgent`: Profiles 3 customer segments with AOV and buying frequency.
  - `CompetitorAnalysisAgent`: Identifies direct/indirect competitors, entry barriers, and differentiation moats.
  - `LocationAnalysisAgent`: Analyzes top 3 micromarkets, commercial rent/sq.ft, and footfall density.
- **FR-2.5**: Stage 3 must run parallel business and financial blueprinting:
  - `BusinessModelAgent`: Lean Canvas, revenue streams, and unit economics.
  - `CapitalPlanningAgent`: Allocates capital across 8 operational buckets.
  - `CostRevenueAgent`: One-time Capex, monthly burn, 3-year revenue curves, and break-even volume.
  - `ComplianceAgent`: Regulatory licenses (FSSAI, GST, Shops & Establishment, Trade License, Fire NOC) with formal advisory disclaimers.
  - `MarketingAgent`: 3-phase Go-To-Market promotional roadmap and CAC targets.
- **FR-2.6**: The system must stream execution progress and live agent dialogue in real time via Server-Sent Events (SSE) at `/api/v1/plans/{id}/stream`.

---

## 3. Critic & Validation Feedback Loop (FR-3)
- **FR-3.1**: The `RiskCriticAgent` must cross-audit all agent outputs for logical inconsistencies and budget mismatches.
- **FR-3.2**: If the liquid safety buffer (`Working Capital Reserve + Contingency`) covers less than 2.0 months of projected monthly operating burn, the agent must reject the plan (`verdict = "REVISION_REQUIRED"`) and output specific rebalancing instructions.
- **FR-3.3**: The orchestrator must intercept this challenge, set agent status to `revising`, and re-execute `CapitalPlanningAgent` and `CostRevenueAgent` with revised constraints.
- **FR-3.4**: Upon re-execution, the Critic must re-evaluate the updated financial allocations and issue `verdict = "VALIDATION_APPROVED"`.
- **FR-3.5**: The UI must display the active revision cycle and alert banner in real time.

---

## 4. Explainable Feasibility Scoring Engine (FR-4)
- **FR-4.1**: The system must compute a transparent composite feasibility score (0?100) based on 8 weighted dimensions:
  1. Capital Adequacy (20%)
  2. Market Attractiveness (15%)
  3. Customer Demand Clarity (12%)
  4. Competitive Moat (12%)
  5. Location Fit (12%)
  6. Financial Viability & Break-Even Speed (15%)
  7. Risk Resilience (8%)
  8. Business Model Strength (6%)
- **FR-4.2**: Every score and recommendation must include an explainability card detailing:
  - *Why this recommendation?*
  - *Key assumptions*
  - *Main risks*
  - *Confidence level*
  - *Data sources & industry benchmarks*

---

## 5. Interactive "What If?" Simulator (FR-5)
- **FR-5.1**: Users must be able to adjust parameters on any existing plan:
  - Starting Capital (slider)
  - Operational Scale factor (0.5x to 2.0x)
  - Risk Posture (`Conservative`, `Moderate`, `Aggressive`)
  - Target Location
- **FR-5.2**: The system must recalculate the plan and display a side-by-side comparative diff:
  - Score delta ($+/-$ points)
  - Capital reallocation comparison
  - Monthly operating burn and cash runway variance ($+/-$ months)
  - Shift in break-even milestone ($+/-$ months)
  - Adjusted risk warnings and calibrated roadmap milestones.

---

## 6. Business Plan Presentation & Export (FR-6)
- **FR-6.1**: The system must render a complete formal business plan with 14 executive sections.
- **FR-6.2**: The plan must include a phased 9-stage launch roadmap.
- **FR-6.3**: The system must support clean, print-optimized stylesheet export (`window.print()`).
