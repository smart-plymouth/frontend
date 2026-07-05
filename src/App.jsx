import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Hud from './pages/Hud.jsx'
import Planning from './pages/Planning.jsx'
import PlanningCase from './pages/PlanningCase.jsx'
import PlanningTracker from './pages/PlanningTracker.jsx'
import BirdMonitoringExplore from './pages/BirdMonitoringExplore.jsx'
import EmergencyWaitTimesPage from './pages/EmergencyWaitTimes.jsx'
import Phase10Campaign from './pages/Phase10Campaign.jsx'

function NavLink({ to, children }) {
  const { pathname } = useLocation()
  const isActive = pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'text-blue-900 bg-blue-50'
          : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-950 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <span className="text-white text-xs font-bold tracking-tight">SP</span>
              </div>
              <span className="text-base font-semibold text-slate-900 hidden sm:block">
                Smart Plymouth
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/hud">Dashboard</NavLink>
              <a
                href="https://github.com/smart-plymouth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-900 hover:bg-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="sm:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">Home</Link>
            <Link to="/hud" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">Dashboard</Link>
            <a href="https://github.com/smart-plymouth" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">GitHub</a>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hud" element={<Hud />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/planning/tracker" element={<PlanningTracker />} />
          <Route path="/planning/phase10-campaign" element={<Phase10Campaign />} />
          <Route path="/planning/:reference" element={<PlanningCase />} />
          <Route path="/emergency-wait-times" element={<EmergencyWaitTimesPage />} />
          <Route path="/bird-monitoring" element={<BirdMonitoringExplore />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-slate-400 text-center">
            Smart Plymouth — Open-source smart city ecosystem
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
