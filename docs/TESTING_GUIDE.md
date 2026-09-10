# NEXORA: Intelligent multiagent for business planning startup

---

## 1. Backend Automated Test Suite

The backend test suite is built on `pytest` and `fastapi.testclient`.

### Running Tests
```bash
cd backend
$env:PYTHONPATH = "C:\Users\nomul\.gemini\antigravity\scratch\nexora\backend"
python -m pytest tests/test_backend.py -v
```

### Test Coverage Summary

1. **`test_health_check`**:
   - Verifies `/api/v1/health` endpoint returns `200 OK` with application name, version, and server timestamp.
2. **`test_get_sectors`**:
   - Asserts that all 8 industry sectors (`food-beverage`, `software-saas`, `retail`, `healthcare`, `education`, `logistics`, `manufacturing`, `renewable-energy`) are properly loaded in the database.
3. **`test_guest_auth`**:
   - Validates ephemeral guest account creation, password hashing, and JWT token issuance.
4. **`test_all_12_agents_execution`**:
   - Executes each of the 12 specialized agents sequentially with a mock context, verifying structured schema adherence, findings, risks, assumptions, and explainability objects.
5. **`test_critic_feedback_and_revision_loop`**:
   - **Crucial Multi-Agent Test**:
     - Step 1: Simulates initial capital allocation with 17% buffer.
     - Step 2: Asserts `RiskCriticAgent` flags `revision_needed = True` and targets `capital_planning`.
     - Step 3: Re-executes `CapitalPlanningAgent` with revision flag, asserting buffer increases to 25%.
     - Step 4: Re-executes `RiskCriticAgent`, asserting second-pass produces `revision_needed = False` and `verdict = "VALIDATION_APPROVED"`.
6. **`test_scoring_and_what_if`**:
   - Validates the 8-pillar composite feasibility scoring engine and tests the sensitivity recalculation logic when capital is shifted from ?10L to ?18L.
7. **`test_end_to_end_plan_flow`**:
   - Tests the complete lifecycle: `POST /plans` $\rightarrow$ `POST /plans/{id}/execute-sync` $\rightarrow$ `GET /plans/{id}` $\rightarrow$ `POST /what-if`.

---

## 2. Frontend Build & Asset Verification

```bash
cd frontend
npm run build
```
Validates:
- Strict JSX syntax checking
- Tailwind CSS class resolution
- Recharts responsive container bundling
- Output: Single-page application bundle ready for production distribution.
