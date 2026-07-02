import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'

function markdownToHtml(md) {
  if (!md) return ''
  // Strip wrapping code fences (```markdown ... ```) the LLM sometimes adds
  let html = md
    .replace(/^```(?:markdown)?\s*\n?/i, '')
    .replace(/\n?```\s*$/, '')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr/>')
    // Line breaks → paragraphs
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)(?:<br\/>(<li>))/g, '$1$2')
  html = html.replace(/((?:<li>.*?<\/li>(?:<br\/>)?)+)/g, '<ul>$1</ul>')
  // Clean stray <br/> inside <ul>
  html = html.replace(/<ul>(.*?)<\/ul>/gs, (match) => match.replace(/<br\/>/g, ''))

  return `<p>${html}</p>`
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-3]>)/g, '$1')
    .replace(/(<\/h[1-3]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<hr\/>)<\/p>/g, '$1')
}

function PlanningCase() {
  const { reference } = useParams()
  const [planningCase, setPlanningCase] = useState(null)
  const [objections, setObjections] = useState([])
  const [supports, setSupports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Letter generation state
  const [letterModalOpen, setLetterModalOpen] = useState(false)
  const [letterForm, setLetterForm] = useState({ first_name: '', last_name: '', letter_type: 'objection' })
  const [letterLoading, setLetterLoading] = useState(false)
  const [letterStreaming, setLetterStreaming] = useState(false)
  const [letterError, setLetterError] = useState(null)
  const [generatedLetter, setGeneratedLetter] = useState(null)
  const [letterMeta, setLetterMeta] = useState(null)
  const [letterCopied, setLetterCopied] = useState(false)

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

  async function generateLetter() {
    setLetterLoading(true)
    setLetterStreaming(false)
    setLetterError(null)
    setGeneratedLetter('')
    setLetterMeta(null)

    try {
      const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(reference)}/generate-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letterForm),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate letter')
      }

      setLetterLoading(false)
      setLetterStreaming(true)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event:')) {
            var eventType = line.slice(6).trim()
          } else if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim()
            if (!dataStr) continue

            try {
              if (eventType === 'token') {
                const token = JSON.parse(dataStr)
                setGeneratedLetter((prev) => prev + token)
              } else if (eventType === 'done') {
                const meta = JSON.parse(dataStr)
                setLetterMeta(meta)
                setLetterStreaming(false)
              } else if (eventType === 'error') {
                const errObj = JSON.parse(dataStr)
                setLetterError(errObj.error || 'An error occurred during generation')
                setLetterStreaming(false)
              }
            } catch {
              // Ignore malformed JSON chunks
            }
          }
        }
      }

      setLetterStreaming(false)
    } catch (err) {
      setLetterError(err.message)
      setLetterLoading(false)
      setLetterStreaming(false)
    }
  }

  function openLetterModal() {
    setLetterForm({ first_name: '', last_name: '', letter_type: 'objection' })
    setLetterError(null)
    setGeneratedLetter(null)
    setLetterMeta(null)
    setLetterCopied(false)
    setLetterStreaming(false)
    setLetterModalOpen(true)
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
            <div className="flex items-center gap-2 shrink-0">
              {c.ai_analysis && (
                <button
                  onClick={openLetterModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Generate Letter
                </button>
              )}
              <a
                href={`https://planning.plymouth.gov.uk/online-applications/simpleSearchResults.do?action=firstPage&searchType=Application&searchCriteria.simpleSearchString=${encodeURIComponent(c.reference)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
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

      {/* ─── LETTER GENERATION MODAL ─── */}
      {letterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLetterModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Generate Objection / Support Letter</h2>
              <button
                onClick={() => setLetterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* AI Accuracy Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">AI-generated content — please review before submitting</p>
                  <p className="mt-1 text-xs text-amber-700">
                    This letter is generated by AI and may contain inaccuracies or misrepresentations. You should carefully review and edit the content before sending it to the council. Do not submit without checking the facts are correct and the letter accurately represents your views.
                  </p>
                </div>
              </div>

              {/* Donation message */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                <svg className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <div className="text-sm text-purple-800">
                  <p className="font-medium">Support this project</p>
                  <p className="mt-1 text-xs text-purple-700">
                    AI features are costly to run. If you find this tool useful, any support is greatly appreciated.{' '}
                    <a href="https://buymeacoffee.com/robputt" target="_blank" rel="noopener noreferrer" className="font-medium underline">
                      Buy me a coffee
                    </a>
                  </p>
                </div>
              </div>

              {!generatedLetter && !letterStreaming ? (
                <>
                  {/* Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input
                          id="first_name"
                          type="text"
                          value={letterForm.first_name}
                          onChange={(e) => setLetterForm({ ...letterForm, first_name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Jane"
                        />
                      </div>
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input
                          id="last_name"
                          type="text"
                          value={letterForm.last_name}
                          onChange={(e) => setLetterForm({ ...letterForm, last_name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Smith"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Your Stance</label>
                      <div className="flex gap-3">
                        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${letterForm.letter_type === 'objection' ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                          <input
                            type="radio"
                            name="letter_type"
                            value="objection"
                            checked={letterForm.letter_type === 'objection'}
                            onChange={(e) => setLetterForm({ ...letterForm, letter_type: e.target.value })}
                            className="sr-only"
                          />
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                          </svg>
                          <span className="text-sm font-medium">Objection</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${letterForm.letter_type === 'support' ? 'border-green-300 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                          <input
                            type="radio"
                            name="letter_type"
                            value="support"
                            checked={letterForm.letter_type === 'support'}
                            onChange={(e) => setLetterForm({ ...letterForm, letter_type: e.target.value })}
                            className="sr-only"
                          />
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                          </svg>
                          <span className="text-sm font-medium">Support</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {letterError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">{letterError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setLetterModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={generateLetter}
                      disabled={letterLoading || !letterForm.first_name.trim() || !letterForm.last_name.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {letterLoading && (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      )}
                      {letterLoading ? 'Connecting…' : 'Generate Letter'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Streaming / Generated Letter Display */}
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${letterForm.letter_type === 'objection' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {letterForm.letter_type === 'objection' ? 'Objection' : 'Support'} Letter
                      </span>
                      {letterStreaming && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600">
                          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Writing…
                        </span>
                      )}
                    </div>
                    <div
                      className="px-8 py-6 text-[15px] leading-relaxed text-slate-800 break-words letter-content"
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(generatedLetter) }}
                    />
                    {letterStreaming && (
                      <div className="px-8 pb-4">
                        <span className="inline-block w-1.5 h-5 bg-indigo-500 animate-pulse rounded-sm" />
                      </div>
                    )}
                  </div>

                  {letterError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">{letterError}</p>
                    </div>
                  )}

                  {/* Copy Letter + Email Instructions — shown only when streaming is complete */}
                  {!letterStreaming && generatedLetter && (
                    <>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const html = markdownToHtml(generatedLetter)
                            const blob = new Blob([html], { type: 'text/html' })
                            const plainBlob = new Blob([generatedLetter], { type: 'text/plain' })
                            navigator.clipboard.write([
                              new ClipboardItem({
                                'text/html': blob,
                                'text/plain': plainBlob,
                              })
                            ]).then(() => {
                              setLetterCopied(true)
                              setTimeout(() => setLetterCopied(false), 2000)
                            })
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {letterCopied ? (
                            <>
                              <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              Copy Letter
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex gap-3">
                        <svg className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <div className="text-sm text-indigo-800">
                          <p className="font-medium">How to submit</p>
                          <p className="mt-1 text-xs text-indigo-700">
                            Copy the letter above and email it to{' '}
                            <a href="mailto:planningconsents@plymouth.gov.uk" className="font-medium underline">
                              planningconsents@plymouth.gov.uk
                            </a>
                            . Include the planning reference <strong>{c.reference}</strong> in your email subject line.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => { setGeneratedLetter(null); setLetterMeta(null); setLetterError(null); }}
                      disabled={letterStreaming}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setLetterModalOpen(false)}
                      disabled={letterStreaming}
                      className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
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
