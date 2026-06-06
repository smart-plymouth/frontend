import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import PlanningCase from './pages/PlanningCase.jsx'
import BirdMonitoringExplore from './pages/BirdMonitoringExplore.jsx'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">SP</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Smart Plymouth
              </span>
            </div>
            <div className="flex space-x-1">
              <Link
                to="/"
                className="text-slate-600 hover:text-blue-900 hover:bg-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="text-slate-600 hover:text-blue-900 hover:bg-slate-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/planning/:reference" element={<PlanningCase />} />
          <Route path="/bird-monitoring" element={<BirdMonitoringExplore />} />
        </Routes>
      </main>


    </div>
  )
}

export default App
