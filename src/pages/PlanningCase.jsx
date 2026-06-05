import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'

function PlanningCase() {
  const { reference } = useParams()
  const [planningCase, setPlanningCase] = useState(null)
  const [objections, setObjections] = useState([])
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

      // Fetch objections if AI analysis is complete
      if (data.ai_analysis) {
        fetchObjections()
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
      // Objections are non-critical, silently ignore errors
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <svg className="h-5 w-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm text-slate-500">Loading planning case…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-sm text-red-600">Error: {error}</p>
        <Link to="/" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">← Back to Dashboard</Link>
      </div>
    )
  }

  if (!planningCase) return null

  const c = planningCase

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">← Dashboard</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-500">Planning</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-700 font-medium">{c.reference}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">{c.reference}</h1>
            <p className="text-sm text-indigo-100 mt-1">{c.address}</p>
          </div>
          <a
            href={`https://planning.plymouth.gov.uk/online-applications/simpleSearchResults.do?action=firstPage&searchType=Application&searchCriteria.simpleSearchString=${encodeURIComponent(c.reference)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white rounded hover:bg-indigo-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View on Planning Portal
          </a>
        </div>

        <div className="p-6 space-y-6">
          {/* Proposal */}
          <div>
            <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Proposal</h2>
            <p className="text-sm text-slate-800">{c.proposal}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DetailCard label="Status" value={c.status} />
            <DetailCard label="Received" value={c.received_date || '—'} />
            <DetailCard label="Validated" value={c.validated_date || '—'} />
            <DetailCard label="AI Analysis" value={c.ai_analysis ? 'Complete' : 'Pending'} />
          </div>

          {/* AI Analysis Section */}
          {c.ai_analysis && (
            <div className="border border-purple-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center gap-2">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" />
                  <path d="M17.8 11.8 19 13" /><path d="M15 9h0" /><path d="M17.8 6.2 19 5" />
                  <path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" />
                </svg>
                <h2 className="text-sm font-semibold text-white">AI Analysis</h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                  <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div className="text-xs text-amber-800 leading-relaxed space-y-1">
                    <p className="font-semibold">AI Disclaimer</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>AI can make mistakes and may produce inaccurate information.</li>
                      <li>AI-generated content should not be treated as an authoritative source.</li>
                      <li>All AI content should be fact-checked before being used in any official complaint or objection.</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ScoreDisplay
                    label="Potential Impact"
                    value={c.potential_impact_score}
                    color="#ef4444"
                    description="How much impact this development may have on the surrounding area"
                  />
                  <ScoreDisplay
                    label="Estimated Size"
                    value={c.estimated_size}
                    color="#3b82f6"
                    description="The estimated scale of the proposed development"
                  />
                </div>

                {c.tags && c.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}



                {(c.pros?.length > 0 || c.cons?.length > 0) && (
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Pros &amp; Cons</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {c.pros?.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Pros
                          </h4>
                          <ul className="space-y-1.5">
                            {c.pros.map((pro, idx) => (
                              <li key={idx} className="text-sm text-green-800 flex items-start gap-1.5">
                                <span className="text-green-500 mt-0.5 shrink-0">•</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {c.cons?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h4 className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Cons
                          </h4>
                          <ul className="space-y-1.5">
                            {c.cons.map((con, idx) => (
                              <li key={idx} className="text-sm text-red-800 flex items-start gap-1.5">
                                <span className="text-red-500 mt-0.5 shrink-0">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {objections.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Potential Grounds for Objection</h3>
                    <div className="space-y-3">
                      {objections.map((obj) => (
                        <div key={obj.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-red-800">{obj.objection}</p>
                          <p className="text-xs text-red-600 mt-1 leading-relaxed">{obj.ai_rationalisation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!c.ai_analysis && (
            <div className="border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-500">AI analysis has not yet been completed for this application.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  )
}

function ScoreDisplay({ label, value, color, description }) {
  if (value == null) return null
  const pct = (value / 10) * 100
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value}/10</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1">{description}</p>
    </div>
  )
}

export default PlanningCase
