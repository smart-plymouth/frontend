import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/bird-monitoring/v1.0'

function BirdMonitoring() {
  const [sightings, setSightings] = useState([])
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const [sightingsRes, sitesRes] = await Promise.all([
        fetch(`${API_BASE}/sightings?per_page=5`),
        fetch(`${API_BASE}/sites`),
      ])
      if (!sightingsRes.ok) throw new Error('Failed to fetch bird detections')
      if (!sitesRes.ok) throw new Error('Failed to fetch sites')
      const sightingsData = await sightingsRes.json()
      const sitesData = await sitesRes.json()
      setSightings(sightingsData.sightings)
      setSites(sitesData.sites)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getSiteName(siteId) {
    const site = sites.find((s) => s.site_id === siteId)
    return site ? site.name : siteId
  }

  function formatConfidence(confidence) {
    return `${Math.round(confidence)}%`
  }

  function formatDateTime(datetime) {
    const date = new Date(datetime)
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm flex items-center gap-2">
        <svg className="h-4 w-4 animate-spin text-green-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm text-slate-500">Loading bird detections…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-green-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 7h.01" />
            <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
            <path d="m20 7 2 .5-2 .5" />
            <path d="M10 18v3" />
            <path d="M14 17.75V21" />
            <path d="M7 18a6 6 0 0 0 3.84-10.61" />
          </svg>
          <h2 className="text-sm font-semibold text-white">Bird Monitoring</h2>
        </div>
        <span className="text-[11px] text-green-100">Last 5 detections</span>
      </div>

      <table className="w-full text-sm table-fixed flex-1">
        <thead>
          <tr className="border-b border-green-100 bg-green-50/50">
            <th className="text-left font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700">Species</th>
            <th className="text-left font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700">Site</th>
            <th className="text-right font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700 w-24">Confidence</th>
            <th className="text-right font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700 w-32">Detected</th>
          </tr>
        </thead>
        <tbody>
          {sightings.map((sighting) => {
            let confidenceColor = 'text-slate-600'
            if (sighting.confidence >= 80) confidenceColor = 'text-green-700 font-semibold'
            else if (sighting.confidence >= 70) confidenceColor = 'text-amber-600 font-medium'
            else confidenceColor = 'text-red-600 font-medium'

            return (
              <tr
                key={sighting.sighting_id}
                className="border-b border-green-50 last:border-0 hover:bg-green-50/40"
              >
                <td className="px-4 py-2.5">
                  <span className="font-medium text-slate-800 truncate">{sighting.species.common_name}</span>
                </td>
                <td className="px-4 py-2.5 text-slate-600 truncate">
                  {getSiteName(sighting.site_id)}
                </td>
                <td className={`px-4 py-2.5 text-right whitespace-nowrap ${confidenceColor}`}>
                  {formatConfidence(sighting.confidence)}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap text-slate-600">
                  {formatDateTime(sighting.datetime)}
                </td>
              </tr>
            )
          })}
          {sightings.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-slate-400 text-sm">
                No recent detections
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="px-4 py-2 border-t border-green-100 mt-auto flex items-center justify-between">
        <a
          href="https://github.com/Nachtzuster/BirdNET-Pi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-green-600 hover:text-green-800 hover:underline"
        >
          Source: Local Contributors running BirdNET-Pi
        </a>
        <Link
          to="/bird-monitoring"
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
        >
          Explore
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default BirdMonitoring
