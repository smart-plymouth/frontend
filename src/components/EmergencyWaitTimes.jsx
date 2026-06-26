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

      const waitTimeEntries = await Promise.all(
        locs.map(async (loc) => {
          const res = await fetch(`${API_BASE}/locations/${loc.id}/wait-times`)
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
    <Link to="/emergency-wait-times" className="block">
      <div className="bg-white border border-teal-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-slate-600">Emergency Wait Times</h2>
        </div>

        <div className="flex-1 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-teal-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">Unavailable</p>
          ) : (
            <div className="flex items-baseline gap-4">
              <div>
                <p className={`text-3xl font-bold ${getWaitColor(longestWait)}`}>{formatWait(longestWait)}</p>
                <p className="text-sm text-slate-500 mt-0.5">longest wait</p>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <p className="text-3xl font-bold text-slate-900">{totalWaiting}</p>
                <p className="text-sm text-slate-500 mt-0.5">patients waiting</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-teal-100">
          <span className="text-xs text-teal-600 font-medium">View all locations →</span>
        </div>
      </div>
    </Link>
  )
}

export default EmergencyWaitTimes
