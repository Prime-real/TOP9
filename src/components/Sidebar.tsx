import React from 'react';
import { Home, FileText, Settings, HelpCircle, Sparkles, X, Shield, ExternalLink } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'reports' | 'settings' | 'help';
  setActiveTab: (tab: 'home' | 'reports' | 'settings' | 'help') => void;
  reportsCount: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
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
}) => {
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
    <div className="flex flex-col justify-between h-full p-4 select-none">
      <div className="space-y-4">
        {/* Mobile Header with close button */}
        {onCloseMobile && (
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
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
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-3 border-blue-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono font-semibold ${
                      isActive ? 'bg-blue-200/80 text-blue-900' : 'bg-slate-100 text-slate-600'
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
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Fact-Check Policy</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Strict verification: requires at least 2 independent wire services or verified .gov releases per story.
          </p>
        </div>
      </div>

      {/* Powered by Google AI Studio Footer Card */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/90 rounded-xl p-3.5 mt-auto">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold leading-none">Powered by</div>
            <div className="text-xs font-bold text-slate-900">Google AI Studio</div>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Real-time news research powered by Gemini 2.5 with Google Search Grounding.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 no-print">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Slide-over */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex no-print">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
