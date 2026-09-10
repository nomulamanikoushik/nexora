# NEXORA: Intelligent multiagent for business planning startup

Base URL: `/api/v1`  
Interactive OpenAPI UI: `http://localhost:8000/docs`

---

## Endpoints Summary

### 1. System Health
- **`GET /health`**
  - Response: `{"status": "healthy", "service": "...", "version": "1.0.0", "timestamp": "..."}`

### 2. Sectors & Benchmarks
- **`GET /sectors`**: Lists all 8 pre-seeded industries with macro CAGR and capital weights.
- **`GET /sectors/{slug}`**: Detailed benchmarks for a specific industry (e.g. `food-beverage`).

### 3. Authentication & Guest Access
- **`POST /auth/register`**: Creates new founder account with email and password.
- **`POST /auth/login`**: Authenticates and issues JWT bearer token.
- **`POST /auth/guest`**: Instant 1-click ephemeral founder session without credential typing.

### 4. Business Plans & Multi-Agent Orchestrator
- **`POST /plans`**: Creates profile and returns `plan_id` with `stream_url` and `sync_url`.
- **`GET /plans/{id}/stream`**: Server-Sent Events (SSE) live progress feed streaming step-by-step agent runs, critic debates, and progress percentages.
- **`POST /plans/{id}/execute-sync`**: Synchronous execution of the complete 13-agent pipeline.
- **`GET /plans`**: Lists all saved business plans.
- **`GET /plans/{id}`**: Full plan object containing all sections, capital breakdowns, and agent runs.
- **`GET /plans/{id}/agents`**: Chronological audit trail of all agent executions and revisions.
- **`GET /plans/{id}/report`**: Print-ready executive business plan report.

### 5. What-If Scenario Simulator
- **`POST /what-if`**:
  - Request: `{"plan_id": "...", "capital": 1800000, "scale_factor": 1.2, "risk_preference": "Moderate"}`
  - Response: Complete before-and-after variance diff, capital reallocation, runway delta, break-even variance, and feasibility score delta.
