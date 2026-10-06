import React from 'react';
import { Home, FileText, Settings, HelpCircle, Sparkles, X, Shield, ExternalLink, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'reports' | 'settings' | 'help';
  setActiveTab: (tab: 'home' | 'reports' | 'settings' | 'help') => void;
  reportsCount: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  theme?: 'dark' | 'light';
}

interface NavItem {
  id: 'home' | 'reports' | 'settings' | 'help';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  reportsCount,
  mobileOpen = false,
  onCloseMobile,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const navItems: NavItem[] = [
    { id: 'home', label: 'Intelligence Desk', icon: Home },
    { id: 'reports', label: 'Reports Archive', icon: FileText, badge: reportsCount },
    { id: 'settings', label: 'Research Settings', icon: Settings },
    { id: 'help', label: 'Methodology & Help', icon: HelpCircle },
  ];

  const handleSelectTab = (tab: 'home' | 'reports' | 'settings' | 'help') => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className={`flex flex-col justify-between h-full p-4 select-none transition-colors duration-200 ${
      isDark ? 'bg-[#090d16] text-slate-200' : 'bg-white text-slate-800'
    }`}>
      <div className="space-y-4">
        {/* Mobile Header with close button */}
        {onCloseMobile && (
          <div className={`lg:hidden flex items-center justify-between pb-2 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Navigation</span>
            <button
              onClick={onCloseMobile}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-cyan-950/40 text-cyan-300 font-bold border-l-3 border-cyan-400 glow-cyan-sm shadow-[inset_0_1px_1px_rgba(6,182,212,0.2)]'
                      : 'bg-blue-50 text-blue-900 font-bold border-l-3 border-blue-600 shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${
                    isActive
                      ? isDark ? 'text-cyan-400' : 'text-blue-700'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono font-semibold ${
                      isActive
                        ? isDark ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-500/40' : 'bg-blue-200/80 text-blue-900'
                        : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Intelligence Standards Card */}
        <div className={`p-3 rounded-xl border space-y-2 text-xs transition-colors ${
          isDark
            ? 'bg-slate-900/60 border-slate-800/90 text-slate-400'
            : 'bg-slate-50 border-slate-200/80 text-slate-600'
        }`}>
          <div className={`flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider ${
            isDark ? 'text-cyan-400' : 'text-slate-800'
          }`}>
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Fact-Check Policy</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Strict verification: requires at least 2 independent wire services or verified .gov releases per story.
          </p>
        </div>
      </div>

      {/* Powered by Google AI Studio Footer Card with glowing rim in dark mode */}
      <div className={`border rounded-xl p-3.5 mt-auto transition-all ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border-slate-800/90 glow-blue-sm'
          : 'bg-gradient-to-br from-slate-50 to-blue-50/40 border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-semibold leading-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Powered by
            </div>
            <div className={`text-xs font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Google AI Studio
            </div>
          </div>
        </div>
        <p className={`text-[11px] leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Real-time news research powered by Gemini 3.8 Flash with Google Search Grounding.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-64 border-r flex-col shrink-0 no-print transition-colors duration-200 ${
        isDark ? 'border-slate-800/90 bg-[#090d16]' : 'border-slate-200 bg-white'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Slide-over */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex no-print">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className={`relative w-72 max-w-xs h-full shadow-2xl flex flex-col z-50 border-r ${
            isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'
          }`}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
