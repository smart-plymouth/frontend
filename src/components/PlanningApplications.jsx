import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PlanningModal from './PlanningModal.jsx'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'
const MIN_DATE = new Date('1980-01-01')

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

function getDefaultWeekStart() {
  const today = new Date()
  return getMonday(today)
}

function PlanningApplications() {
  const [total, setTotal] = useState(null)
  const [topCases, setTopCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weekStart, setWeekStart] = useState(getDefaultWeekStart)
  const [showModal, setShowModal] = useState(false)

  const dateRange = getWeekRange(weekStart)

  const thisMonday = getMonday(new Date())
  const canGoNext = weekStart.getTime() < thisMonday.getTime()
  const prevMonday = new Date(weekStart)
  prevMonday.setDate(weekStart.getDate() - 7)
  const canGoPrev = prevMonday.getTime() >= MIN_DATE.getTime()

  useEffect(() => {
    fetchApplications()
  }, [weekStart])

  async function fetchApplications() {
    setLoading(true)
    try {
      const { from, to } = dateRange
      const res = await fetch(
        `${API_BASE}/cases?validated_from=${from}&validated_to=${to}&per_page=100`
      )
      if (!res.ok) throw new Error('Failed to fetch planning data')
      const data = await res.json()
      setTotal(data.total)

      // Pick top 3 by combined impact + size score
      const scored = (data.cases || [])
        .filter((c) => c.ai_analysis)
        .map((c) => ({
          ...c,
          _score: (c.potential_impact_score || 0) + (c.estimated_size || 0),
        }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 3)
      setTopCases(scored)

      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function goPrev() {
    if (!canGoPrev) return
    const prev = new Date(weekStart)
    prev.setDate(weekStart.getDate() - 7)
    setWeekStart(prev)
  }

  function goNext() {
    if (!canGoNext) return
    const next = new Date(weekStart)
    next.setDate(weekStart.getDate() + 7)
    setWeekStart(next)
  }

  return (
    <div className="bg-white border border-indigo-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center gap-2">
        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22V2" />
          <path d="M15 22V2" />
          <path d="M4 6h16" />
          <path d="M4 10h16" />
          <path d="M4 14h16" />
          <path d="M4 18h16" />
        </svg>
        <h2 className="text-sm font-semibold text-white">Planning</h2>
      </div>

      <div className="px-4 py-2 border-b border-indigo-100">
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
            aria-label="Previous week"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </button>

          <p className="text-sm font-medium text-slate-700">
            {new Date(dateRange.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            {' – '}
            {new Date(dateRange.to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
            aria-label="Next week"
          >
            Next
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 flex-1">
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-sm text-slate-500">Loading…</p>
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">Error: {error}</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-slate-900">{total}</span>
              <span className="text-sm text-slate-600">new applications this week</span>
              <button
                onClick={() => setShowModal(true)}
                className="ml-auto text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded px-2 py-1 hover:bg-indigo-50 transition-colors"
              >
                View
              </button>
            </div>

            {topCases.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Highest Impact &amp; Risk</p>
                {topCases.map((c) => (
                  <Link
                    key={c.reference}
                    to={`/planning/${encodeURIComponent(c.reference)}`}
                    className="block bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg p-2.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-800 truncate">
                          <span className="font-semibold">{c.reference}</span>
                          <span className="text-slate-500"> — {c.proposal}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.address}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700" title="Impact score">
                          ⚠ {c.potential_impact_score || 0}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700" title="Size score">
                          ◆ {c.estimated_size || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-indigo-100">
        <a
          href="https://planning.plymouth.gov.uk/online-applications/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Source: Plymouth City Council Planning Portal
        </a>
      </div>

      {showModal && (
        <PlanningModal dateRange={dateRange} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default PlanningApplications
