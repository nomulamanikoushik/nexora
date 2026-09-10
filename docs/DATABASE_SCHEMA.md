# Database Schema & Data Models

## Project: NEXORA: Intelligent multiagent for business planning startup

---

## 1. Relational Entities

### `users`
- `id` (UUID PK): Unique user identifier.
- `email` (VARCHAR Unique): Founder contact email.
- `hashed_password` (VARCHAR): Bcrypt salted hash.
- `full_name` (VARCHAR): Founder display name.
- `is_active` (BOOLEAN): Account status.
- `is_guest` (BOOLEAN): Ephemeral guest indicator.
- `created_at` (TIMESTAMP): Registration timestamp.

### `sectors`
- `id` (UUID PK): Sector identifier.
- `slug` (VARCHAR Unique Index): Canonical slug (e.g., `food-beverage`, `software-saas`).
- `name` (VARCHAR): Industry display title.
- `avg_startup_capex_inr` (FLOAT): Baseline capital benchmark.
- `default_gross_margin` (FLOAT): Typical gross margin ratio.
- `cagr` (FLOAT): Annualized compounding growth rate.
- `capital_weights` (JSON): Category allocation weights.
- `compliance_items` (JSON): Statutory clearance items.
- `locations_data` (JSON): Micromarket rent and footfall data.

### `business_profiles`
- `id` (UUID PK): Profile identifier.
- `user_id` (UUID FK -> `users.id`): Associated founder.
- `business_name` (VARCHAR): Proposed startup title.
- `sector` (VARCHAR): Target industry sector.
- `business_type` (VARCHAR): Specific operating model.
- `location` (VARCHAR): Primary target city.
- `capital` (FLOAT): Total available starting funds.
- `currency` (VARCHAR): Currency code (e.g. `INR`, `USD`).
- `risk_preference` (VARCHAR): Conservative / Moderate / Aggressive.
- `time_horizon` (VARCHAR): Planning timeframe.
- `experience_level` (VARCHAR): Beginner / Intermediate / Experienced.

### `business_plans`
- `id` (UUID PK): Plan identifier.
- `profile_id` (UUID FK -> `business_profiles.id`): Associated profile.
- `title` (VARCHAR): Plan title.
- `status` (VARCHAR): `running`, `completed`, `revising`, `failed`.
- `feasibility_score` (FLOAT): Composite 0-100 score.
- `score_breakdown` (JSON): 8-pillar suitability index.
- `capital_allocation` (JSON): 8-bucket allocation breakdown.
- `cost_analysis` (JSON): Capex and recurring monthly Opex.
- `revenue_scenarios` (JSON): Conservative / Baseline / Optimistic models.
- `break_even_analysis` (JSON): Month & daily volume targets.
- `launch_roadmap` (JSON): 9-phase timeline.
- `revision_count` (INTEGER): Number of critic revision cycles executed.

### `agent_runs`
- `id` (UUID PK): Execution identifier.
- `plan_id` (UUID FK -> `business_plans.id`): Associated plan.
- `agent_name` (VARCHAR): Executing agent (e.g. `risk_critic`).
- `status` (VARCHAR): `completed`, `revising`, `failed`.
- `step_order` (INTEGER): Sequence in orchestration DAG.
- `output_payload` (JSON): Structured findings, assumptions, and explainability.
- `critic_issues` (JSON): Challenge points if flagged by Critic.
- `execution_time_ms` (INTEGER): Runtime duration in milliseconds.

### `scenarios`
- `id` (UUID PK): Scenario identifier.
- `plan_id` (UUID FK -> `business_plans.id`): Associated plan.
- `name` (VARCHAR): Scenario title.
- `capital_delta` (FLOAT): Variance from baseline capital.
- `runway_months` (FLOAT): Simulated operating runway.
- `feasibility_delta` (FLOAT): Score shift (+/- points).
- `results_json` (JSON): Full comparative diff payload.
