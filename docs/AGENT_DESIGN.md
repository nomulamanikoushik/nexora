# Multi-Agent Design Document

## Project: NEXORA: Intelligent multiagent for business planning startup
**Agents Count**: 13 (12 Specialized Domain Agents + 1 Central Orchestrator)

---

## Agent Specification Table

| # | Agent Name | Primary System Role | Stage | Output Schema Focus |
|---|---|---|---|---|
| 1 | `business_understanding` | Profile Normalizer | Stage 1 | Normalized capital, currency, constraints, runway goals |
| 2 | `market_research` | Industry Market Analyst | Stage 2 | TAM, SAM, SOM, sector CAGR, macro growth indicators |
| 3 | `customer_analysis` | Persona & Demand Specialist | Stage 2 | 3 customer personas, AOV, ordering frequency, pain points |
| 4 | `competitor_analysis` | Landscape & Moat Specialist | Stage 2 | Direct/indirect competitors, entry barriers, recommended moat |
| 5 | `location_analysis` | Geographic Fit Specialist | Stage 2 | Top 3 micromarkets, rent/sqft, footfall & demographic density |
| 6 | `business_model` | Revenue Architecture Specialist | Stage 3 | Value prop, lean canvas, unit economics, revenue split |
| 7 | `capital_planning` | Capital Allocation Strategist | Stage 3 | 8 capital buckets, initial vs revised safety buffer % |
| 8 | `cost_revenue` | Financial Modeling Specialist | Stage 3 | Capex, monthly Opex burn, 3 scenarios, break-even months |
| 9 | `compliance` | Statutory Clearance Specialist | Stage 3 | Mandatory licenses, authorities, timelines, legal disclaimer |
| 10 | `marketing` | Go-To-Market Strategist | Stage 3 | 3-phase launch playbook, channel allocation, CAC targets |
| 11 | `risk_critic` | Chief Risk Officer / Validator | Stage 4 | Cross-audit, runway check, revision requests, risk register |
| 12 | `strategy` | Master Strategic Architect | Stage 5 | SWOT matrix, 4 strategic pillars, 9-phase roadmap |
| 13 | `orchestrator` | Central Controller & State Graph | All | DAG execution, SSE progress streaming, DB state persistence |

---

## The Critic Revision Loop Protocol

```text
[Stage 3 Agents Finish Initial Allocations]
                  ?
                  ?
       [Agent 11: Risk & Critic Audits]
                  ?
      Is (Working Capital + Contingency)
         < 2.0 Months of Fixed Burn?
                  ?
        ?????????????????????
       YES                 NO
        ?                   ?
        ?                   ?
[Critic Challenge Issued] [Validation Approved]
[Target: Capital Planning]          ?
        ?                   ?
        ?                   ?
[Re-balance: Capex -9%] [Strategy Agent Synthesizes]
[Safety Buffer Fortified]
        ?
        ?
[Critic Re-evaluates: Approved]
```
