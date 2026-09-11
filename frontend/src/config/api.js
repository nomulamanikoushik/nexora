/**
 * NEXORA Centralized API Configuration
 * 
 * Manages environment-based API routing for both local development and production.
 * NEVER depends on hardcoded localhost in production.
 */

// Production default fallback if no env variable is supplied during build
export const PRODUCTION_DEFAULT_BACKEND = "https://nexora-backend.onrender.com";
export const LOCAL_DEV_DEFAULT_BACKEND = "http://localhost:8000";

/**
 * Resolves the active backend base URL with strict priority:
 * 1. User runtime override stored in localStorage ('nexora_api_base_url' or 'nexora_api_url')
 * 2. Environment variable: VITE_API_BASE_URL (standard) or VITE_API_URL (legacy)
 * 3. Localhost in development mode
 * 4. Production deployed backend URL
 */
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const userOverride = localStorage.getItem("nexora_api_base_url") || localStorage.getItem("nexora_api_url");
    if (userOverride && userOverride.trim()) {
      return normalizeUrl(userOverride.trim());
    }
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return normalizeUrl(envUrl.trim());
  }

  // Development fallback
  if (import.meta.env.DEV) {
    return LOCAL_DEV_DEFAULT_BACKEND;
  }

  // Production fallback
  return PRODUCTION_DEFAULT_BACKEND;
}

/**
 * Strips trailing slashes from URLs to avoid double slashes
 */
export function normalizeUrl(url) {
  if (!url) return "";
  return url.replace(/\/+$/, "");
}

/**
 * Returns the v1 API prefix endpoint (e.g. "https://nexora-backend.onrender.com/api/v1")
 */
export function getApiV1Url() {
  const base = getApiBaseUrl();
  return `${base}/api/v1`;
}

/**
 * Returns the standard health probe URL (e.g. "https://nexora-backend.onrender.com/health")
 */
export function getHealthUrl() {
  const base = getApiBaseUrl();
  return `${base}/health`;
}

/**
 * Returns the full SSE stream URL for an orchestrator plan execution
 */
export function getStreamUrl(planId) {
  const v1 = getApiV1Url();
  return `${v1}/plans/${planId}/stream`;
}

/**
 * Allows the user/developer to configure an alternate backend directly in the UI
 */
export function setCustomApiBaseUrl(url) {
  if (!url || !url.trim()) {
    clearCustomApiBaseUrl();
    return;
  }
  const normalized = normalizeUrl(url.trim());
  localStorage.setItem("nexora_api_base_url", normalized);
  console.log(`[NEXORA] Updated custom API Base URL: ${normalized}`);
}

/**
 * Clears custom override
 */
export function clearCustomApiBaseUrl() {
  localStorage.removeItem("nexora_api_base_url");
  localStorage.removeItem("nexora_api_url");
  console.log(`[NEXORA] Cleared custom API Base URL override.`);
}

// Initial diagnostic logging
if (typeof window !== "undefined") {
  console.log(`[NEXORA] Initialized API Base URL: ${getApiBaseUrl()}`);
}
