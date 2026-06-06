import { useState, useEffect } from 'react'
import EmergencyWaitTimes from '../components/EmergencyWaitTimes.jsx'
import PlanningApplications from '../components/PlanningApplications.jsx'
import BirdMonitoring from '../components/BirdMonitoring.jsx'

function Home() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">City Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Live data across Plymouth
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">
            {time.toLocaleTimeString('en-GB')}
          </p>
          <p className="text-xs text-slate-500">
            {time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Dashboard sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmergencyWaitTimes />
        <PlanningApplications />
        <BirdMonitoring />
      </div>
    </div>
  )
}

export default Home
