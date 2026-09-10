import React, { useState, useEffect } from "react";
import { getLocations, compareLocations } from "../api/client";
import {
  MapPin,
  Sparkles,
  Store,
  CheckCircle,
  ShieldCheck,
  IndianRupee,
  BarChart3
} from "lucide-react";

export default function LocationComparePage() {
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [locationsList, setLocationsList] = useState([]);
  const [selectedLocs, setSelectedLocs] = useState(["Kondapur", "Miyapur", "Koramangala"]);
  const [sector, setSector] = useState("food-beverage");
  const [startMode, setStartMode] = useState("Home-Based");
  const [capital, setCapital] = useState(300000);
  const [comparisonResult, setComparisonResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getLocations();
        if (res && res.flat_localities) {
          setLocationsList(res.flat_localities);
        }
        // Run initial comparison
        const comp = await compareLocations({
          locations: ["Kondapur", "Miyapur", "Koramangala"],
          sector: "food-beverage",
          start_mode: "Home-Based",
          capital: 300000
        });
        if (comp && comp.comparison) {
          setComparisonResult(comp.comparison);
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRunComparison = async () => {
    if (selectedLocs.length < 2) return;
    setComparing(true);
    try {
      const res = await compareLocations({
        locations: selectedLocs,
        sector,
        start_mode: startMode,
        capital
      });
      if (res && res.comparison) {
        setComparisonResult(res.comparison);
      }
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setComparing(false);
    }
  };

  const toggleLocationSelect = (locName) => {
    if (selectedLocs.includes(locName)) {
      if (selectedLocs.length > 2) {
        setSelectedLocs(selectedLocs.filter((l) => l !== locName));
      }
    } else {
      if (selectedLocs.length < 4) {
        setSelectedLocs([...selectedLocs, locName]);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading Location Intelligence Engine...</p>
        </div>
      </div>
    );
  }

  const comp = comparisonResult;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
              <MapPin className="w-5 h-5" />
              <span>GEOGRAPHIC SUITABILITY & BENCHMARKS</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Location Comparison Tool
            </h1>
            <p className="text-slate-400 mt-1">
              Compare footfall, commercial and residential rents, target demographic density, and regulatory ease across cities and micro-markets.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Business Start Mode
            </label>
            <select
              value={startMode}
              onChange={(e) => setStartMode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Home-Based">Home-Based</option>
              <option value="Physical Store">Physical Store</option>
              <option value="Online">Online / D2C</option>
              <option value="Mobile Business">Mobile Business / Cart</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="food-beverage">Food & Beverage / Healthy Snacks</option>
              <option value="retail">Curated Retail & Apparel</option>
              <option value="software-saas">B2B SaaS / Software</option>
              <option value="healthcare">Health & Wellness Clinic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Available Capital (₹)
            </label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunComparison}
              disabled={comparing || selectedLocs.length < 2}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{comparing ? "Comparing..." : "Compare Now"}</span>
            </button>
          </div>
        </div>

        {/* Location Selector Pills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select 2 to 4 Localities to Compare:
            </span>
            <span className="text-xs text-indigo-400 font-medium">
              {selectedLocs.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {locationsList.map((loc, idx) => {
              const isSelected = selectedLocs.includes(loc.locality);
              return (
                <button
                  key={idx}
                  onClick={() => toggleLocationSelect(loc.locality)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{loc.locality} ({loc.city})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {comp && (
          <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-900/60 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-700/50">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI OPTIMAL RECOMMENDATION</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Top Recommended: <span className="text-indigo-400">{comp.recommended_location}</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {comp.recommendation_reason}
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-800/40 text-center shrink-0">
                <span className="text-xs text-slate-400 font-medium block">Winning Score</span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  {comp.locations_compared?.[0]?.suitability_score}/100
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">Top Fit for {startMode}</span>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Cards Grid */}
        {comp && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comp.locations_compared?.map((loc, idx) => (
              <div
                key={idx}
                className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between transition ${
                  idx === 0 ? "border-indigo-500/80 shadow-xl shadow-indigo-950/40" : "border-slate-800"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{loc.city}, {loc.state}</span>
                      <h3 className="text-xl font-bold text-white mt-0.5">{loc.locality}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Score</span>
                      <span className="text-xl font-extrabold text-indigo-400">{loc.suitability_score}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Sector Demand:</span>
                      <span className="font-semibold text-white">{loc.sector_demand_score}/100</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Foot Traffic Index:</span>
                      <span className="font-semibold text-white">{loc.foot_traffic_score}/100</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Avg Commercial Rent:</span>
                      <span className="font-semibold text-slate-200">₹{loc.avg_commercial_rent_sqft}/sqft</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Home Business Fit:</span>
                      <span className="font-semibold text-emerald-400">{loc.home_suitability}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Est. Monthly Space Cost:</span>
                      <span className="font-semibold text-amber-400">
                        {loc.estimated_monthly_space_cost === 0 ? "₹ 0 (Home Used)" : `₹ ${loc.estimated_monthly_space_cost?.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Regulatory Ease:</span>
                      <span className="font-semibold text-indigo-300">{loc.regulatory_ease}/100</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Competition Level:</span>
                      <span className="font-semibold text-slate-300">{loc.competition_level}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 block font-medium">Target Demographic:</span>
                    <p className="text-slate-300 leading-relaxed">{loc.target_demographic}</p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-slate-400 block font-medium">Key Municipal Permits:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {loc.permits?.map((p, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded text-[11px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
