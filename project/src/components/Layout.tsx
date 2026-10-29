import { useApp } from '@/store';
import { ShieldCheck, Menu, X, Home, FileText, Search, LayoutDashboard, BarChart3, Brain } from 'lucide-react';
import type { View } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  view: View;
  icon: LucideIcon;
  group: 'citizen' | 'officer';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', view: 'home', icon: Home, group: 'citizen' },
  { label: 'Submit Complaint', view: 'submit', icon: FileText, group: 'citizen' },
  { label: 'Track Complaint', view: 'track', icon: Search, group: 'citizen' },
  { label: 'Officer Dashboard', view: 'dashboard', icon: LayoutDashboard, group: 'officer' },
  { label: 'Analytics & AI', view: 'analytics', icon: BarChart3, group: 'officer' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentView, setView, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-grey-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-navy-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-left">
                <span className="font-bold text-base tracking-tight">GrievanceIQ</span>
                <span className="hidden sm:block text-[10px] text-navy-100 leading-none">AI Public Grievance Intelligence</span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setView(item.view)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-navy-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {sidebarOpen && (
          <nav className="md:hidden border-t border-navy-500 bg-navy-600 animate-fade-in-down">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setView(item.view)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active ? 'bg-white/15 text-white' : 'text-navy-100 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-navy-600 text-navy-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-400" />
              <span>GrievanceIQ — Smart India Hackathon 2026</span>
            </div>
            <span className="text-xs text-navy-200">6-Stage AI Pipeline: Submission → NLP → Routing → Dedup → Dashboard → Resolution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { NAV_ITEMS };
