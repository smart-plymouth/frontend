import { useState, useEffect } from 'react'
import EmergencyWaitTimes from '../components/EmergencyWaitTimes.jsx'
import PlanningApplications from '../components/PlanningApplications.jsx'
import BirdMonitoring from '../components/BirdMonitoring.jsx'

function Hud() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">City Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time data across Plymouth
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="text-right">
            <p className="text-sm font-mono font-medium text-slate-800 tabular-nums">
              {time.toLocaleTimeString('en-GB')}
            </p>
            <p className="text-[11px] text-slate-400">
              {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <EmergencyWaitTimes />
        <PlanningApplications />
        <BirdMonitoring />
      </div>
    </div>
  )
}

export default Hud
