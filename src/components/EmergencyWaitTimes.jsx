import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/emergency-wait-times/v1.0'

function EmergencyWaitTimes() {
  const [longestWait, setLongestWait] = useState(null)
  const [totalWaiting, setTotalWaiting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const locRes = await fetch(`${API_BASE}/locations`)
      if (!locRes.ok) throw new Error('Failed to fetch locations')
      const locs = await locRes.json()

      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const start = oneHourAgo.toISOString()
      const end = now.toISOString()

      const waitTimeEntries = await Promise.all(
        locs.map(async (loc) => {
          const res = await fetch(`${API_BASE}/locations/${loc.id}/wait-times?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
          if (!res.ok) return null
          const data = await res.json()
          return data.length > 0 ? data[0] : null
        })
      )

      const validEntries = waitTimeEntries.filter(Boolean)
      const maxWait = validEntries.reduce((max, wt) => Math.max(max, wt.longest_wait || 0), 0)
      const totalPatients = validEntries.reduce((sum, wt) => sum + (wt.patients_waiting || 0), 0)

      setLongestWait(maxWait)
      setTotalWaiting(totalPatients)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatWait(m) {
    const h = Math.floor(m / 60)
    const rem = m % 60
    return h > 0 ? `${h}h ${rem}m` : `${m}m`
  }

  function getWaitColor(m) {
    if (m > 120) return 'text-red-600'
    if (m > 60) return 'text-amber-600'
    return 'text-emerald-600'
  }

  return (
    <Link to="/emergency-wait-times" className="block group">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col justify-between group-hover:shadow-md group-hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
              <svg className="h-4.5 w-4.5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-700">Emergency Waits</h2>
          </div>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        </div>

        <div className="flex-1 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">Unavailable</p>
          ) : (
            <div className="flex items-end gap-6 w-full">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Longest wait</p>
                <p className={`text-3xl font-bold tabular-nums ${getWaitColor(longestWait)}`}>{formatWait(longestWait)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Patients waiting</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{totalWaiting}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">University Hospitals Plymouth NHS Trust</span>
          <span className="text-xs text-teal-600 font-medium group-hover:translate-x-0.5 transition-transform">View details →</span>
        </div>
      </div>
    </Link>
  )
}

export default EmergencyWaitTimes
