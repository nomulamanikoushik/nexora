import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Coins, 
  Building, 
  MapPin, 
  Target, 
  Shield, 
  Clock, 
  Home, 
  Globe, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Lightbulb, 
  Layers,
  AlertTriangle,
  Server,
  RefreshCw,
  Settings as SettingsIcon,
  Check,
  Cpu
} from "lucide-react";
import { PRESETS } from "../utils/presets";
import { createPlan, createDemoPlan, understandIdea, checkBackendHealth } from "../api/client";
import { getApiBaseUrl, setCustomApiBaseUrl, LOCAL_DEV_DEFAULT_BACKEND } from "../config/api";

export default function OnboardingPage({ onPlanCreated, initialPreset }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [freeformIdea, setFreeformIdea] = useState("I have ₹3 lakh and want to start a homemade healthy snacks business in Hyderabad.");
  const [isAnalyzingIdea, setIsAnalyzingIdea] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const [formData, setFormData] = useState(initialPreset || {
    business_name: "NutriBites Artisanal Kitchen",
    sector: "food-beverage",
    business_type: "Homemade Healthy Snacks & Millet Treats",
    business_start_mode: "Home-Based",
    location: "Kondapur, Hyderabad",
    locality: "Kondapur",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    capital: 300000,
    currency: "INR",
    primary_usp: "100% natural, preservative-free artisanal millet snacks freshly prepared",
    objective: "Launch a profitable home-based healthy snack brand with zero store rent, acquiring first 10 customers in 7 days and 50+ recurring buyers in 30 days.",
    risk_preference: "Moderate",
    time_horizon: "3 years",
    experience_level: "Beginner",
    target_customer: "Health-conscious tech professionals in Kondapur/Hitech City, fitness enthusiasts, and apartment communities seeking guilt-free snacks",
    constraints: "Zero commercial lease deposit; channel capital strictly into high-grade packaging, fresh ingredients, and neighborhood sampling."
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendProbe, setBackendProbe] = useState(null);
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [backendInput, setBackendInput] = useState(getApiBaseUrl());
  const [urlSavedMsg, setUrlSavedMsg] = useState("");

  const checkBackend = async () => {
    try {
      const res = await checkBackendHealth();
      setBackendProbe(res);
    } catch {
      setBackendProbe({ ok: false, error: "Unreachable" });
    }
  };

  useEffect(() => {
    if (currentStep === 8) {
      checkBackend();
    }
  }, [currentStep]);

  const handlePresetSelect = (preset) => {
    setFormData({
      ...formData,
      business_name: preset.business_name,
      sector: preset.sector,
      business_type: preset.business_type,
      business_start_mode: preset.business_start_mode || "Home-Based",
      location: preset.location,
      locality: preset.locality || preset.location.split(",")[0],
      city: preset.city || "Hyderabad",
      state: preset.state || "Telangana",
      capital: preset.capital,
      currency: preset.currency,
      primary_usp: preset.primary_usp || "Artisanal high-quality direct preparation",
      objective: preset.objective,
      risk_preference: preset.risk_preference,
      time_horizon: preset.time_horizon,
      experience_level: preset.experience_level,
      target_customer: preset.target_customer,
      constraints: preset.constraints
    });
    setFreeformIdea(`Starting ${preset.name} with ${preset.capitalDisplay} in ${preset.location}`);
  };

  const handleAnalyzeIdea = async () => {
    if (!freeformIdea.trim()) return;
    setIsAnalyzingIdea(true);
    setAnalyzedSuccess(false);
    try {
      const res = await understandIdea({
        idea_text: freeformIdea,
        capital: formData.capital,
        currency: formData.currency,
        location: formData.location,
        start_mode: formData.business_start_mode
      });
      if (res && res.parsed_profile) {
        const p = res.parsed_profile;
        setFormData({
          ...formData,
          business_name: p.business_name || formData.business_name,
          sector: p.sector || formData.sector,
          business_type: p.business_type || formData.business_type,
          business_start_mode: p.business_start_mode || formData.business_start_mode,
          location: p.location || formData.location,
          locality: p.locality || formData.locality,
          city: p.city || formData.city,
          state: p.state || formData.state,
          country: p.country || formData.country,
          capital: p.capital || formData.capital,
          currency: p.currency || formData.currency,
          primary_usp: p.primary_usp || formData.primary_usp,
          target_customer: p.target_audience || formData.target_customer,
          objective: p.objective || formData.objective
        });
        setAnalyzedSuccess(true);
      }
    } catch (err) {
      console.error("AI understanding failed:", err);
    } finally {
      setIsAnalyzingIdea(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const planInit = await createPlan(formData);
      onPlanCreated(planInit, formData);
    } catch (err) {
      console.warn("[NEXORA] createPlan fallback to demo plan:", err.message);
      const demoPlan = createDemoPlan(formData);
      onPlanCreated(demoPlan, formData);
    }
  };

  const handleLaunchDemo = () => {
    setError(null);
    setLoading(true);
    const demoPlan = createDemoPlan(formData);
    onPlanCreated(demoPlan, formData);
  };

  const handleSaveBackendUrl = (e) => {
    e?.preventDefault?.();
    if (backendInput.trim()) {
      setCustomApiBaseUrl(backendInput.trim());
      setUrlSavedMsg(`Active backend updated to: ${backendInput.trim()}`);
      setTimeout(() => setUrlSavedMsg(""), 3000);
      checkBackend();
      setError(null);
    }
  };

  const startModes = [
    { id: "Home-Based", title: "Home-Based", icon: Home, desc: "0% commercial lease, zero broker deposits; capital preserved for ingredients, packaging, and sampling.", badge: "Highest Capital Efficiency" },
    { id: "Physical Store", title: "Physical Store", icon: Building, desc: "Prime storefront or commercial kitchen with foot traffic, interior fit-out, and signage.", badge: "High Visibility" },
    { id: "Online", title: "Online / D2C", icon: Globe, desc: "Digital storefront, website/app orders, performance marketing, and third-party delivery dispatch.", badge: "Wide Reach" },
    { id: "Mobile Business", title: "Mobile / Pop-Up", icon: Truck, desc: "Food cart, pop-up kiosk, or mobile van with low fixed rent and mobility flexibility.", badge: "Flexible Footprint" },
    { id: "Hybrid", title: "Hybrid Model", icon: Layers, desc: "Small retail or cloud kitchen counter combined with strong direct online and delivery channels.", badge: "Balanced" }
  ];

  const steps = [
    { num: 1, label: "Idea & Vision" },
    { num: 2, label: "Start Mode" },
    { num: 3, label: "Capital" },
    { num: 4, label: "Location" },
    { num: 5, label: "Audience & USP" },
    { num: 6, label: "Operations" },
    { num: 7, label: "Risk Profile" },
    { num: 8, label: "Review & Launch" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/20 glow-cyan-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>NEXORA 16-Agent AI Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Configure Your Business Assumptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Our 16 specialized agents will calibrate market research, unit economics, early customer acquisition, and risk models around your parameters.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2 scrollbar-none">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 scale-[1.02]"
                    : isCompleted
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25"
                    : "glass-card text-slate-400 hover:text-slate-200 border border-white/[0.06]"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                  isActive ? "bg-slate-950/20 text-slate-950" : isCompleted ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-slate-400"
                }`}>
                  {isCompleted ? "✓" : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Demo Presets Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3 border border-white/[0.08] shadow-md">
        <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
          Featured Presets (1-Click Load)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = formData.business_name === p.business_name;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className={`p-3 rounded-xl text-left border transition-all duration-200 text-xs ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50 shadow-md shadow-cyan-500/10"
                    : "glass-card border-white/[0.06] text-slate-300 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold truncate text-white">{p.name.split("(")[0]}</span>
                  <span className="px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 text-[10px] font-mono rounded border border-cyan-800/80 shrink-0">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">{p.capitalDisplay} • {p.location}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08] shadow-2xl">
        
        {/* STEP 1: Idea & Vision */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 1 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Describe Your Business Concept in Plain English</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Type what you want to build and your available capital. Our AI will automatically parse the sector, start mode, unit economics, and required licenses.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                value={freeformIdea}
                onChange={(e) => setFreeformIdea(e.target.value)}
                rows={3}
                placeholder="e.g. I have ₹3 lakh and want to start a homemade healthy snacks business in Hyderabad."
                className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl p-4 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all placeholder:text-slate-600"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleAnalyzeIdea}
                  disabled={isAnalyzingIdea || !freeformIdea.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                  <span>{isAnalyzingIdea ? "Analyzing with AI..." : "AI Understand & Auto-Fill"}</span>
                </button>
                {analyzedSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Idea parsed and calibrated successfully!</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industry Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                >
                  <option value="food-beverage">Food & Beverage / Healthy Snacks</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="software-saas">Software & SaaS</option>
                  <option value="healthcare">Healthcare & Wellness</option>
                  <option value="edtech">Education & EdTech</option>
                  <option value="services">Managed Services & Agency</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Business Start Mode */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 2 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Select Your Business Start Mode</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                The start mode directly alters your capital allocation formulas, leasing deposits, and early launch speed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {startModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = formData.business_start_mode === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setFormData({ ...formData, business_start_mode: mode.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500 text-white ring-1 ring-cyan-500/60 shadow-lg shadow-cyan-500/10"
                        : "glass-card border-white/[0.06] hover:border-white/20 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                          <span className="font-bold text-sm text-white">{mode.title}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-white/[0.06] text-slate-300 rounded-full font-mono">
                          {mode.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{mode.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Capital & Currency */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 3 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Starting Capital & Runway</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Specify your liquid starting funds. Our Capital Planning Agent will bucket this into inventory, packaging, tools, and safety reserves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Available Capital</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50000"
                    step="10000"
                    value={formData.capital}
                    onChange={(e) => setFormData({ ...formData, capital: Number(e.target.value) })}
                    className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none font-mono"
                  />
                  <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-mono">
                    {formData.currency} {Number(formData.capital).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/[0.08] space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Quick Select Capital:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[150000, 300000, 500000, 1000000, 1500000, 2500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFormData({ ...formData, capital: amt })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                      formData.capital === amt
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                        : "glass-card text-slate-300 border-white/[0.08] hover:text-white hover:border-white/20"
                    }`}
                  >
                    ₹{(amt / 100000).toFixed(amt % 100000 === 0 ? 0 : 1)} Lakh
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 4 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Location & Footprint</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Target city and locality for consumer demographics, footfall, and local municipal registrations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target City</label>
                <input
                  type="text"
                  value={formData.city || "Hyderabad"}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, location: `${formData.locality || "Center"}, ${e.target.value}` })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Locality / Neighborhood</label>
                <input
                  type="text"
                  value={formData.locality || "Kondapur"}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value, location: `${e.target.value}, ${formData.city || "Hyderabad"}` })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/[0.08] text-xs text-slate-300 space-y-1.5">
              <span className="text-cyan-400 font-mono font-bold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Location Strategy Note:
              </span>
              <p className="leading-relaxed text-slate-300">
                In {formData.city || "Hyderabad"}, operating a {formData.business_start_mode} business in {formData.locality || "Kondapur"} grants direct access to high-density gated apartment communities and tech corridors with rapid delivery turnaround times.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Audience & USP */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 5 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Unique Value Proposition & Target Audience</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Define the core secret sauce that will persuade your first 10 paying customers to choose your brand.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Value Proposition (USP)</label>
                <input
                  type="text"
                  value={formData.primary_usp || ""}
                  onChange={(e) => setFormData({ ...formData, primary_usp: e.target.value })}
                  placeholder="e.g. 100% natural, preservative-free artisanal millet snacks freshly prepared"
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Customer Description</label>
                <textarea
                  value={formData.target_customer || ""}
                  onChange={(e) => setFormData({ ...formData, target_customer: e.target.value })}
                  rows={3}
                  placeholder="e.g. Health-conscious tech workers, young parents seeking clean snacks for kids"
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl p-3.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Operations & Timeline */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 6 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Operations & Launch Horizon</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Target launch timeline and operational objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Planning Horizon</label>
                <select
                  value={formData.time_horizon}
                  onChange={(e) => setFormData({ ...formData, time_horizon: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                >
                  <option value="1 year">1 Year (Rapid Break-even)</option>
                  <option value="3 years">3 Years (Growth & Scale)</option>
                  <option value="5 years">5 Years (Long-term Stability)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Core Startup Objective</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Risk & Experience */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 7 of 8</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Risk Preference & Founder Experience</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Calibrate the Risk & Critic Agent's audit thresholds and capital buffer requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Risk Preference</label>
                <select
                  value={formData.risk_preference}
                  onChange={(e) => setFormData({ ...formData, risk_preference: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                >
                  <option value="Conservative">Conservative (High Cash Safety Buffer)</option>
                  <option value="Moderate">Moderate (Balanced Growth & Safety)</option>
                  <option value="Aggressive">Aggressive (High Capex / Fast Expansion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Founder Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full bg-[#070A12]/90 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none"
                >
                  <option value="Beginner">First-time Founder (Requires Detailed SOPs)</option>
                  <option value="Intermediate">Prior Business Experience</option>
                  <option value="Experienced">Serial Entrepreneur</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Review & Launch */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 8 of 8</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Review & Launch 16 AI Agents</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Verify your calibrated parameters before deploying the parallel multi-agent orchestrator.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {backendProbe?.ok ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live Backend Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Cloud Backend Offline
                  </span>
                )}
              </div>
            </div>

            {/* Holographic Review Summary Card */}
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <span className="text-slate-400 block text-[11px]">Venture Name:</span>
                  <span className="font-bold text-white text-sm">{formData.business_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Start Mode:</span>
                  <span className="font-bold text-cyan-400 text-sm">{formData.business_start_mode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Capital:</span>
                  <span className="font-bold text-emerald-400 text-sm font-mono">
                    {formData.currency} {Number(formData.capital).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Location:</span>
                  <span className="font-bold text-white text-sm">{formData.location}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Value Proposition:</span>
                <p className="font-medium text-slate-200">{formData.primary_usp}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Target Audience:</span>
                <p className="text-slate-300">{formData.target_customer}</p>
              </div>
            </div>

            {/* Offline/Notice Pre-Launch Banner */}
            {backendProbe && !backendProbe.ok && !error && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Live Cloud Backend Offline — Demo Mode Ready
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    No live backend server reachable at <code className="text-cyan-400 font-mono">{getApiBaseUrl()}</code>. You can run in <strong>Demo Mode</strong> to simulate all 16 AI agents and generate the complete business plan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Demo Mode</span>
                </button>
              </div>
            )}

            {/* Resilient Error & Recovery Box */}
            {error && (
              <div className="p-5 bg-gradient-to-b from-[#180d12] to-[#120a0e] border border-rose-500/40 rounded-2xl space-y-4 shadow-2xl animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">
                        Backend Service Unreachable ({error.message || "HTTP 404"})
                      </h4>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        Backend Offline
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The backend at <code className="text-cyan-300 px-1.5 py-0.5 bg-black/50 rounded font-mono">{error.url || getApiBaseUrl()}</code> returned <strong>{error.message || "HTTP 404"}</strong> (not deployed or unreachable).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/[0.06] text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-200 block">Recommended Recovery Options:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
                    <li><strong>Demo Mode:</strong> Run the complete 16-agent simulation locally inside the browser using industry benchmark data.</li>
                    <li><strong>Custom / Local Backend:</strong> Point NEXORA to your running local FastAPI backend (<code className="text-cyan-400 font-mono">http://localhost:8000</code>) or live cloud tunnel.</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLaunchDemo}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Launch in Demo Mode (16 Agents)</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowUrlEditor(!showUrlEditor)}
                    className="px-3.5 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/[0.1] flex items-center gap-1.5 transition"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showUrlEditor ? "Hide URL Settings" : "Change Backend URL"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/[0.1] flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Retry Connection</span>
                  </button>
                </div>

                {showUrlEditor && (
                  <div className="pt-3 border-t border-white/[0.08] space-y-2">
                    <label className="text-[11px] text-slate-300 font-semibold block">
                      Configure Live Backend Base URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={backendInput}
                        onChange={(e) => setBackendInput(e.target.value)}
                        placeholder="http://localhost:8000 or https://your-backend.onrender.com"
                        className="flex-1 px-3 py-2 bg-black/60 border border-white/[0.1] rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={handleSaveBackendUrl}
                        className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition"
                      >
                        Apply URL
                      </button>
                    </div>
                    {urlSavedMsg && (
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {urlSavedMsg}
                      </p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setBackendInput(LOCAL_DEV_DEFAULT_BACKEND);
                          setCustomApiBaseUrl(LOCAL_DEV_DEFAULT_BACKEND);
                          setUrlSavedMsg(`Set to ${LOCAL_DEV_DEFAULT_BACKEND}`);
                          checkBackend();
                          setTimeout(() => setUrlSavedMsg(""), 3000);
                        }}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        Use Localhost (http://localhost:8000)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-5 border-t border-white/[0.08]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 glass-card hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl border border-white/[0.1] flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLaunchDemo}
                className="px-4 py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md shadow-amber-500/5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Demo Mode</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-cyan-500/30 flex items-center gap-2.5 transition disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>{loading ? "Deploying 16 Agents..." : "Deploy 16 AI Agents"}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
