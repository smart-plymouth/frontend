import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'
const PER_PAGE = 25

function PlanningModal({ dateRange, onClose }) {
  const [allCases, setAllCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    fetchAllCases()
  }, [])

  async function fetchAllCases() {
    setLoading(true)
    try {
      let collected = []
      let currentPage = 1
      let totalPages = 1

      while (currentPage <= totalPages) {
        const res = await fetch(
          `${API_BASE}/cases?validated_from=${dateRange.from}&validated_to=${dateRange.to}&page=${currentPage}&per_page=100`
        )
        if (!res.ok) throw new Error('Failed to fetch planning cases')
        const data = await res.json()
        collected = collected.concat(data.cases)
        totalPages = data.pages
        currentPage++
      }

      setAllCases(collected)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCases = useMemo(() => {
    if (!filter.trim()) return allCases
    const term = filter.toLowerCase()
    return allCases.filter((c) =>
      c.reference.toLowerCase().includes(term) ||
      c.address.toLowerCase().includes(term) ||
      c.proposal.toLowerCase().includes(term) ||
      c.status.toLowerCase().includes(term)
    )
  }, [allCases, filter])

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / PER_PAGE))
  const paginatedCases = filteredCases.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1)
  }, [filter])

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '0.5rem', width: '100%', maxWidth: '48rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Planning Applications</h3>
            <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
              {new Date(dateRange.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              {' – '}
              {new Date(dateRange.to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}{filteredCases.length} application{filteredCases.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.25rem', backgroundColor: 'transparent', border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', flexShrink: 0 }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Filter */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by postcode, address, keyword…"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', outline: 'none', color: '#334155' }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '0 1.25rem 1rem', flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <p style={{ fontSize: '0.8125rem', color: '#64748b', paddingTop: '1rem' }}>Loading applications…</p>
          ) : error ? (
            <p style={{ fontSize: '0.8125rem', color: '#dc2626', paddingTop: '1rem' }}>Error: {error}</p>
          ) : paginatedCases.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: '#64748b', paddingTop: '1rem' }}>No applications found.</p>
          ) : (
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.6875rem', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.6875rem', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.6875rem', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proposal</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.6875rem', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCases.map((c) => (
                  <tr key={c.reference} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap', fontWeight: 500 }}>
                      <a
                        href={`https://planning.plymouth.gov.uk/online-applications/simpleSearchResults.do?action=firstPage&searchType=Application&searchCriteria.simpleSearchString=${encodeURIComponent(c.reference)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4f46e5', textDecoration: 'none' }}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {c.reference}
                      </a>
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', color: '#475569', maxWidth: '12rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.address}>{c.address}</td>
                    <td style={{ padding: '0.625rem 0.75rem', color: '#475569', maxWidth: '16rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.proposal}>{c.proposal}</td>
                    <td style={{ padding: '0.625rem 0.75rem', color: '#475569', whiteSpace: 'nowrap' }}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '0.75rem 1.25rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{ fontSize: '0.75rem', color: page <= 1 ? '#cbd5e1' : '#4f46e5', background: 'none', border: 'none', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{ fontSize: '0.75rem', color: page >= totalPages ? '#cbd5e1' : '#4f46e5', background: 'none', border: 'none', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default PlanningModal
