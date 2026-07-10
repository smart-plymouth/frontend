import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'
const PER_PAGE = 20

function getMonday(date) {
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  const daysSinceMonday = (dayOfWeek + 6) % 7
  d.setDate(d.getDate() - daysSinceMonday)
  d.setHours(0, 0, 0, 0)
  return d
}

function Planning() {
  // --- Search state ---
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchTotal, setSearchTotal] = useState(0)
  const [searchPages, setSearchPages] = useState(1)
  const [searchPage, setSearchPage] = useState(1)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  // --- This week's applications state ---
  const [weekCases, setWeekCases] = useState([])
  const [weekTotal, setWeekTotal] = useState(0)
  const [weekLoading, setWeekLoading] = useState(true)
  const [weekError, setWeekError] = useState(null)

  const hasSearch = debouncedSearch.trim().length > 0

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to page 1 when search term changes
  useEffect(() => {
    setSearchPage(1)
  }, [debouncedSearch])

  // --- Fetch this week's applications ---
  useEffect(() => {
    async function fetchThisWeek() {
      try {
        const monday = getMonday(new Date())
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        const from = monday.toISOString().split('T')[0]
        const to = sunday.toISOString().split('T')[0]

        const res = await fetch(`${API_BASE}/cases?validated_from=${from}&validated_to=${to}&per_page=100`)
        if (!res.ok) throw new Error('Failed to fetch this week\'s applications')
        const data = await res.json()
        setWeekCases(
          (data.cases || []).sort((a, b) => {
            const scoreA = (a.potential_impact_score || 0) + (a.estimated_size || 0)
            const scoreB = (b.potential_impact_score || 0) + (b.estimated_size || 0)
            return scoreB - scoreA
          })
        )
        setWeekTotal(data.total || 0)
        setWeekError(null)
      } catch (err) {
        setWeekError(err.message)
      } finally {
        setWeekLoading(false)
      }
    }
    fetchThisWeek()
  }, [])

  // --- Fetch search results from API ---
  const fetchSearch = useCallback(async () => {
    if (!debouncedSearch.trim()) {
      setSearchResults([])
      setSearchTotal(0)
      setSearchPages(1)
      setSearchLoading(false)
      return
    }
    setSearchLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', searchPage)
      params.set('per_page', PER_PAGE)
      params.set('search', debouncedSearch.trim())
      const res = await fetch(`${API_BASE}/cases?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch planning cases')
      const data = await res.json()
      setSearchResults(data.cases || [])
      setSearchTotal(data.total || 0)
      setSearchPages(data.pages || 1)
      setSearchError(null)
    } catch (err) {
      setSearchError(err.message)
    } finally {
      setSearchLoading(false)
    }
  }, [searchPage, debouncedSearch])

  useEffect(() => {
    fetchSearch()
  }, [fetchSearch])

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/hud" className="text-slate-400 hover:text-slate-600 transition-colors">Dashboard</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-slate-700 font-medium">Planning Applications</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Planning Applications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, explore and track planning applications across Plymouth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://planning.plymouth.gov.uk/online-applications/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Official Planning Portal
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label htmlFor="planning-search" className="sr-only">Search applications</label>
            <input
              id="planning-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by address, proposal, reference, or keyword…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>
          {hasSearch && (
            <p className="text-xs text-slate-500 mt-2">
              {searchLoading
                ? 'Searching…'
                : `${searchTotal.toLocaleString()} result${searchTotal !== 1 ? 's' : ''} for "${debouncedSearch}"`
              }
            </p>
          )}
        </div>

        {/* Search results — only shown when searching */}
        {hasSearch && (
          <>
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {searchLoading ? (
                <div className="flex items-center gap-2 p-6 justify-center">
                  <svg className="h-4 w-4 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <p className="text-sm text-slate-500">Loading applications…</p>
                </div>
              ) : searchError ? (
                <div className="p-4">
                  <p className="text-sm text-red-600">Error: {searchError}</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-400">No applications found matching your criteria.</p>
                </div>
              ) : (
                searchResults.map((c) => (
                  <Link
                    key={c.reference}
                    to={`/planning/${encodeURIComponent(c.reference)}`}
                    className="block px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-indigo-600">
                            {c.reference}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            {c.status}
                          </span>
                          {c.ai_analysis && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700">
                              AI
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mt-1 line-clamp-1">{c.proposal}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.address}</p>
                      </div>
                      {c.ai_analysis && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700">
                            ⚠ {c.potential_impact_score || 0}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                            ◆ {c.estimated_size || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {searchPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
                  disabled={searchPage <= 1}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-xs text-slate-400">
                  Page {searchPage} of {searchPages}
                </span>
                <button
                  onClick={() => setSearchPage((p) => Math.min(searchPages, p + 1))}
                  disabled={searchPage >= searchPages}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* This week's applications — shown when not searching */}
      {!hasSearch && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">This Week</h2>
            {!weekLoading && !weekError && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                {weekTotal} application{weekTotal !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {weekLoading ? (
            <div className="flex items-center gap-2 py-12 justify-center">
              <svg className="h-5 w-5 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-sm text-slate-500">Loading this week's applications…</p>
            </div>
          ) : weekError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">Error: {weekError}</p>
            </div>
          ) : weekCases.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <p className="text-sm text-slate-400">No applications validated this week yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekCases.map((c) => (
                <Link
                  key={c.reference}
                  to={`/planning/${encodeURIComponent(c.reference)}`}
                  className="block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-semibold text-indigo-600">{c.reference}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                      {c.status}
                    </span>
                    {c.ai_analysis && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700">
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">{c.proposal}</p>
                  <p className="text-xs text-slate-400 mt-1.5 truncate">{c.address}</p>
                  {c.ai_analysis && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700">
                        Impact: {c.potential_impact_score || 0}/10
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                        Size: {c.estimated_size || 0}/10
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source attribution */}
      <div className="text-center pt-2">
        <a
          href="https://planning.plymouth.gov.uk/online-applications/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-slate-600 hover:underline transition-colors"
        >
          Data source: Plymouth City Council Planning Portal
        </a>
      </div>
    </div>
  )
}

export default Planning
