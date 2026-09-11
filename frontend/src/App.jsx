import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import AgentWorkspacePage from "./pages/AgentWorkspacePage";
import DashboardPage from "./pages/DashboardPage";
import BusinessPlanPage from "./pages/BusinessPlanPage";
import WhatIfPage from "./pages/WhatIfPage";
import SavedPlansPage from "./pages/SavedPlansPage";
import SettingsPage from "./pages/SettingsPage";
import FirstCustomersDashboard from "./pages/FirstCustomersDashboard";
import GrowthDashboard from "./pages/GrowthDashboard";
import LocationComparePage from "./pages/LocationComparePage";
import IntelligenceDetailView from "./components/IntelligenceDetailView";
import { createGuestSession, listPlans, getPlan } from "./api/client";

export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [activePlan, setActivePlan] = useState(null);
  const [planInit, setPlanInit] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize guest session and load any existing plans
  useEffect(() => {
    async function init() {
      try {
        await createGuestSession();
        const existingPlans = await listPlans();
        if (existingPlans && existingPlans.length > 0) {
          const latest = await getPlan(existingPlans[0].id);
          setActivePlan(latest);
        }
      } catch (e) {
        console.error("Initialization error:", e);
      }
    }
    init();
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setActivePage("onboarding");
  };

  const handlePlanCreated = (initData, formInput) => {
    setPlanInit({ ...formInput, ...initData, business_name: formInput.business_name });
    setActivePage("workspace");
  };

  const handlePlanComplete = (completedPlan) => {
    setActivePlan(completedPlan);
  };

  const showSidebar = !["landing", "onboarding"].includes(activePage);

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activePlan={activePlan} 
      />

      <div className="flex-1 flex relative">
        {/* Modern Sidebar Navigation */}
        {showSidebar && (
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            activePlan={activePlan}
          />
        )}

        {/* Main Content View Container */}
        <main className={`flex-1 transition-all duration-300 ${showSidebar ? (sidebarCollapsed ? "pl-16" : "pl-64") : ""}`}>
          {activePage === "landing" && (
            <LandingPage 
              setActivePage={setActivePage} 
              onSelectPreset={handleSelectPreset} 
            />
          )}

          {activePage === "onboarding" && (
            <OnboardingPage 
              onPlanCreated={handlePlanCreated} 
              initialPreset={selectedPreset} 
            />
          )}

          {activePage === "workspace" && (
            <AgentWorkspacePage 
              planInit={planInit} 
              onPlanComplete={handlePlanComplete} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === "dashboard" && (
            <DashboardPage 
              plan={activePlan} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === "profile" && (
            <IntelligenceDetailView viewType="profile" plan={activePlan} setActivePage={setActivePage} />
          )}

          {activePage === "market" && (
            <IntelligenceDetailView viewType="market" plan={activePlan} setActivePage={setActivePage} />
          )}

          {activePage === "customers" && (
            <IntelligenceDetailView viewType="customers" plan={activePlan} setActivePage={setActivePage} />
          )}

          {activePage === "competitors" && (
            <IntelligenceDetailView viewType="competitors" plan={activePlan} setActivePage={setActivePage} />
          )}

          {(activePage === "location" || activePage === "locations") && (
            <LocationComparePage />
          )}

          {activePage === "model" && (
            <IntelligenceDetailView viewType="profile" plan={activePlan} setActivePage={setActivePage} />
          )}

          {activePage === "capital" && (
            <IntelligenceDetailView viewType="capital" plan={activePlan} setActivePage={setActivePage} />
          )}

          {activePage === "financials" && (
            <IntelligenceDetailView viewType="financials" plan={activePlan} setActivePage={setActivePage} />
          )}

          {(activePage === "early_revenue" || activePage === "first_customers") && (
            <FirstCustomersDashboard />
          )}

          {(activePage === "marketing" || activePage === "growth") && (
            <GrowthDashboard />
          )}

          {activePage === "risks" && (
            <IntelligenceDetailView viewType="risks" plan={activePlan} setActivePage={setActivePage} />
          )}

          {activePage === "whatif" && (
            <WhatIfPage 
              plan={activePlan} 
              onPlanUpdated={(updated) => setActivePlan(updated)} 
            />
          )}

          {activePage === "plan" && (
            <BusinessPlanPage 
              plan={activePlan} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === "saved" && (
            <SavedPlansPage 
              onSelectPlan={(p) => setActivePlan(p)} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === "settings" && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0B0F19] py-6 text-center text-xs text-gray-400 print:hidden z-30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white font-['Plus_Jakarta_Sans']">NEXORA</span>
            <span>• Multi-Agent AI Business Launch & Growth Platform</span>
          </div>
          <div className="text-gray-400">
            From Capital to Business. • 16 Autonomous Agents with Critic Feedback Loops
          </div>
        </div>
      </footer>
    </div>
  );
}
