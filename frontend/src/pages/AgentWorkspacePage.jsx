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
  FileText
} from "lucide-react";
import AgentCard from "../components/AgentCard";
import { streamPlan, getPlan, executePlanSync } from "../api/client";

export default function AgentWorkspacePage({ planInit, onPlanComplete, setActivePage }) {
  const [progress, setProgress] = useState(5);
  const [currentMessage, setCurrentMessage] = useState("Initializing Orchestrator state graph...");
  const [logs, setLogs] = useState([]);
  const [criticAlert, setCriticAlert] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [finalPlan, setFinalPlan] = useState(null);

  // 16 Agents tracking state
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

  useEffect(() => {
    if (!planInit?.plan_id) return;

    // Start SSE stream
    const unsubscribe = streamPlan(
      planInit.plan_id,
      (event) => {
        // Handle incoming SSE event
        setProgress(event.progress);
        setCurrentMessage(event.message);

        // Append log
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            agent: event.agent_name,
            status: event.status,
            message: event.message
          }
        ]);

        // Update individual agent status
        setAgents((prevAgents) =>
          prevAgents.map((ag) => {
            if (ag.name === event.agent_name) {
              const revisionCount = event.status === "revising" ? (ag.revisionCount || 0) + 1 : ag.revisionCount;
              return {
                ...ag,
                status: event.status,
                summary: event.data?.summary || ag.summary,
                outputPayload: event.data || ag.outputPayload,
                revisionCount: revisionCount,
                criticIssues: event.data?.data?.critic_issues || ag.criticIssues
              };
            }
            return ag;
          })
        );

        // Check for Critic Revision Loop Event
        if (event.agent_name === "risk_critic" && event.status === "revising") {
          setCriticAlert({
            title: "Critic Feedback Loop Engaged",
            message: event.message,
            severity: "warning"
          });
        } else if (event.agent_name === "risk_critic" && event.status === "completed" && event.data?.data?.verdict === "VALIDATION_APPROVED") {
          setCriticAlert({
            title: "Validation Approved (Loop Resolved)",
            message: "Capital Planning and Financial models successfully revised. Working capital fortified.",
            severity: "success"
          });
        }
      },
      async (err) => {
        // Fallback to sync execution if SSE fails
        console.warn("SSE connection error, falling back to sync execution:", err);
        try {
          const plan = await executePlanSync(planInit.plan_id);
          setProgress(100);
          setCompleted(true);
          setFinalPlan(plan);
          if (onPlanComplete) onPlanComplete(plan);
        } catch (syncErr) {
          console.error("Sync fallback failed:", syncErr);
        }
      },
      async () => {
        // On stream completion
        setProgress(100);
        setCompleted(true);
        try {
          const plan = await getPlan(planInit.plan_id);
          setFinalPlan(plan);
          if (onPlanComplete) onPlanComplete(plan);
        } catch (e) {
          console.error("Error fetching completed plan:", e);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [planInit?.plan_id]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & Progress Bar */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              Live Multi-Agent Orchestrator
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">
              {planInit?.business_name || "Autonomous Planning Pipeline"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              {currentMessage}
            </p>
          </div>

          {completed && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActivePage("first_customers")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get First Customers</span>
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
                <span>Full Business Plan</span>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Orchestration Progress</span>
            <span className="text-cyan-400 font-mono font-bold">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
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
              Specialized Agents (12 Nodes)
            </h3>
            <span className="text-xs text-gray-400">
              {agents.filter(a => a.status === "completed").length} / 12 Completed
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live SSE Feed
            </span>
          </div>

          <div 
            ref={logContainerRef}
            className="bg-black/80 border border-gray-800 rounded-2xl p-4 h-[600px] overflow-y-auto font-['JetBrains_Mono',monospace] text-[11px] space-y-2.5 shadow-inner"
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
