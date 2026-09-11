export function getBaseUrl() {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("nexora_api_url");
    if (custom) return `${custom.replace(/\/$/, "")}/api/v1`;
    if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`;
    if (window.location.hostname.includes("github.io")) {
      return "https://69d71c9ff42e47.lhr.life/api/v1";
    }
  }
  return "/api/v1";
}

export async function getHealth() {
  const res = await fetch(`${getBaseUrl()}/health`);
  return res.json();
}

export async function getSectors() {
  const res = await fetch(`${getBaseUrl()}/sectors`);
  return res.json();
}

export async function createGuestSession() {
  const res = await fetch(`${getBaseUrl()}/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem("nexora_token", data.access_token);
    localStorage.setItem("nexora_user", JSON.stringify(data.user));
  }
  return data;
}

export async function createPlan(profile) {
  const res = await fetch(`${getBaseUrl()}/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to initialize business plan");
  }
  return res.json();
}

export async function executePlanSync(planId) {
  const res = await fetch(`${getBaseUrl()}/plans/${planId}/execute-sync`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Sync execution failed");
  return res.json();
}

export async function getPlan(planId) {
  const res = await fetch(`${getBaseUrl()}/plans/${planId}`);
  if (!res.ok) throw new Error("Plan not found");
  return res.json();
}

export async function listPlans() {
  const res = await fetch(`${getBaseUrl()}/plans`);
  return res.json();
}

export async function getPlanAgents(planId) {
  const res = await fetch(`${getBaseUrl()}/plans/${planId}/agents`);
  return res.json();
}

export async function getPlanReport(planId) {
  const res = await fetch(`${getBaseUrl()}/plans/${planId}/report`);
  return res.json();
}

export async function runWhatIfSimulation(payload) {
  const res = await fetch(`${getBaseUrl()}/what-if`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "What-If simulation failed");
  }
  return res.json();
}

export function streamPlan(planId, onEvent, onError, onComplete) {
  const eventSource = new EventSource(`${getBaseUrl()}/plans/${planId}/stream`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
      if (data.progress >= 100 || (data.step === 16 && data.status === "completed")) {
        eventSource.close();
        if (onComplete) onComplete(data);
      }
    } catch (err) {
      console.error("SSE parse error:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
    eventSource.close();
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}

export async function understandIdea(payload) {
  const res = await fetch(`${getBaseUrl()}/business/understand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to analyze business idea");
  }
  return res.json();
}

export async function getLocations() {
  const res = await fetch(`${getBaseUrl()}/locations`);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function compareLocations(payload) {
  const res = await fetch(`${getBaseUrl()}/location/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Location comparison failed");
  }
  return res.json();
}

