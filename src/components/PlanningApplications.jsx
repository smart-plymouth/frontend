import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'

function getMonday(date) {
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  const daysSinceMonday = (dayOfWeek + 6) % 7
  d.setDate(d.getDate() - daysSinceMonday)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekRange(weekStartMonday) {
  const from = new Date(weekStartMonday)
  const to = new Date(weekStartMonday)
  to.setDate(from.getDate() + 6)
  const fmt = (d) => d.toISOString().split('T')[0]
  return { from: fmt(from), to: fmt(to) }
}

function PlanningApplications() {
  const [thisWeekTotal, setThisWeekTotal] = useState(null)
  const [lastWeekTotal, setLastWeekTotal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const thisMonday = getMonday(new Date())
      const lastMonday = new Date(thisMonday)
      lastMonday.setDate(thisMonday.getDate() - 7)

      const thisRange = getWeekRange(thisMonday)
      const lastRange = getWeekRange(lastMonday)

      const [thisRes, lastRes] = await Promise.all([
        fetch(`${API_BASE}/cases?validated_from=${thisRange.from}&validated_to=${thisRange.to}&per_page=1`),
        fetch(`${API_BASE}/cases?validated_from=${lastRange.from}&validated_to=${lastRange.to}&per_page=1`),
      ])

      if (!thisRes.ok) throw new Error('Failed to fetch planning data')
      const thisData = await thisRes.json()
      setThisWeekTotal(thisData.total ?? 0)

      if (lastRes.ok) {
        const lastData = await lastRes.json()
        setLastWeekTotal(lastData.total ?? 0)
      }

      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getTrend() {
    if (thisWeekTotal === null || lastWeekTotal === null || lastWeekTotal === 0) return null
    const diff = thisWeekTotal - lastWeekTotal
    const pct = Math.round((diff / lastWeekTotal) * 100)
    return { diff, pct }
  }

  const trend = getTrend()

  return (
    <Link to="/planning" className="block">
      <div className="bg-white border border-indigo-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22V2" />
              <path d="M15 22V2" />
              <path d="M4 6h16" />
              <path d="M4 14h16" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-slate-600">Planning</h2>
        </div>

        <div className="flex-1 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">Unavailable</p>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">{thisWeekTotal}</p>
                {trend && (
                  <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${trend.diff >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {trend.diff >= 0 ? (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                    {Math.abs(trend.pct)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-0.5">new applications this week</p>
              {trend && (
                <p className="text-xs text-slate-400 mt-1">
                  {trend.diff >= 0 ? 'Up' : 'Down'} from {lastWeekTotal} last week
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-indigo-100">
          <span className="text-xs text-indigo-600 font-medium">View applications →</span>
        </div>
      </div>
    </Link>
  )
}

export default PlanningApplications
