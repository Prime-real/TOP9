import React, { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, Clock, Menu, X, Newspaper } from 'lucide-react';

interface HeaderProps {
  currentDateText: string;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateText,
  mobileMenuOpen = false,
  onToggleMobileMenu,
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

  return (
    <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left: Mobile hamburger + Brand & Editorial Desk */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* US Flag Emblem */}
          <div className="w-9 h-6.5 rounded-xs shadow-xs border border-slate-300 overflow-hidden flex flex-col justify-between shrink-0 bg-white">
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
              <span className="text-sm sm:text-base font-extrabold text-[#0b192c] tracking-tight uppercase">
                USA Daily News Intelligence
              </span>
              <span className="text-slate-300 text-xs hidden sm:inline" aria-hidden="true">|</span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                National Research Desk
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal">
              AI-Powered U.S. News Research · Verified Reporting · PDF-Ready Daily Briefing
            </p>
          </div>
        </div>

        {/* Right Status & Date */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Grounding Status badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/90 px-2.5 py-1 rounded-md border border-emerald-200/80 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Search Grounding Active</span>
          </div>

          {/* Live US Clock */}
          {liveTime && (
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-medium text-slate-700">{liveTime}</span>
            </div>
          )}

          {/* Date pill */}
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-lg font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{currentDateText}</span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="text-slate-500 hidden sm:inline">U.S. Edition</span>
          </div>
        </div>
      </div>
    </header>
  );
};
