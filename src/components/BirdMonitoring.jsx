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
    <Link to="/bird-monitoring" className="block group">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col justify-between group-hover:shadow-md group-hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="h-4.5 w-4.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 7h.01" />
                <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
                <path d="m20 7 2 .5-2 .5" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-700">Bird Monitoring</h2>
          </div>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        <div className="flex-1 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-green-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">Unavailable</p>
          ) : (
            <div>
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{todayCount}</p>
              <p className="text-xs text-slate-400 mt-1">birds heard today</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">BirdNET-Pi network</span>
          <span className="text-xs text-green-600 font-medium group-hover:translate-x-0.5 transition-transform">View detections →</span>
        </div>
      </div>
    </Link>
  )
}

export default BirdMonitoring
