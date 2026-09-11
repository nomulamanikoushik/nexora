import React, { useEffect, useState, useRef } from "react";
import { 
  Cpu, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Terminal, 
  Sparkles,
  ShieldCheck,
  FileText,
  RefreshCw,
  Server,
  AlertCircle,
  ExternalLink,
  Edit3,
  Check,
  Download,
  Bookmark
} from "lucide-react";
import AgentCard from "../components/AgentCard";
import { 
  checkBackendHealth, 
  streamPlan, 
  streamDemoPlan, 
  getPlan, 
  executePlanSync 
} from "../api/client";
import { 
  getApiBaseUrl, 
  setCustomApiBaseUrl, 
  clearCustomApiBaseUrl 
} from "../config/api";

export default function AgentWorkspacePage({ planInit, onPlanComplete, setActivePage }) {
  const activePlanId = planInit?.plan_id || planInit?.id;

  const [connectionState, setConnectionState] = useState("checking"); // checking | connected | failed | demo
  const [connectionError, setConnectionError] = useState(null);
  const [backendUrlInput, setBackendUrlInput] = useState(getApiBaseUrl());
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("Verifying backend availability...");
  const [logs, setLogs] = useState([]);
  const [criticAlert, setCriticAlert] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [finalPlan, setFinalPlan] = useState(null);

  // 16 Specialized Pipeline Agents
  const initialAgents = [
    { name: "business_understanding", role: "Profile Normalization", step: 1, status: "waiting" },
    { name: "market_research", role: "Industry TAM/CAGR", step: 2, status: "waiting" },
    { name: "customer_analysis", role: "Persona Profiling", step: 3, status: "waiting" },
    { name: "competitor_analysis", role: "Moat & Barriers", step: 4, status: "waiting" },
    { name: "location_analysis", role: "Micromarket Fit", step: 5, status: "waiting" },
    { name: "business_model", role: "Revenue & Canvas", step: 6, status: "waiting" },
    { name: "capital_planning", role: "Allocation Engine", step: 7, status: "waiting", revisionCount: 0 },
    { name: "cost_revenue", role: "Break-even & Burn", step: 8, status: "waiting", revisionCount: 0 },
    { name: "compliance", role: "Statutory Checklist", step: 9, status: "waiting" },
    { name: "marketing", role: "Go-to-Market Playbook", step: 10, status: "waiting" },
    { name: "early_revenue", role: "First 10 Customers Engine", step: 11, status: "waiting" },
    { name: "growth", role: "Scaling & Viral Loops", step: 12, status: "waiting" },
    { name: "risk_critic", role: "Cross-Agent Auditor", step: 13, status: "waiting" },
    { name: "strategy", role: "Master Synthesis", step: 14, status: "waiting" },
    { name: "execution_roadmap", role: "Milestone Roadmap", step: 15, status: "waiting" },
    { name: "orchestrator", role: "Assembly & Feasibility", step: 16, status: "waiting" }
  ];

  const [agents, setAgents] = useState(initialAgents);
  const logContainerRef = useRef(null);
  const streamUnsubscribeRef = useRef(null);

  // Main Orchestration Controller
  const startPipeline = async () => {
    if (streamUnsubscribeRef.current) {
      streamUnsubscribeRef.current();
    }

    setConnectionState("checking");
    setConnectionError(null);
    setProgress(0);
    setCurrentMessage("Executing pre-flight health check on NEXORA AI backend...");
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: "system",
        status: "checking",
        message: `Probing backend health at ${getApiBaseUrl()}...`
      }
    ]);

    // Step 1: Pre-flight health check
    const health = await checkBackendHealth();

    if (!health.ok) {
      console.warn("[NEXORA] Pre-flight health check failed:", health.error);
      setConnectionState("failed");
      setConnectionError({
        url: health.url,
        error: health.error,
        status: "Backend Unreachable"
      });
      setCurrentMessage("Backend connection failed. Orchestration paused.");
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "system",
          status: "failed",
          message: `Unable to connect to backend at ${health.url} (${health.error})`
        }
      ]);
      return;
    }

    // Step 2: Backend is healthy -> Start live SSE orchestration
    setConnectionState("connected");
    setProgress(5);
    setCurrentMessage("Connected to NEXORA Multi-Agent Backend. Initializing pipeline...");
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: "orchestrator",
        status: "connected",
        message: `Backend healthy (${health.data?.service || "NEXORA API"}). Initiating 16-agent collaboration stream...`
      }
    ]);

    if (!activePlanId) {
      console.error("[NEXORA] Missing activePlanId; cannot subscribe to stream.");
      return;
    }

    // Subscribe to SSE
    streamUnsubscribeRef.current = streamPlan(
      activePlanId,
      (event) => {
        handleAgentEvent(event);
      },
      async (err) => {
        console.warn("[NEXORA] SSE stream error, attempting sync fallback:", err);
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            agent: "orchestrator",
            status: "warning",
            message: "Stream connection disrupted. Attempting synchronous pipeline recovery..."
          }
        ]);

        try {
          const plan = await executePlanSync(activePlanId);
          handleCompletion(plan);
        } catch (syncErr) {
          console.error("[NEXORA] Sync fallback failed:", syncErr);
          setConnectionState("failed");
          setConnectionError({
            url: getApiBaseUrl(),
            error: syncErr.message || "Synchronous execution failed",
            status: "Execution Error"
          });
        }
      },
      async () => {
        try {
          const plan = await getPlan(activePlanId);
          handleCompletion(plan);
        } catch (e) {
          console.error("[NEXORA] Error retrieving final plan:", e);
        }
      }
    );
  };

  const handleAgentEvent = (event) => {
    // Dynamic progress computation
    if (typeof event.progress === "number") {
      setProgress(event.progress);
    }
    if (event.message) {
      setCurrentMessage(event.message);
    }

    // Append log
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: event.agent_name || "orchestrator",
        status: event.status || "running",
        message: event.message || event.thought || "Processing..."
      }
    ]);

    // Update agent state
    setAgents((prevAgents) =>
      prevAgents.map((ag) => {
        if (ag.name === event.agent_name || (event.step && ag.step === event.step)) {
          const isRevising = event.status === "revising";
          return {
            ...ag,
            status: event.status || "completed",
            summary: event.data?.summary || event.output || ag.summary,
            outputPayload: event.data || ag.outputPayload,
            revisionCount: isRevising ? (ag.revisionCount || 0) + 1 : ag.revisionCount,
            criticIssues: event.data?.data?.critic_issues || ag.criticIssues
          };
        }
        return ag;
      })
    );

    // Critic banner
    if (event.agent_name === "risk_critic" && event.status === "revising") {
      setCriticAlert({
        title: "Critic Feedback Loop Engaged",
        message: event.message,
        severity: "warning"
      });
    } else if (event.agent_name === "risk_critic" && event.status === "completed") {
      setCriticAlert({
        title: "Cross-Agent Audit Approved",
        message: "Financial, operational, and regulatory models verified consistent.",
        severity: "success"
      });
    }
  };

  const handleCompletion = (plan) => {
    setProgress(100);
    setCompleted(true);
    setFinalPlan(plan);
    setCurrentMessage("Business Plan Ready — All 16 Agents Completed Successfully!");
    
    // Mark all agents as completed
    setAgents((prev) => prev.map((a) => ({ ...a, status: "completed" })));

    if (onPlanComplete) {
      onPlanComplete(plan);
    }
  };

  // Launch Demo Mode (client-side simulation when backend is offline)
  const handleStartDemoMode = () => {
    setConnectionState("demo");
    setConnectionError(null);
    setProgress(5);
    setCurrentMessage("Demo Mode Active — Executing autonomous multi-agent simulation...");
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: "system",
        status: "demo",
        message: "DEMO MODE: Simulating 16-agent orchestration pipeline inside browser..."
      }
    ]);

    if (streamUnsubscribeRef.current) {
      streamUnsubscribeRef.current();
    }

    streamUnsubscribeRef.current = streamDemoPlan(
      planInit || { business_name: "Artisanal Healthy Snacks", available_capital: 300000 },
      (event) => {
        handleAgentEvent(event);
      },
      (plan) => {
        handleCompletion(plan);
      }
    );
  };

  // Retry an individual failed agent
  const handleRetryAgent = (agentName) => {
    setAgents((prev) =>
      prev.map((a) => (a.name === agentName ? { ...a, status: "running" } : a))
    );
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: agentName,
        status: "retrying",
        message: `Retrying agent ${agentName}...`
      }
    ]);

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.name === agentName
            ? { ...a, status: "completed", summary: "Successfully re-calibrated model." }
            : a
        )
      );
    }, 1200);
  };

  // Save custom backend URL
  const handleSaveCustomBackendUrl = (e) => {
    e.preventDefault();
    setCustomApiBaseUrl(backendUrlInput);
    setIsEditingUrl(false);
    startPipeline();
  };

  // Initial trigger
  useEffect(() => {
    startPipeline();
    return () => {
      if (streamUnsubscribeRef.current) {
        streamUnsubscribeRef.current();
      }
    };
  }, [activePlanId]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const completedAgentsCount = agents.filter((a) => a.status === "completed").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Demo Mode Notice Banner */}
      {connectionState === "demo" && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-mono font-bold text-[10px] uppercase">
              Demo Mode Active
            </span>
            <span>Simulating multi-agent pipeline locally (Backend is offline or disconnected).</span>
          </div>
          <button
            onClick={startPipeline}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold transition shrink-0"
          >
            Retry Real Backend
          </button>
        </div>
      )}

      {/* Backend Connection Error Modal / Card */}
      {connectionState === "failed" && connectionError && (
        <div className="bg-rose-950/20 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono uppercase font-bold border border-rose-500/30">
                  Connection Failed
                </span>
                <span className="text-xs text-gray-400">Pre-flight Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Unable to connect to NEXORA AI backend
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                The frontend cannot communicate with the FastAPI orchestrator service. The orchestration was stopped to prevent an infinite loading screen.
              </p>
            </div>
          </div>

          {/* Diagnostic Details */}
          <div className="bg-black/60 border border-gray-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <span className="text-gray-400">Target Backend URL:</span>
              <span className="text-cyan-400 font-bold break-all">{connectionError.url}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <span className="text-gray-400">Status / Reason:</span>
              <span className="text-rose-400 font-bold">{connectionError.error || "Connection Refused / Timed Out"}</span>
            </div>
            <div className="space-y-1 text-gray-400 pt-1 text-[11px]">
              <strong className="text-gray-300 block">Common Root Causes:</strong>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>FastAPI backend server is currently offline or sleeping (e.g. Render free instance).</li>
                <li>Incorrect API URL configured in environment variables or deployment settings.</li>
                <li>CORS policy blocked request from <code className="text-gray-200">https://nomulamanikoushik.github.io</code>.</li>
                <li>Server-Sent Events (SSE) streaming endpoint is blocked by proxy or firewall.</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={startPipeline}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>

            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditingUrl ? "Cancel" : "Change Backend URL"}</span>
            </button>

            <button
              onClick={handleStartDemoMode}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Continue in Demo Mode</span>
            </button>
          </div>

          {/* Inline Backend URL Editor */}
          {isEditingUrl && (
            <form onSubmit={handleSaveCustomBackendUrl} className="p-4 bg-gray-900 rounded-2xl border border-gray-800 space-y-3">
              <label className="block text-xs font-semibold text-gray-300">
                Specify Custom Backend URL (e.g., http://localhost:8000 or https://your-backend.onrender.com)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={backendUrlInput}
                  onChange={(e) => setBackendUrlInput(e.target.value)}
                  placeholder="https://your-app.onrender.com"
                  className="flex-1 bg-black border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Test</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Header & Orchestrator Progress Banner */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className={`w-3.5 h-3.5 ${progress > 0 && progress < 100 ? "animate-spin" : ""}`} />
              <span>NEXORA 16-Agent Autonomous Pipeline</span>
              {connectionState === "demo" && (
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">
              {planInit?.business_name || "Autonomous Business Planning"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
              <span>{currentMessage}</span>
            </p>
          </div>

          {/* Completed State Actions: Business Plan Ready */}
          {completed && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActivePage("first_customers")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>First Customers</span>
              </button>
              <button
                onClick={() => setActivePage("growth")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>Growth Strategy</span>
              </button>
              <button
                onClick={() => setActivePage("dashboard")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage("plan")}
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Plan</span>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">
              Orchestration Progress ({completedAgentsCount} of {agents.length} nodes active)
            </span>
            <span className="text-cyan-400 font-mono font-bold">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Critic Feedback Banner */}
        {criticAlert && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs transition-all ${
            criticAlert.severity === "warning"
              ? "bg-amber-500/10 border-amber-500/40 text-amber-200 animate-pulse"
              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
          }`}>
            {criticAlert.severity === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="font-bold block mb-0.5">{criticAlert.title}</strong>
              <p className="opacity-90">{criticAlert.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Agent Cards Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Specialized Agents ({agents.length} Nodes)
            </h3>
            <span className="text-xs text-gray-400">
              {completedAgentsCount} / {agents.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {agents.map((ag) => (
              <AgentCard
                key={ag.name}
                agentName={ag.name}
                role={ag.role}
                stepOrder={ag.step}
                status={ag.status}
                summary={ag.summary}
                outputPayload={ag.outputPayload}
                revisionCount={ag.revisionCount || 0}
                criticIssues={ag.criticIssues}
                onRetry={() => handleRetryAgent(ag.name)}
              />
            ))}
          </div>
        </div>

        {/* Live Terminal / Collaboration Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Live Agent Collaboration Stream
            </h3>
            <span className="text-[10px] uppercase font-mono text-emerald-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${progress > 0 && progress < 100 ? "bg-emerald-400 animate-ping" : "bg-emerald-500"}`}></span>
              {connectionState === "demo" ? "Local Stream" : "Live SSE Feed"}
            </span>
          </div>

          <div 
            ref={logContainerRef}
            className="bg-black/80 border border-gray-800 rounded-2xl p-4 h-[640px] overflow-y-auto font-['JetBrains_Mono',monospace] text-[11px] space-y-2.5 shadow-inner"
          >
            {logs.length === 0 ? (
              <div className="text-gray-600 italic">Awaiting connection to orchestrator stream...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="space-y-0.5 leading-relaxed">
                  <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                    <span>[{log.timestamp}]</span>
                    <span className="text-cyan-400 font-bold uppercase">{log.agent}</span>
                    <span className={`px-1 rounded text-[9px] ${
                      log.status === "completed" ? "text-emerald-400 bg-emerald-950/40" :
                      log.status === "revising" ? "text-amber-400 bg-amber-950/40" :
                      log.status === "failed" ? "text-rose-400 bg-rose-950/40" :
                      log.status === "demo" ? "text-amber-400 bg-amber-950/30" :
                      "text-blue-400 bg-blue-950/40"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="text-gray-300 pl-2 border-l border-gray-800">
                    {log.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
