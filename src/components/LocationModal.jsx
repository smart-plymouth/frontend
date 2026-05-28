import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_BASE = 'https://api.smartplymouth.org/api/emergency-wait-times/v1.0'

const typeLabels = {
  emergency_department: 'Emergency Department',
  urgent_treatment_centre: 'Urgent Treatment Centre',
  minor_injuries_unit: 'Minor Injuries Unit',
}

function LocationModal({ location, onClose }) {
  const lat = location.longitude
  const lon = location.latitude
  const [history, setHistory] = useState([])
  const [latestWait, setLatestWait] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(true)

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
    async function fetchHistory() {
      try {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)

        const params = new URLSearchParams({
          start: start.toISOString(),
          end: end.toISOString(),
        })

        const res = await fetch(`${API_BASE}/locations/${location.id}/wait-times?${params}`)
        if (!res.ok) throw new Error('Failed to fetch history')
        const data = await res.json()

        // Most recent entry is first in the response
        if (data.length > 0) {
          setLatestWait(data[0])
        }

        const chartData = data.map((entry) => ({
          timestamp: new Date(entry.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          longestWait: Math.round(entry.longest_wait / 60 * 10) / 10,
          patientsWaiting: entry.patients_waiting,
        })).reverse()

        setHistory(chartData)
      } catch (err) {
        setHistory([])
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [location.id])

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '0.5rem', width: '100%', maxWidth: '40rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{location.name}</h3>
            <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '0.125rem 0 0 0' }}>
              {typeLabels[location.type] || location.type}
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

        {/* Map */}
        <div style={{ width: '100%', height: '16rem', backgroundColor: '#f1f5f9' }}>
          <iframe
            title={`Map of ${location.name}`}
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.008},${lat - 0.005},${lon + 0.008},${lat + 0.005}&layer=mapnik&marker=${lat},${lon}`}
          />
        </div>

        {/* Current stats */}
        {latestWait && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <StatCard
              label="Longest Wait"
              value={formatWaitTime(latestWait.longest_wait)}
            />
            <StatCard
              label="Patients Waiting"
              value={latestWait.patients_waiting}
            />
            <StatCard
              label="Patients In Department"
              value={latestWait.patients_in_department}
            />
          </div>
        )}

        {/* Details */}
        <div style={{ padding: '1.25rem' }}>
          <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', margin: 0 }}>
            <div>
              <dt style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</dt>
              <dd style={{ color: '#334155', marginTop: '0.125rem', marginLeft: 0 }}>{location.address}</dd>
            </div>

            {location.opening_times && (
              <div>
                <dt style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Opening Times</dt>
                <dd style={{ color: '#334155', marginTop: '0.125rem', marginLeft: 0 }}>{location.opening_times}</dd>
              </div>
            )}

            {location.telephone_number && (
              <div>
                <dt style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telephone</dt>
                <dd style={{ marginTop: '0.125rem', marginLeft: 0 }}>
                  <a href={`tel:${location.telephone_number}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {location.telephone_number}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Wait time history chart */}
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.75rem 0' }}>Wait Time History (Last 30 Days)</h4>
            {historyLoading ? (
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>Loading chart…</p>
            ) : history.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>No historical data available.</p>
            ) : (
              <div style={{ width: '100%', height: '12rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                      formatter={(value) => [`${value}h`, 'Longest Wait']}
                    />
                    <Line
                      type="monotone"
                      dataKey="longestWait"
                      stroke="#2563eb"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function formatWaitTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function StatCard({ label, value }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '0.875rem 1rem', textAlign: 'center' }}>
      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{value}</p>
      <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.25rem 0 0 0' }}>{label}</p>
    </div>
  )
}

export default LocationModal
