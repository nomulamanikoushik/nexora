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
  Check
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
      console.warn("[NEXORA] createPlan API error:", err.message);
      setError({
        message: err.message || "HTTP 404",
        url: getApiBaseUrl()
      });
      setLoading(false);
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
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          NEXORA 16-Agent AI Architecture
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Configure Your Business Assumptions
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          Our 16 specialized agents will calibrate market research, unit economics, early customer acquisition, and risk models around your parameters.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                currentStep === s.num
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                  : currentStep > s.num
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200"
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-black/20">
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Demo Presets Banner */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 space-y-2">
        <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Featured Presets (1-Click Load)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                formData.business_name === p.business_name
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 ring-1 ring-cyan-500"
                  : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold truncate text-white">{p.name.split("(")[0]}</span>
                <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 text-[10px] rounded border border-cyan-800 shrink-0">
                  {p.badge}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{p.capitalDisplay} • {p.location}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* STEP 1: Idea & Vision */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 1 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Describe Your Business Concept in Plain English</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Type what you want to build and your available capital. Our AI will automatically parse the sector, start mode, unit economics, and required licenses.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                value={freeformIdea}
                onChange={(e) => setFreeformIdea(e.target.value)}
                rows={3}
                placeholder="e.g. I have ₹3 lakh and want to start a homemade healthy snacks business in Hyderabad."
                className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl p-3.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAnalyzeIdea}
                  disabled={isAnalyzingIdea || !freeformIdea.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzingIdea ? "Analyzing with AI..." : "AI Understand & Auto-Fill"}</span>
                </button>
                {analyzedSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Idea parsed and calibrated successfully!</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Industry Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 2 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Select Your Business Start Mode</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                The start mode directly alters your capital allocation formulas, leasing deposits, and early launch speed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {startModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = formData.business_start_mode === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setFormData({ ...formData, business_start_mode: mode.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500 text-white ring-1 ring-cyan-500"
                        : "bg-[#0a0f1d] border-gray-800 hover:border-gray-700 text-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-cyan-400" : "text-gray-400"}`} />
                          <span className="font-bold text-sm text-white">{mode.title}</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full">
                          {mode.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{mode.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Capital & Currency */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 3 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Starting Capital & Runway</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Specify your liquid starting funds. Our Capital Planning Agent will bucket this into inventory, packaging, tools, and safety reserves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Total Available Capital</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50000"
                    step="10000"
                    value={formData.capital}
                    onChange={(e) => setFormData({ ...formData, capital: Number(e.target.value) })}
                    className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                    {formData.currency} {Number(formData.capital).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0f1d] p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Quick Select Capital:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[150000, 300000, 500000, 1000000, 1500000, 2500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFormData({ ...formData, capital: amt })}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                      formData.capital === amt
                        ? "bg-cyan-500 text-black border-cyan-400 font-bold"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
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
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 4 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Location & Footprint</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Target city and locality for consumer demographics, footfall, and local municipal registrations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target City</label>
                <input
                  type="text"
                  value={formData.city || "Hyderabad"}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, location: `${formData.locality || "Center"}, ${e.target.value}` })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Locality / Neighborhood</label>
                <input
                  type="text"
                  value={formData.locality || "Kondapur"}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value, location: `${e.target.value}, ${formData.city || "Hyderabad"}` })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-[#0a0f1d] p-4 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1">
              <span className="text-cyan-400 font-semibold block">Location Strategy Note:</span>
              <p>
                In {formData.city || "Hyderabad"}, operating a {formData.business_start_mode} business in {formData.locality || "Kondapur"} grants direct access to high-density gated apartment communities and tech corridors with low delivery turnaround times.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Audience & USP */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 5 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Unique Value Proposition & Target Audience</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Define the core secret sauce that will persuade your first 10 paying customers to choose your brand.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Primary Value Proposition (USP)</label>
                <input
                  type="text"
                  value={formData.primary_usp || ""}
                  onChange={(e) => setFormData({ ...formData, primary_usp: e.target.value })}
                  placeholder="e.g. 100% natural, preservative-free artisanal millet snacks freshly prepared"
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target Customer Description</label>
                <textarea
                  value={formData.target_customer || ""}
                  onChange={(e) => setFormData({ ...formData, target_customer: e.target.value })}
                  rows={3}
                  placeholder="e.g. Health-conscious tech workers, young parents seeking clean snacks for kids"
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Operations & Timeline */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 6 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Operations & Launch Horizon</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Target launch timeline and operational objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Planning Horizon</label>
                <select
                  value={formData.time_horizon}
                  onChange={(e) => setFormData({ ...formData, time_horizon: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="1 year">1 Year (Rapid Break-even)</option>
                  <option value="3 years">3 Years (Growth & Scale)</option>
                  <option value="5 years">5 Years (Long-term Stability)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Core Startup Objective</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Risk & Experience */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 7 of 8</span>
              <h2 className="text-xl font-bold text-white mt-1">Risk Preference & Founder Experience</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Calibrate the Risk & Critic Agent's audit thresholds and capital buffer requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Risk Preference</label>
                <select
                  value={formData.risk_preference}
                  onChange={(e) => setFormData({ ...formData, risk_preference: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="Conservative">Conservative (High Cash Safety Buffer)</option>
                  <option value="Moderate">Moderate (Balanced Growth & Safety)</option>
                  <option value="Aggressive">Aggressive (High Capex / Fast Expansion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Founder Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 8 of 8</span>
                <h2 className="text-xl font-bold text-white mt-1">Review & Launch 16 AI Agents</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verify your assumptions before launching the parallel multi-agent orchestrator.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {backendProbe?.ok ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live Backend Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Cloud Backend Offline
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#0a0f1d] p-5 rounded-2xl border border-gray-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-gray-800">
                <div>
                  <span className="text-gray-400 block">Venture:</span>
                  <span className="font-bold text-white text-sm">{formData.business_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Start Mode:</span>
                  <span className="font-bold text-cyan-400 text-sm">{formData.business_start_mode}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Capital:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {formData.currency} {Number(formData.capital).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Location:</span>
                  <span className="font-bold text-white text-sm">{formData.location}</span>
                </div>
              </div>

              <div className="space-y-1 text-gray-300">
                <span className="text-gray-400 block">Value Proposition:</span>
                <p className="font-medium text-white">{formData.primary_usp}</p>
              </div>

              <div className="space-y-1 text-gray-300">
                <span className="text-gray-400 block">Target Audience:</span>
                <p>{formData.target_customer}</p>
              </div>
            </div>

            {/* Offline/Notice Pre-Launch Banner */}
            {backendProbe && !backendProbe.ok && !error && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Live Cloud Backend Offline — Demo Mode Ready
                  </span>
                  <p className="text-gray-400 text-[11px]">
                    No live backend server reachable at <code className="text-cyan-400">{getApiBaseUrl()}</code>. You can run in <strong>Demo Mode</strong> to simulate all 16 AI agents and generate the complete business plan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition shrink-0 flex items-center gap-1.5"
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
                    <p className="text-xs text-gray-300 leading-relaxed">
                      The backend at <code className="text-cyan-300 px-1.5 py-0.5 bg-black/50 rounded font-mono">{error.url || getApiBaseUrl()}</code> returned <strong>{error.message || "HTTP 404"}</strong> (not deployed or unreachable).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1">
                  <span className="font-semibold text-gray-200 block">Recommended Recovery Options:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-gray-400 text-[11px]">
                    <li><strong>Demo Mode:</strong> Run the complete 16-agent simulation locally inside the browser using industry benchmark data.</li>
                    <li><strong>Custom / Local Backend:</strong> Point NEXORA to your running local FastAPI backend (<code className="text-cyan-400">http://localhost:8000</code>) or live cloud tunnel.</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLaunchDemo}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Launch in Demo Mode (16 Agents)</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowUrlEditor(!showUrlEditor)}
                    className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold text-xs border border-gray-700 flex items-center gap-1.5 transition"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showUrlEditor ? "Hide URL Settings" : "Change Backend URL"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold text-xs border border-gray-700 flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Retry Connection</span>
                  </button>
                </div>

                {showUrlEditor && (
                  <div className="pt-3 border-t border-gray-800 space-y-2">
                    <label className="text-[11px] text-gray-300 font-semibold block">
                      Configure Live Backend Base URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={backendInput}
                        onChange={(e) => setBackendInput(e.target.value)}
                        placeholder="http://localhost:8000 or https://your-backend.onrender.com"
                        className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-xl text-xs text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={handleSaveBackendUrl}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-xl border border-gray-700 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div></div>}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLaunchDemo}
                className="px-4 py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch in Demo Mode</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-sm rounded-xl shadow-xl shadow-cyan-500/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{loading ? "Launching 16 Agents..." : "Launch 16 AI Agents"}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
