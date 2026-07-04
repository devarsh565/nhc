import React from 'react';
import { Search, SlidersHorizontal, ShieldAlert, Sparkles } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCounty: string;
  setSelectedCounty: (c: string) => void;
  selectedPriceMax: number;
  setSelectedPriceMax: (p: number) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  counties: string[];
  types: string[];
  onOpenChat: () => void;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCounty,
  setSelectedCounty,
  selectedPriceMax,
  setSelectedPriceMax,
  selectedType,
  setSelectedType,
  counties,
  types,
  onOpenChat
}: HeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 overflow-hidden border-b border-emerald-800">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-700 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-600 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative">
        <div className="max-w-3xl">
          {/* Tagline */}
          <div className="inline-flex items-center space-x-2 bg-emerald-950 border border-emerald-800 rounded-full px-3.5 py-1.5 mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-bold font-mono tracking-wider text-emerald-300 uppercase">
              Affordable Housing Program (AHP) • Equity & Access
            </span>
          </div>

          <h1 className="font-sans text-3.5xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Stable Homes, <span className="text-amber-400">Strong Communities.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl">
            We provide access to safe, high-quality, and affordable housing across the nation. Start your journey today with the National Housing Corporation.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-300 flex items-center space-x-2">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-400 shrink-0" />
              <span>Prioritizing ground-floor units and accessible features for PWDs.</span>
            </div>
            <button
              onClick={onOpenChat}
              className="inline-flex items-center space-x-1.5 bg-emerald-800/60 hover:bg-emerald-700 border border-emerald-600/50 text-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Ask Nyumbani AI about payment schemes</span>
            </button>
          </div>
        </div>

        {/* Unified Accessible Search Filter Bar - Professional Polish style */}
        <div className="mt-10 bg-white p-5 rounded-xl shadow-2xl border border-slate-200" role="search" aria-label="Search housing listings">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-slate-800">
            
            {/* Search Input */}
            <div className="flex flex-col">
              <label htmlFor="search-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Location or Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="e.g. Pangani, Studio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm transition-colors"
                  style={{ minHeight: '44px' }}
                />
              </div>
            </div>

            {/* County Select */}
            <div className="flex flex-col">
              <label htmlFor="county-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                County Location
              </label>
              <select
                id="county-select"
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm transition-colors"
                style={{ minHeight: '44px' }}
              >
                <option value="All">All Counties</option>
                {counties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            {/* House Type Select */}
            <div className="flex flex-col">
              <label htmlFor="type-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Housing Type
              </label>
              <select
                id="type-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm transition-colors"
                style={{ minHeight: '44px' }}
              >
                <option value="All">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Cap Filter */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="price-range" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Max Monthly / Purchase Rent
                </label>
                <span className="text-emerald-700 text-xs font-bold font-mono">
                  {selectedPriceMax === 5000000 ? 'Any Budget' : `Under KSh ${(selectedPriceMax / 1000000).toFixed(1)}M`}
                </span>
              </div>
              <div className="flex items-center space-x-3 h-11">
                <input
                  id="price-range"
                  type="range"
                  min="1500000"
                  max="5000000"
                  step="200000"
                  value={selectedPriceMax}
                  onChange={(e) => setSelectedPriceMax(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  aria-label="Filter by maximum price in Kenya Shillings"
                />
              </div>
            </div>

          </div>

          {/* Reset Filters Option if any active */}
          {(searchQuery !== '' || selectedCounty !== 'All' || selectedType !== 'All' || selectedPriceMax < 5000000) && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCounty('All');
                  setSelectedType('All');
                  setSelectedPriceMax(5000000);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition underline focus:outline-none focus:ring-1 focus:ring-emerald-600 rounded px-1.5 py-0.5"
              >
                Clear all active search filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
