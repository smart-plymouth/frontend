import { useState, useEffect } from 'react'
import LocationModal from './LocationModal.jsx'

const API_BASE = 'https://api.smartplymouth.org/api/emergency-wait-times/v1.0'

function EmergencyWaitTimes() {
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

  function handleRowClick(location) {
    setSelectedLocation(location)
  }

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-slate-500">Loading wait times…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-red-600">Error: {error}</p>
      </div>
    )
  }

  function formatWait(m) {
    const h = Math.floor(m / 60)
    const rem = m % 60
    return h > 0 ? `${h}h ${rem}m` : `${m}m`
  }

  // Find the most recent timestamp across all wait times
  const latestTimestamp = Object.values(waitTimes).reduce((latest, wt) => {
    if (!wt) return latest
    const ts = new Date(wt.timestamp)
    return ts > latest ? ts : latest
  }, new Date(0))

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Emergency Wait Times</h2>
        {latestTimestamp.getTime() > 0 && (
          <span className="text-[11px] text-slate-400">
            Last updated {latestTimestamp.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-slate-400">Location</th>
            <th className="text-right font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-slate-400 w-28">Longest Wait</th>
            <th className="text-right font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-slate-400 w-32">Patients Waiting</th>
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
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer"
                onClick={() => handleRowClick(location)}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
                    <span className="font-medium text-slate-800 truncate">{location.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {hasData ? (
                    <span className="font-semibold text-slate-900">{formatWait(wt.longest_wait)}</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
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

      {selectedLocation && (
        <LocationModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />
      )}
    </div>
  )
}

export default EmergencyWaitTimes
