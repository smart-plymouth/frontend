import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LocationModal from '../components/LocationModal.jsx'

const API_BASE = 'https://api.smartplymouth.org/api/emergency-wait-times/v1.0'

function EmergencyWaitTimesPage() {
  const [locations, setLocations] = useState([])
  const [waitTimes, setWaitTimes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

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
      setLocations(locs)

      const waitTimeEntries = await Promise.all(
        locs.map(async (loc) => {
          const res = await fetch(`${API_BASE}/locations/${loc.id}/wait-times`)
          if (!res.ok) return [loc.id, null]
          const data = await res.json()
          return [loc.id, data.length > 0 ? data[0] : null]
        })
      )

      setWaitTimes(Object.fromEntries(waitTimeEntries))
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

  const latestTimestamp = Object.values(waitTimes).reduce((latest, wt) => {
    if (!wt) return latest
    const ts = new Date(wt.timestamp)
    return ts > latest ? ts : latest
  }, new Date(0))

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link to="/hud" className="hover:text-blue-900 hover:underline">Dashboard</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Emergency Wait Times</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Emergency Department Wait Times</h1>
          <p className="text-sm text-slate-500 mt-1">
            Live waiting times across Plymouth's emergency and urgent care locations.
          </p>
        </div>
        {latestTimestamp.getTime() > 0 && (
          <p className="text-xs text-slate-500">
            Last updated {latestTimestamp.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Content */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin text-teal-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-slate-500">Loading wait times…</p>
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left font-medium px-4 py-3 text-[11px] uppercase tracking-wide text-slate-600">Location</th>
                <th className="text-right font-medium px-4 py-3 text-[11px] uppercase tracking-wide text-slate-600 w-32">Longest Wait</th>
                <th className="text-right font-medium px-4 py-3 text-[11px] uppercase tracking-wide text-slate-600 w-36">Patients Waiting</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => {
                const wt = waitTimes[location.id]
                const hasData = wt !== null
                const minutes = hasData ? wt.longest_wait : null

                let dotColor = 'bg-slate-300'
                if (minutes !== null) {
                  if (minutes > 120) dotColor = 'bg-red-500'
                  else if (minutes > 60) dotColor = 'bg-amber-500'
                  else dotColor = 'bg-emerald-500'
                }

                return (
                  <tr
                    key={location.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor}`} />
                        <span className="font-medium text-slate-800 truncate">{location.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {hasData ? (
                        <span className="font-semibold text-slate-900">{formatWait(wt.longest_wait)}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {hasData ? (
                        <span className="text-slate-600">{wt.patients_waiting}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <a
              href="https://www.plymouthhospitals.nhs.uk/urgent-waiting-times/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
            >
              Source: Plymouth Hospitals NHS Trust
            </a>
          </div>
        </div>
      )}

      {selectedLocation && (
        <LocationModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />
      )}
    </div>
  )
}

export default EmergencyWaitTimesPage
