import React, { useState } from "react";
import { Sliders, RotateCcw, TrendingUp, ShieldAlert, ArrowRight, Check, Coins, Scale, MapPin } from "lucide-react";
import { runWhatIfSimulation } from "../api/client";

export default function WhatIfPage({ plan, onPlanUpdated }) {
  if (!plan) return null;

  const profile = plan.profile || {};
  const originalCapital = profile.capital || 1000000;
  const currency = profile.currency || "INR";

  const [capital, setCapital] = useState(originalCapital);
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [riskPreference, setRiskPreference] = useState(profile.risk_preference || "Moderate");
  const [timeHorizon, setTimeHorizon] = useState(profile.time_horizon || "3 years");
  const [location, setLocation] = useState(profile.location || "Hyderabad");

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await runWhatIfSimulation({
        plan_id: plan.id,
        capital: Number(capital),
        scale_factor: Number(scaleFactor),
        risk_preference: riskPreference,
        time_horizon: timeHorizon,
        location: location
      });
      setSimulationResult(res);
    } catch (err) {
      console.error("What-If simulation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCapital(originalCapital);
    setScaleFactor(1.0);
    setRiskPreference(profile.risk_preference || "Moderate");
    setTimeHorizon(profile.time_horizon || "3 years");
    setLocation(profile.location || "Hyderabad");
    setSimulationResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-2 shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Sliders className="w-3.5 h-3.5" />
          Interactive Sensitivity Simulator
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          "What If?" Dynamic Scenario Testing
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Tweak starting capital, operational scale, risk preferences, or locations. 
          NEXORA recalculates unit economics, cash runways, break-even timelines, and feasibility scores in real time.
        </p>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bold text-gray-200">Adjust Key Parameters</h3>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Capital Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                Available Capital ({currency})
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {currency} {Number(capital).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="300000"
              max="3500000"
              step="50000"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>{currency} 3L (Ultra Lean)</span>
              <span>{currency} 18L</span>
              <span>{currency} 35L (Well-funded)</span>
            </div>
          </div>

          {/* Operational Scale Factor */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                Operational Scale
              </span>
              <span className="font-mono font-bold text-indigo-400">{scaleFactor}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={scaleFactor}
              onChange={(e) => setScaleFactor(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>0.5x (Micro Pod)</span>
              <span>1.0x (Standard)</span>
              <span>2.0x (Expanded)</span>
            </div>
          </div>

          {/* Risk Preference */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Risk Posture</label>
            <div className="grid grid-cols-3 gap-2">
              {["Conservative", "Moderate", "Aggressive"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskPreference(r)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    riskPreference === r
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Target Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Hyderabad">Hyderabad (Hitec / Madhapur / Jubilee Hills)</option>
              <option value="Bengaluru">Bengaluru (Koramangala / Indiranagar / HSR)</option>
              <option value="Mumbai">Mumbai (Bandra / Andheri / Powai)</option>
              <option value="Pune">Pune (Kothrud / Viman Nagar / Hinjawadi)</option>
            </select>
          </div>

          {/* Simulate Action Button */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                <span>Recalculating Plan...</span>
              </>
            ) : (
              <>
                <span>Recalculate What-If Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {!simulationResult ? (
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto text-amber-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Adjust Parameters & Run Simulation</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Modify capital or scale on the left and click Recalculate to generate a comprehensive before-and-after sensitivity diff.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Score Delta Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#13192B] to-[#171A2E] border border-gray-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Feasibility Score Impact</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white font-mono">{simulationResult.new_score} / 100</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-mono ${
                      simulationResult.score_delta >= 0 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {simulationResult.score_delta >= 0 ? `+${simulationResult.score_delta}` : simulationResult.score_delta} pts
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-300 bg-gray-900/60 p-3 rounded-xl border border-gray-800 max-w-md">
                  {simulationResult.summary_insight}
                </div>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Runway */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Cash Runway</span>
                  <div className="text-lg font-bold text-white font-mono">
                    {simulationResult.cost_comparison?.new_runway_months} months
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Was: {simulationResult.cost_comparison?.original_runway_months} months
                  </div>
                </div>

                {/* Monthly Burn */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Monthly Fixed Burn</span>
                  <div className="text-lg font-bold text-white font-mono">
                    {currency} {Number(simulationResult.cost_comparison?.new_monthly_burn || 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Was: {currency} {Number(simulationResult.cost_comparison?.original_monthly_burn || 0).toLocaleString()}
                  </div>
                </div>

                {/* Break-even Month */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Break-even Month</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    Month {simulationResult.break_even_comparison?.new_month}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Was: Month {simulationResult.break_even_comparison?.original_month}
                  </div>
                </div>

              </div>

              {/* Changed Risk Warnings */}
              {simulationResult.risk_delta && simulationResult.risk_delta.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Adjusted Risk Observations
                  </h4>
                  <div className="space-y-2">
                    {simulationResult.risk_delta.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs space-y-0.5">
                        <strong className="text-gray-200 block">{r.title}</strong>
                        <p className="text-gray-400 text-[11px]">{r.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmap Milestones Adjustments */}
              {simulationResult.roadmap_adjustments && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-2 text-xs">
                  <h4 className="font-bold text-gray-200 text-xs">Calibrated Execution Milestones:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                    {simulationResult.roadmap_adjustments.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
