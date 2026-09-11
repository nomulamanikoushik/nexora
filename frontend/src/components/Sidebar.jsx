import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  Users,
  Target,
  MapPin,
  Layers,
  PieChart,
  BarChart3,
  Sparkles,
  Megaphone,
  ShieldAlert,
  Cpu,
  Sliders,
  FileText,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Core" },
  { id: "profile", label: "Business Profile", icon: Briefcase, category: "Intelligence" },
  { id: "market", label: "Market Intelligence", icon: TrendingUp, category: "Intelligence" },
  { id: "customers", label: "Customers", icon: Users, category: "Intelligence" },
  { id: "competitors", label: "Competitors", icon: Target, category: "Intelligence" },
  { id: "location", label: "Location", icon: MapPin, category: "Intelligence" },
  { id: "model", label: "Business Model", icon: Layers, category: "Strategy" },
  { id: "capital", label: "Capital Plan", icon: PieChart, category: "Financials" },
  { id: "financials", label: "Financials", icon: BarChart3, category: "Financials" },
  { id: "early_revenue", label: "Early Revenue", icon: Sparkles, category: "Execution", badge: "Engine" },
  { id: "marketing", label: "Marketing", icon: Megaphone, category: "Execution" },
  { id: "growth", label: "Growth Engine", icon: TrendingUp, category: "Execution" },
  { id: "risks", label: "Risks & Critic", icon: ShieldAlert, category: "Validation" },
  { id: "workspace", label: "Agent Workspace", icon: Cpu, category: "Multi-Agent" },
  { id: "whatif", label: "What-If Simulator", icon: Sliders, category: "Simulation" },
  { id: "plan", label: "Business Plan", icon: FileText, category: "Report" },
  { id: "saved", label: "Saved Plans", icon: FolderOpen, category: "System" },
  { id: "settings", label: "Settings", icon: Settings, category: "System" }
];

export default function Sidebar({ activePage, setActivePage, collapsed, setCollapsed, activePlan }) {
  const categories = ["Core", "Intelligence", "Financials", "Execution", "Multi-Agent", "Simulation", "Report", "System"];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 bg-[#0B0F19] border-r border-gray-800 transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } print:hidden`}
    >
      {/* Collapse Toggle Button */}
      <div className="p-3 flex items-center justify-between border-b border-gray-800/80">
        {!collapsed && (
          <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Platform Navigation
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ml-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Plan context pill when expanded */}
      {!collapsed && activePlan && (
        <div className="px-3 py-2 m-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Active Venture</div>
          <div className="text-xs font-semibold text-white truncate mt-0.5">
            {activePlan.profile?.business_name || activePlan.title}
          </div>
          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
            <span>{activePlan.profile?.location || "Hyderabad"}</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Score {activePlan.feasibility_score || 0}/100</span>
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-gray-300"}`} />
              
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 border border-gray-700 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
          <span>16 Specialized Agents</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Operational"></span>
        </div>
      )}
    </aside>
  );
}
