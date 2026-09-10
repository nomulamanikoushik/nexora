# Non-Functional Requirements Specification (NFRS)

# NEXORA: Intelligent multiagent for business planning startup

---

## 1. Performance & Latency (NFR-1)
- **NFR-1.1**: The complete 13-agent orchestration pipeline (including parallel execution and the Critic revision loop) must complete execution in under **5 seconds** in benchmark mode and under **25 seconds** when invoking live external LLM APIs.
- **NFR-1.2**: Server-Sent Events (SSE) must push progress updates to the frontend with an event dispatch latency $<100\text{ ms}$.
- **NFR-1.3**: The interactive What-If Simulator recalculation endpoint must respond in $<250\text{ ms}$.

---

## 2. Scalability & Architecture (NFR-2)
- **NFR-2.1**: The backend must run asynchronously on FastAPI with ASGI worker concurrency.
- **NFR-2.2**: The data layer must support database connection pooling and seamless dual-engine operation (SQLite for local zero-setup execution, PostgreSQL 16 for production deployments).
- **NFR-2.3**: Monorepo modularity: all agent logic must reside in discrete, independently testable Python classes inheriting from `BaseAgent`.

---

## 3. Security & Privacy (NFR-3)
- **NFR-3.1**: Authentication must use standard JWT Bearer tokens signed with HMAC-SHA256 (`HS256`).
- **NFR-3.2**: Passwords must be hashed using `bcrypt` with appropriate work factors.
- **NFR-3.3**: No external API keys (e.g. Gemini, OpenAI) must ever be exposed to the client-side bundle. All LLM calls must be proxied through the server-side `LLMAdapter`.
- **NFR-3.4**: Ephemeral guest sessions must allow zero-friction demo usage without collecting personal contact details.

---

## 4. Reliability & Fault Tolerance (NFR-4)
- **NFR-4.1**: If an external LLM provider experiences network timeout or rate-limiting, the system must gracefully fall back to the internal deterministic benchmark simulation engine without crashing the user session.
- **NFR-4.2**: Database transactions during plan creation and scenario simulation must execute atomically with automatic rollbacks upon failure.

---

## 5. Explainability & Responsible AI (NFR-5)
- **NFR-5.1**: The application must never present unexplained numeric outputs. Every key recommendation must feature an explainability block detailing rationale, assumptions, risks, and confidence scores.
- **NFR-5.2**: The platform must explicitly display statutory disclaimers clarifying that all projections are modeled estimates and not guarantees of commercial profit.
