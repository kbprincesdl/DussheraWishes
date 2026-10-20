import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-2xl bg-stone-900 border border-amber-500/30 space-y-4">
            <span className="text-4xl">🪔</span>
            <h2 className="text-xl font-bold font-festive text-amber-200">
              Dussehra Greeting App
            </h2>
            <p className="text-xs text-stone-400">
              An unexpected display issue occurred. Please reset to recover the application.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = window.location.pathname;
              }}
              className="px-4 py-2 text-xs font-bold bg-amber-400 text-stone-950 rounded-xl hover:bg-amber-300 transition-colors"
            >
              Reload Greetings
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
