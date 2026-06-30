import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'

function PlanningCase() {
  const { reference } = useParams()
  const [planningCase, setPlanningCase] = useState(null)
  const [objections, setObjections] = useState([])
  const [supports, setSupports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCase()
  }, [reference])

  async function fetchCase() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(reference)}`)
      if (!res.ok) throw new Error('Failed to fetch planning case')
      const data = await res.json()
      setPlanningCase(data)
      setError(null)

      if (data.ai_analysis) {
        fetchObjections()
        fetchSupports()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchObjections() {
    try {
      const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(reference)}/objections`)
      if (res.ok) {
        const data = await res.json()
        setObjections(data.objections || [])
      }
    } catch {
      // Non-critical
    }
  }

  async function fetchSupports() {
    try {
      const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(reference)}/supports`)
      if (res.ok) {
        const data = await res.json()
        setSupports(data.supports || [])
      }
    } catch {
      // Non-critical
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <svg className="h-5 w-5 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm text-slate-500">Loading planning case…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-red-600 mb-3">Error: {error}</p>
        <Link to="/hud" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
      </div>
    )
  }

  if (!planningCase) return null

  const c = planningCase

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/hud" className="text-slate-400 hover:text-slate-600 transition-colors">Dashboard</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <Link to="/planning" className="text-slate-400 hover:text-slate-600 transition-colors">Planning</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-slate-700 font-medium">{c.reference}</span>
      </nav>

      {/* ─── APPLICATION OVERVIEW ─── */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{c.reference}</h1>
              <p className="text-sm text-slate-500 mt-1">{c.address}</p>
            </div>
            <a
              href={`https://planning.plymouth.gov.uk/online-applications/simpleSearchResults.do?action=firstPage&searchType=Application&searchCriteria.simpleSearchString=${encodeURIComponent(c.reference)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View on Planning Portal
            </a>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Proposal — the most important thing to communicate */}
          <div>
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">What's being proposed</h2>
            <p className="text-base text-slate-800 leading-relaxed">{c.proposal}</p>
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Fact label="Status" value={c.status} />
            <Fact label="Received" value={formatDate(c.received_date)} />
            <Fact label="Validated" value={formatDate(c.validated_date)} />
            <Fact label="AI Analysis" value={c.ai_analysis ? 'Complete' : 'Pending'} highlight={c.ai_analysis} />
          </div>

          {/* Tags */}
          {c.tags && c.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── AI ANALYSIS ─── */}
      {c.ai_analysis ? (
        <section className="space-y-6">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className="text-sm text-amber-800 leading-relaxed">
              <p className="font-medium">AI-generated content</p>
              <p className="mt-1 text-xs text-amber-700">
                The analysis below is generated by AI and may contain inaccuracies. It should not be treated as authoritative and must be fact-checked before use in any official correspondence.
              </p>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScoreCard
              label="Potential Impact"
              value={c.potential_impact_score}
              color="red"
              description="How much this development may affect the surrounding area"
            />
            <ScoreCard
              label="Estimated Size"
              value={c.estimated_size}
              color="blue"
              description="The scale of the proposed development"
            />
          </div>

          {/* AI Rationale */}
          {c.ai_rationalisation && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">AI Summary</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{c.ai_rationalisation}</p>
            </div>
          )}

          {/* Pros & Cons — side by side quick overview */}
          {(c.pros?.length > 0 || c.cons?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.pros?.length > 0 && (
                <div className="bg-white border border-green-200 rounded-xl p-5">
                  <h3 className="text-xs font-medium text-green-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {c.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1 shrink-0">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {c.cons?.length > 0 && (
                <div className="bg-white border border-red-200 rounded-xl p-5">
                  <h3 className="text-xs font-medium text-red-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Concerns
                  </h3>
                  <ul className="space-y-2">
                    {c.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1 shrink-0">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reasons for Support & Objection — side by side */}
          {(supports.length > 0 || objections.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {supports.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="h-3.5 w-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                      </svg>
                    </span>
                    Potential Reasons for Support
                  </h3>
                  <div className="space-y-3">
                    {supports.map((sup) => (
                      <div key={sup.id} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-sm font-medium text-slate-800">{sup.support_reason}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sup.ai_rationalisation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {objections.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-3.5 w-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                      </svg>
                    </span>
                    Potential Grounds for Objection
                  </h3>
                  <div className="space-y-3">
                    {objections.map((obj) => (
                      <div key={obj.id} className="bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-sm font-medium text-slate-800">{obj.objection}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{obj.ai_rationalisation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 font-medium">AI analysis pending</p>
            <p className="text-xs text-slate-400 mt-1">
              This application hasn't been analysed yet. Check back later for impact scores, pros/cons, and potential reasons for support or objection.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

function Fact({ label, value, highlight }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-purple-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}

function ScoreCard({ label, value, color, description }) {
  if (value == null) return null
  const pct = (value / 10) * 100
  const colors = {
    red: { bar: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
    blue: { bar: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-lg font-bold ${c.text}`}>{value}<span className="text-xs font-normal text-slate-400">/10</span></span>
      </div>
      <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-2">{description}</p>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default PlanningCase
