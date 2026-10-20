import React from 'react';
import { Plus } from 'lucide-react';

interface TopNavProps {
  activeView: 'dashboard' | 'greetings' | 'contacts' | 'themes';
  onNavigate: (view: 'dashboard' | 'greetings' | 'contacts' | 'themes') => void;
  onOpenCreateModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onNavigate,
  onOpenCreateModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <span className="text-xl">🪔</span>
          <span className="text-base sm:text-lg font-bold font-festive tracking-tight text-amber-100 whitespace-nowrap">
            Vijayadashami Greetings
          </span>
        </div>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              activeView === 'dashboard' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('greetings')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              activeView === 'greetings' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            All Greetings
          </button>
          <button
            onClick={() => onNavigate('contacts')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              activeView === 'contacts' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Contacts Directory
          </button>
          <button
            onClick={() => onNavigate('themes')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              activeView === 'themes' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Festive Themes
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-500/15 transition-all whitespace-nowrap active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Greeting
          </button>
        </div>
      </div>
    </header>
  );
};
