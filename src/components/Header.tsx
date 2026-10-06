import React, { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, Clock, Menu, X, Sun, Moon, Flame } from 'lucide-react';

interface HeaderProps {
  currentDateText: string;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateText,
  mobileMenuOpen = false,
  onToggleMobileMenu,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setLiveTime(`${timeStr} EDT`);
      } catch (e) {
        setLiveTime('10:24 AM EDT');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b px-4 sm:px-6 py-3 sticky top-0 z-30 transition-colors duration-200 no-print backdrop-blur-md ${
        isDark
          ? 'bg-[#090d16]/95 border-slate-800 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left: Mobile hamburger + Brand & Editorial Desk */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className={`lg:hidden p-1.5 rounded-lg transition-colors cursor-pointer ${
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
          <div className="w-9 h-6.5 rounded-xs shadow-xs border border-slate-700/80 overflow-hidden flex flex-col justify-between shrink-0 bg-white relative">
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

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm sm:text-base font-extrabold tracking-tight uppercase ${
                  isDark ? 'text-white glow-text-cyan' : 'text-[#0b192c]'
                }`}
              >
                USA Daily News Intelligence
              </span>
              <span className="text-slate-600 text-xs hidden sm:inline" aria-hidden="true">|</span>
              <span className={`text-xs font-semibold hidden sm:inline ${isDark ? 'text-cyan-400' : 'text-slate-500'}`}>
                National Research Desk
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              AI-Powered U.S. News Research · Breaking Headlines · PDF-Ready Daily Briefing
            </p>
          </div>
        </div>

        {/* Right Status, Clock & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Grounding Status badge with glowing pulse */}
          <div
            className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-semibold transition-all ${
              isDark
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 glow-emerald'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>Search Grounding Active</span>
          </div>

          {/* Live US Clock with glowing cyan text in dark mode */}
          {liveTime && (
            <div
              className={`hidden xl:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-mono ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-cyan-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{liveTime}</span>
            </div>
          )}

          {/* Date pill */}
          <div
            className={`flex items-center gap-1.5 sm:gap-2 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border font-medium ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold">{currentDateText}</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className={`text-[11px] hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>U.S. Edition</span>
          </div>

          {/* Glowing Theme Toggle (Dark / Light) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center relative group ${
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
