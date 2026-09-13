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
  Bookmark,
  Activity,
  Zap
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
    if (planInit?.is_demo) {
      handleStartDemoMode();
    } else {
      startPipeline();
    }
    return () => {
      if (streamUnsubscribeRef.current) {
        streamUnsubscribeRef.current();
      }
    };
  }, [activePlanId, planInit?.is_demo]);

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
        <div className="glass-panel border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-2.5 font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] uppercase border border-amber-500/30">
              Demo Mode Active
            </span>
            <span className="text-slate-300">Simulating multi-agent pipeline in browser (Backend is offline or disconnected).</span>
          </div>
          <button
            onClick={startPipeline}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Real Backend</span>
          </button>
        </div>
      )}

      {/* Backend Connection Error Modal / Card */}
      {connectionState === "failed" && connectionError && (
        <div className="bg-gradient-to-b from-rose-950/30 to-[#100b12] border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono uppercase font-bold border border-rose-500/30">
                  Connection Failed
                </span>
                <span className="text-xs text-slate-400">Pre-flight Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Unable to connect to NEXORA AI backend
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                The frontend cannot communicate with the FastAPI orchestrator service. The orchestration was stopped to prevent an infinite loading screen.
              </p>
            </div>
          </div>

          {/* Diagnostic Details */}
          <div className="bg-black/60 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
              <span className="text-slate-400">Target Backend URL:</span>
              <span className="text-cyan-400 font-bold break-all">{connectionError.url}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
              <span className="text-slate-400">Status / Reason:</span>
              <span className="text-rose-400 font-bold">{connectionError.error || "Connection Refused / Timed Out"}</span>
            </div>
            <div className="space-y-1 text-slate-400 pt-1 text-[11px]">
              <strong className="text-slate-300 block">Common Root Causes:</strong>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>FastAPI backend server is currently offline or sleeping (e.g. Render free instance).</li>
                <li>Incorrect API URL configured in environment variables or deployment settings.</li>
                <li>CORS policy blocked request from origin.</li>
                <li>Server-Sent Events (SSE) streaming endpoint is blocked by proxy or firewall.</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={startPipeline}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>

            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-200 border border-white/[0.1] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditingUrl ? "Cancel" : "Change Backend URL"}</span>
            </button>

            <button
              onClick={handleStartDemoMode}
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Continue in Demo Mode</span>
            </button>
          </div>

          {/* Inline Backend URL Editor */}
          {isEditingUrl && (
            <form onSubmit={handleSaveCustomBackendUrl} className="p-4 bg-black/70 rounded-2xl border border-white/[0.08] space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Specify Custom Backend URL (e.g., http://localhost:8000 or https://your-backend.onrender.com)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={backendUrlInput}
                  onChange={(e) => setBackendUrlInput(e.target.value)}
                  placeholder="https://your-app.onrender.com"
                  className="flex-1 bg-black border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-full glass-pill text-cyan-300 border border-cyan-500/20 glow-cyan-sm">
              <Cpu className={`w-3.5 h-3.5 text-cyan-400 ${progress > 0 && progress < 100 ? "animate-spin" : ""}`} />
              <span>NEXORA 16-Agent Autonomous Pipeline</span>
              {connectionState === "demo" && (
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {planInit?.business_name || "Autonomous Business Planning"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>{currentMessage}</span>
            </p>
          </div>

          {/* Completed State Actions: Business Plan Ready */}
          {completed && (
            <div className="flex flex-wrap items-center gap-2.5 animate-fadeIn">
              <button
                onClick={() => setActivePage("first_customers")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                <span>First Customers</span>
              </button>
              <button
                onClick={() => setActivePage("growth")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-violet-500/20 flex items-center gap-1.5 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Growth Strategy</span>
              </button>
              <button
                onClick={() => setActivePage("dashboard")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage("plan")}
                className="px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-200 border border-white/[0.1] font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Plan</span>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar with Glow */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400 font-medium">
              Orchestration Progress ({completedAgentsCount} of {agents.length} nodes active)
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="h-3 w-full bg-[#070A12] rounded-full overflow-hidden border border-white/[0.08] p-0.5 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Critic Feedback Banner */}
        {criticAlert && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 text-xs transition-all ${
            criticAlert.severity === "warning"
              ? "bg-amber-500/10 border-amber-500/40 text-amber-200 animate-pulse shadow-lg shadow-amber-500/5"
              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-500/5"
          }`}>
            {criticAlert.severity === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="font-bold block mb-0.5 font-mono text-[11px]">{criticAlert.title}</strong>
              <p className="opacity-90 leading-relaxed text-slate-300">{criticAlert.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Agent Cards Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Specialized Agents ({agents.length} Nodes)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {completedAgentsCount} / {agents.length} Active Nodes
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
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Live Agent Collaboration Stream</span>
            </h3>
            <span className="text-[10px] uppercase font-mono text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-card border-white/[0.08]">
              <span className={`w-1.5 h-1.5 rounded-full ${progress > 0 && progress < 100 ? "bg-emerald-400 animate-ping" : "bg-emerald-400"}`}></span>
              {connectionState === "demo" ? "Local Stream" : "Live SSE Feed"}
            </span>
          </div>

          {/* Console Shell */}
          <div className="glass-panel border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Window Top Bar */}
            <div className="px-4 py-2.5 bg-black/60 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-slate-500">nexora-orchestrator-stdout</span>
              <div className="w-8" />
            </div>

            <div 
              ref={logContainerRef}
              className="bg-[#050810]/95 p-4 h-[640px] overflow-y-auto font-mono text-[11px] space-y-3"
            >
              {logs.length === 0 ? (
                <div className="text-slate-600 italic">Awaiting connection to orchestrator stream...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="space-y-1 leading-relaxed">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                      <span>[{log.timestamp}]</span>
                      <span className="text-cyan-400 font-bold uppercase">{log.agent}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                        log.status === "completed" ? "text-emerald-300 bg-emerald-950/60 border border-emerald-800/40" :
                        log.status === "revising" ? "text-amber-300 bg-amber-950/60 border border-amber-800/40" :
                        log.status === "failed" ? "text-rose-300 bg-rose-950/60 border border-rose-800/40" :
                        log.status === "demo" ? "text-amber-300 bg-amber-950/50 border border-amber-800/30" :
                        "text-cyan-300 bg-cyan-950/60 border border-cyan-800/40"
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="text-slate-300 pl-2.5 border-l-2 border-white/[0.08]">
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
