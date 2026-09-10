import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
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
import { createGuestSession, listPlans, getPlan } from "./api/client";

export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [activePlan, setActivePlan] = useState(null);
  const [planInit, setPlanInit] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Initialize guest session and check for existing plans
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
    setPlanInit({ ...initData, business_name: formInput.business_name });
    setActivePage("workspace");
  };

  const handlePlanComplete = (completedPlan) => {
    setActivePlan(completedPlan);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activePlan={activePlan} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
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

        {activePage === "plan" && (
          <BusinessPlanPage 
            plan={activePlan} 
            setActivePage={setActivePage} 
          />
        )}

        {activePage === "first_customers" && (
          <FirstCustomersDashboard />
        )}

        {activePage === "growth" && (
          <GrowthDashboard />
        )}

        {activePage === "locations" && (
          <LocationComparePage />
        )}

        {activePage === "whatif" && (
          <WhatIfPage 
            plan={activePlan} 
            onPlanUpdated={(updated) => setActivePlan(updated)} 
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

      {/* Global Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0B0F19] py-8 text-center text-xs text-gray-400 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white font-['Plus_Jakarta_Sans']">NEXORA</span>
            <span>? Intelligent multiagent for business planning startup</span>
          </div>
          <div className="text-gray-400">
            ?From Capital to Business.? ? Autonomous Agentic Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
