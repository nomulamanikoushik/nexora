/**
 * NEXORA Frontend API Client
 * 
 * Provides unified, production-ready communication with the FastAPI backend.
 * Implements pre-flight health checks, real-time Server-Sent Events (SSE) streaming,
 * structured logging, and clean error handling.
 */

import { 
  getApiBaseUrl, 
  getApiV1Url, 
  getHealthUrl, 
  getStreamUrl 
} from "../config/api";

import {
  DEFAULT_SECTORS,
  BENCHMARK_LOCALITIES,
  parseIdeaOffline,
  generatePlanOffline,
  compareLocationsOffline,
  simulateWhatIfOffline
} from "./offlineEngine";

/**
 * Standard fetch with configurable timeout and error reporting
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!res.ok) {
      let errDetail = `HTTP ${res.status} ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) errDetail = errorJson.detail;
      } catch {
        // Response wasn't JSON
      }
      throw new Error(errDetail);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

/**
 * Pre-flight health check to verify backend availability before launching orchestration
 */
export async function checkBackendHealth() {
  const url = getHealthUrl();
  console.log(`[NEXORA] Health check started -> ${url}`);
  try {
    const data = await fetchWithTimeout(url, { method: "GET" }, 4000);
    console.log("[NEXORA] Health check successful:", data);
    return { ok: true, data, url };
  } catch (err) {
    console.warn(`[NEXORA] Health check failed for ${url}:`, err.message);
    // Also try /api/v1/health as fallback probe
    try {
      const v1HealthUrl = `${getApiV1Url()}/health`;
      const fallbackData = await fetchWithTimeout(v1HealthUrl, { method: "GET" }, 3000);
      console.log("[NEXORA] Fallback health check successful:", fallbackData);
      return { ok: true, data: fallbackData, url: v1HealthUrl };
    } catch {
      return { ok: false, error: err.message, url };
    }
  }
}

/**
 * Legacy getHealth wrapper
 */
export async function getHealth() {
  const check = await checkBackendHealth();
  if (check.ok) return check.data;
  throw new Error(check.error || "Backend unreachable");
}

export async function getSectors() {
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/sectors`, {}, 5000);
  } catch (err) {
    console.warn("[NEXORA] Failed to fetch sectors from backend, using fallback:", err.message);
    return { sectors: DEFAULT_SECTORS };
  }
}

export async function createGuestSession() {
  try {
    const data = await fetchWithTimeout(`${getApiV1Url()}/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }, 5000);
    if (data && data.access_token) {
      localStorage.setItem("nexora_token", data.access_token);
      localStorage.setItem("nexora_user", JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    console.warn("[NEXORA] Guest auth failed, using local session:", err.message);
    const guestUser = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      name: "Guest Entrepreneur",
      email: "guest@nexora.ai",
      role: "entrepreneur"
    };
    localStorage.setItem("nexora_user", JSON.stringify(guestUser));
    return { access_token: "guest_token_offline", user: guestUser };
  }
}

/**
 * Creates a client-side demo plan descriptor for offline/demo mode simulation
 */
export function createDemoPlan(profile) {
  const planId = "demo_plan_" + Math.random().toString(36).substring(2, 10);
  const offlinePlan = generatePlanOffline(profile);
  offlinePlan.id = planId;
  offlinePlan.plan_id = planId;
  localStorage.setItem(`nexora_plan_${planId}`, JSON.stringify(offlinePlan));
  
  const saved = JSON.parse(localStorage.getItem("nexora_saved_plans") || "[]");
  // Prepend if not duplicate
  if (!saved.some(p => p.id === planId)) {
    saved.unshift(offlinePlan);
    localStorage.setItem("nexora_saved_plans", JSON.stringify(saved.slice(0, 20)));
  }

  return {
    id: planId,
    plan_id: planId,
    is_demo: true,
    status: "initialized",
    message: "Demo Mode Initialized (Simulated Multi-Agent Architecture)",
    stream_url: null,
    profile
  };
}

/**
 * Creates a new Business Plan. 
 * Connects to live backend if healthy; otherwise automatically falls back to 
 * client-side Autonomous Multi-Agent Simulation to eliminate 404 errors.
 */
export async function createPlan(profile, allowOfflineFallback = true) {
  console.log("[NEXORA] Creating business plan with profile:", profile.business_name);
  try {
    const data = await fetchWithTimeout(`${getApiV1Url()}/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    }, 6000);
    
    // Normalize properties
    const planId = data.plan_id || data.id;
    return {
      ...data,
      id: planId,
      plan_id: planId,
      is_demo: false
    };
  } catch (err) {
    console.warn("[NEXORA] Live backend createPlan error:", err.message);
    if (allowOfflineFallback) {
      console.log("[NEXORA] Gracefully transitioning to client-side multi-agent simulation.");
      return createDemoPlan(profile);
    }
    throw err;
  }
}

export async function executePlanSync(planId) {
  console.log(`[NEXORA] Executing plan sync: ${planId}`);
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/plans/${planId}/execute-sync`, {
      method: "POST"
    }, 30000);
  } catch (err) {
    console.warn("[NEXORA] Sync execution failed, reading local plan:", err.message);
    return await getPlan(planId);
  }
}

export async function getPlan(planId) {
  console.log(`[NEXORA] Fetching plan: ${planId}`);
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/plans/${planId}`, {}, 8000);
  } catch (err) {
    // Check if saved locally in demo mode
    const stored = localStorage.getItem(`nexora_plan_${planId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    throw err;
  }
}

export async function listPlans() {
  try {
    const data = await fetchWithTimeout(`${getApiV1Url()}/plans`, {}, 6000);
    return data;
  } catch (err) {
    console.warn("[NEXORA] listPlans failed from backend:", err.message);
    const local = JSON.parse(localStorage.getItem("nexora_saved_plans") || "[]");
    return { plans: local };
  }
}

export async function getPlanAgents(planId) {
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/plans/${planId}/agents`, {}, 8000);
  } catch (err) {
    console.warn("[NEXORA] getPlanAgents failed, reading from plan:", err.message);
    try {
      const plan = await getPlan(planId);
      return { agents: plan.agents || [] };
    } catch {
      return { agents: [] };
    }
  }
}

export async function getPlanReport(planId) {
  return getPlan(planId);
}

export async function runWhatIfSimulation(payload) {
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }, 6000);
  } catch (err) {
    console.warn("[NEXORA] What-if simulation backend failed, running calculation:", err.message);
    return simulateWhatIfOffline(payload);
  }
}

export async function understandIdea(payload) {
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/business/understand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }, 6000);
  } catch (err) {
    console.warn("[NEXORA] NLP understanding API failed, running local parsing:", err.message);
    return parseIdeaOffline(payload.idea_text || payload.raw_text || "");
  }
}

export async function getLocations() {
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/locations`, {}, 5000);
  } catch (err) {
    console.warn("[NEXORA] getLocations failed, using benchmark data:", err.message);
    return {
      locations: BENCHMARK_LOCALITIES,
      flat_localities: BENCHMARK_LOCALITIES
    };
  }
}

export async function compareLocations(payload) {
  try {
    return await fetchWithTimeout(`${getApiV1Url()}/location/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }, 6000);
  } catch (err) {
    console.warn("[NEXORA] compareLocations API failed, using benchmark computation:", err.message);
    return compareLocationsOffline(payload);
  }
}

/**
 * Real-time Multi-Agent Server-Sent Events (SSE) Stream
 * 
 * Subscribes to the live orchestrator stream on the backend.
 * Dispatches real-time agent updates, progress percentages, and thoughts.
 */
export function streamPlan(planId, onEvent, onError, onComplete) {
  const streamUrl = getStreamUrl(planId);
  console.log(`[NEXORA] Orchestration started -> Connecting SSE to ${streamUrl}`);

  let eventSource = null;
  let isClosed = false;
  let retryCount = 0;
  const maxRetries = 2;
  let receivedAnyEvent = false;

  function connect() {
    if (isClosed) return;

    try {
      eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        console.log("[NEXORA] SSE connected successfully.");
      };

      eventSource.onmessage = (event) => {
        if (isClosed) return;
        try {
          receivedAnyEvent = true;
          const data = JSON.parse(event.data);
          console.log(`[NEXORA] Agent update received: Step ${data.step} - ${data.agent_name} (${data.status})`);
          
          if (onEvent) onEvent(data);

          if (data.progress >= 100 || (data.step >= 16 && data.status === "completed")) {
            console.log("[NEXORA] Orchestration completed via SSE.");
            cleanup();
            if (onComplete) onComplete(data);
          }
        } catch (err) {
          console.error("[NEXORA] Error parsing SSE payload:", err, event.data);
        }
      };

      eventSource.onerror = (err) => {
        console.warn(`[NEXORA] SSE connection error (state: ${eventSource?.readyState})`);
        
        if (isClosed) return;

        // If we haven't received any events and retry limit not reached, attempt reconnect
        if (!receivedAnyEvent && retryCount < maxRetries) {
          retryCount++;
          console.log(`[NEXORA] Retrying SSE connection (${retryCount}/${maxRetries})...`);
          if (eventSource) eventSource.close();
          setTimeout(connect, 1500);
          return;
        }

        cleanup();
        if (onError) {
          onError({
            message: "Unable to connect to live agent collaboration stream.",
            url: streamUrl,
            error: err
          });
        }
      };
    } catch (createErr) {
      console.error("[NEXORA] EventSource initialization failed:", createErr);
      cleanup();
      if (onError) onError(createErr);
    }
  }

  function cleanup() {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }

  connect();

  return () => {
    cleanup();
  };
}

/**
 * Explicit Demo Mode Stream Generator
 * Used ONLY when user explicitly triggers Demo Mode.
 * Dispatches simulated agent steps at a steady pace.
 */
export function streamDemoPlan(profile, onEvent, onComplete) {
  console.log("[NEXORA] Running in Demo Mode (simulated multi-agent stream)");
  const plan = generatePlanOffline(profile);
  
  // Store in localStorage
  localStorage.setItem(`nexora_plan_${plan.id}`, JSON.stringify(plan));
  const saved = JSON.parse(localStorage.getItem("nexora_saved_plans") || "[]");
  saved.unshift(plan);
  localStorage.setItem("nexora_saved_plans", JSON.stringify(saved));

  const steps = [
    { step: 1, name: "business_understanding", role: "Profile Normalization", thought: "Normalizing capital scale, start mode, and operational assumptions.", output: "Profile standardized." },
    { step: 2, name: "market_research", role: "Industry TAM/CAGR", thought: "Benchmarking industry CAGR and consumer demand trends.", output: "Industry growing at 12.5% CAGR." },
    { step: 3, name: "customer_analysis", role: "Persona Profiling", thought: "Segmenting early adopter cohorts in target micro-market.", output: "High-value consumer profile defined." },
    { step: 4, name: "competitor_analysis", role: "Moat & Barriers", thought: "Evaluating direct incumbents and substitute pricing.", output: "Freshness and hyper-local delivery moat identified." },
    { step: 5, name: "location_analysis", role: "Micromarket Fit", thought: "Assessing footfall, lease costs, and demographic density.", output: "Suitability verified: 92/100 score." },
    { step: 6, name: "business_model", role: "Revenue & Canvas", thought: "Designing unit margins and lean overhead structure.", output: "Direct-to-consumer model calibrated." },
    { step: 7, name: "capital_planning", role: "Allocation Engine", thought: "Structuring capital outlay for high runway protection.", output: "7 capital buckets allocated." },
    { step: 8, name: "cost_revenue", role: "Break-even & Burn", thought: "Modeling 12-month cash flows and break-even curve.", output: `Break-even achieved in month ${plan.cost_revenue.break_even_month}.` },
    { step: 9, name: "compliance", role: "Statutory Checklist", thought: "Assembling mandatory permits, licenses, and statutory timelines.", output: "FSSAI, GST, and MSME registrations mapped." },
    { step: 10, name: "marketing", role: "Go-to-Market Playbook", thought: "Engineering 3-phase launch and community acquisition channels.", output: "Zero-CAC residential launch playbook ready." },
    { step: 11, name: "early_revenue", role: "First 10 Customers Engine", thought: "Developing 30-day launch sprint and First 10 Customers playbook.", output: "VIP tasting kits and WhatsApp blast configured." },
    { step: 12, name: "growth", role: "Scaling & Viral Loops", thought: "Formulating subscription replenishment and viral referral loops.", output: "Viral referral incentive structured: Give ₹100, Get ₹100." },
    { step: 13, name: "risk_critic", role: "Cross-Agent Auditor", thought: "Auditing multi-agent assumptions and stress-testing cash reserves.", output: "VALIDATION_APPROVED: 92/100 score." },
    { step: 14, name: "strategy", role: "Master Synthesis", thought: "Synthesizing validated findings into comprehensive executive launch plan.", output: "Launch strategy blueprint compiled." },
    { step: 15, name: "execution_roadmap", role: "Milestone Roadmap", thought: "Assembling weekly milestones and regulatory timelines.", output: "4-week launch sprint finalized." },
    { step: 16, name: "orchestrator", role: "Assembly & Feasibility", thought: "Executing final feasibility scoring and compiling complete business plan.", output: `Plan complete. Feasibility: ${plan.feasibility_score}/100.` }
  ];

  let current = 0;
  let isCanceled = false;

  const timer = setInterval(() => {
    if (isCanceled) {
      clearInterval(timer);
      return;
    }

    if (current < steps.length) {
      const s = steps[current];
      const progress = Math.round(((current + 1) / steps.length) * 100);

      onEvent({
        step: s.step,
        agent_name: s.name,
        status: "completed",
        progress,
        message: s.thought,
        data: {
          summary: s.output,
          role: s.role
        }
      });

      current++;
    } else {
      clearInterval(timer);
      if (onComplete) onComplete(plan);
    }
  }, 320);

  return () => {
    isCanceled = true;
    clearInterval(timer);
  };
}
