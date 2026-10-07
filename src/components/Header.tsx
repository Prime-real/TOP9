import React, { useState } from 'react';
import { Calendar, ShieldCheck, Clock, Menu, X, Sun, Moon, Flame, Globe2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLiveClocks, LiveClockInfo } from '../hooks/useLiveClocks';

interface HeaderProps {
  currentDateText?: string;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  liveClocks?: LiveClockInfo;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateText,
  mobileMenuOpen = false,
  onToggleMobileMenu,
  theme = 'dark',
  onToggleTheme,
  liveClocks: externalClocks,
}) => {
  const internalClocks = useLiveClocks();
  const clocks = externalClocks || internalClocks;
  const isDark = theme === 'dark';

  const [showTzDetails, setShowTzDetails] = useState(false);
  const [preferredZone, setPreferredZone] = useState<'both' | 'us' | 'india'>('both');

  return (
    <header
      className={`border-b px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30 transition-colors duration-200 no-print backdrop-blur-md ${
        isDark
          ? 'bg-[#090d16]/95 border-slate-800 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Brand & Editorial Desk */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className={`lg:hidden p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* US Flag Emblem with subtle luminous rim */}
          <div className="w-8 sm:w-9 h-6 sm:h-6.5 rounded-xs shadow-xs border border-slate-700/80 overflow-hidden flex flex-col justify-between shrink-0 bg-white relative">
            <div className="h-full w-full bg-gradient-to-b from-red-600 via-white to-red-600 flex relative">
              <div className="w-3.5 h-3 bg-blue-900 absolute top-0 left-0 flex items-center justify-center">
                <span className="text-[6.5px] text-white font-bold tracking-tighter">★</span>
              </div>
              <div className="w-full h-full flex flex-col justify-between">
                <div className="h-[2px] bg-red-600" />
                <div className="h-[2px] bg-white" />
                <div className="h-[2px] bg-red-600" />
                <div className="h-[2px] bg-white" />
                <div className="h-[2px] bg-red-600" />
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`text-xs sm:text-base font-extrabold tracking-tight uppercase truncate ${
                  isDark ? 'text-white glow-text-cyan' : 'text-[#0b192c]'
                }`}
              >
                USA Daily News Intelligence
              </span>
              <span className="text-slate-600 text-xs hidden md:inline" aria-hidden="true">|</span>
              <span className={`text-xs font-semibold hidden md:inline ${isDark ? 'text-cyan-400' : 'text-slate-500'}`}>
                National Desk
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-normal truncate hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-Time U.S. News Wire · Live TV Watch · Verified PDF Briefing
            </p>
          </div>
        </div>

        {/* Right Status, REAL DUAL LIVE WATCH (USA & INDIA) & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* REAL LIVE WATCH: DUAL USA & INDIA CLOCKS */}
          <div className="relative">
            <button
              onClick={() => setShowTzDetails((prev) => !prev)}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900/90 border-cyan-500/40 text-slate-100 hover:border-cyan-400 glow-cyan-sm'
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
              }`}
              title="Click to view full dual USA & India live clocks and time comparison"
            >
              {/* Pulsing Live Clock Beacon */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>

              {/* USA LIVE WATCH DISPLAY */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs" title="United States (Eastern Time)">🇺🇸</span>
                <div className="text-left font-mono leading-tight">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold text-xs ${isDark ? 'text-cyan-300 glow-text-cyan' : 'text-blue-950 font-black'}`}>
                      {clocks.usTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{clocks.usTz}</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 hidden lg:block">
                    {clocks.usDate}
                  </div>
                </div>
              </div>

              {/* Divider between watches */}
              <span className="text-slate-600 font-light mx-0.5 hidden sm:inline">|</span>

              {/* INDIA LIVE WATCH DISPLAY */}
              <div className="items-center gap-1.5 hidden sm:flex">
                <span className="text-xs" title="India Standard Time (IST)">🇮🇳</span>
                <div className="text-left font-mono leading-tight">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold text-xs ${isDark ? 'text-amber-300 glow-text-amber' : 'text-amber-900 font-black'}`}>
                      {clocks.indiaTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{clocks.indiaTz}</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 hidden lg:block">
                    {clocks.indiaDate}
                  </div>
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showTzDetails ? 'rotate-180' : ''}`} />
            </button>

            {/* EXPANDABLE DUAL LIVE WATCH POPOVER */}
            {showTzDetails && (
              <div
                className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border p-4 shadow-2xl z-50 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  isDark
                    ? 'bg-[#0a101f] border-cyan-500/40 text-slate-100 glow-cyan shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
                    : 'bg-white border-slate-300 text-slate-900 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    <span className="font-extrabold text-xs uppercase tracking-wider">
                      Real Live Watch · Dual Timezones
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ticking Live
                  </span>
                </div>

                {/* USA Watch Card */}
                <div
                  className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                    isDark ? 'bg-slate-900/90 border-blue-500/40 text-white' : 'bg-blue-50/70 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="text-sm">🇺🇸</span>
                      <span>United States (Eastern Time · NY / D.C.)</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                      {clocks.usTz}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className={`text-xl font-black ${isDark ? 'text-cyan-300 glow-text-cyan' : 'text-blue-900'}`}>
                      {clocks.usTime}
                    </span>
                    <span className="text-xs text-slate-400">{clocks.usDate}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400 font-mono">
                    <span>Pacific Time (LA / SF):</span>
                    <span className="font-semibold text-slate-300">{clocks.usPacificTime} PDT</span>
                  </div>
                </div>

                {/* India Watch Card */}
                <div
                  className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                    isDark ? 'bg-slate-900/90 border-amber-500/40 text-white' : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="text-sm">🇮🇳</span>
                      <span>India Standard Time (IST · New Delhi / Mumbai)</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      IST (UTC +5:30)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className={`text-xl font-black ${isDark ? 'text-amber-300 glow-text-amber' : 'text-amber-950'}`}>
                      {clocks.indiaTime}
                    </span>
                    <span className="text-xs text-slate-400">{clocks.indiaDate}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400 font-mono">
                    <span>Time Offset vs Eastern Time:</span>
                    <span className="font-semibold text-emerald-400">+9 hours 30 minutes ahead</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1">
                  <span>Clocks synchronize continuously with system time.</span>
                  <button
                    onClick={() => setShowTzDetails(false)}
                    className="font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Glowing Theme Toggle (Dark / Light) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center relative group shrink-0 ${
                isDark
                  ? 'bg-slate-900 border-amber-500/40 text-amber-300 hover:border-amber-400 glow-amber'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 shadow-xs'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Glowing Dark Theme'}
              aria-label="Toggle dark and light theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 animate-spin-slow text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
