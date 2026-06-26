import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/bird-monitoring/v1.0'

function BirdMonitoring() {
  const [todayCount, setTodayCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`${API_BASE}/sightings?from_date=${today}&to_date=${today}&per_page=1`)
      if (!res.ok) throw new Error('Failed to fetch bird data')
      const data = await res.json()
      setTodayCount(data.total)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link to="/bird-monitoring" className="block">
      <div className="bg-white border border-green-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 7h.01" />
              <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
              <path d="m20 7 2 .5-2 .5" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-slate-600">Bird Monitoring</h2>
        </div>

        <div className="flex-1 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-green-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">Unavailable</p>
          ) : (
            <div>
              <p className="text-3xl font-bold text-slate-900">{todayCount}</p>
              <p className="text-sm text-slate-500 mt-0.5">birds heard today</p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-green-100">
          <span className="text-xs text-green-600 font-medium">View detections →</span>
        </div>
      </div>
    </Link>
  )
}

export default BirdMonitoring
