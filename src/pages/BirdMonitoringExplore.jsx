import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons for Leaflet in bundled environments
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const API_BASE = 'https://api.smartplymouth.org/api/bird-monitoring/v1.0'

function BirdMonitoringExplore() {
  const [sites, setSites] = useState([])
  const [sightings, setSightings] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSite, setSelectedSite] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchSites()
  }, [])

  useEffect(() => {
    fetchSightings()
  }, [selectedSite, fromDate, toDate, page])

  async function fetchSites() {
    try {
      const res = await fetch(`${API_BASE}/sites`)
      if (!res.ok) throw new Error('Failed to fetch sites')
      const data = await res.json()
      setSites(data.sites)
    } catch (err) {
      setError(err.message)
    }
  }

  async function fetchSightings() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), per_page: '25' })
      if (selectedSite) params.set('site_id', selectedSite)
      if (fromDate) params.set('from_date', fromDate)
      if (toDate) params.set('to_date', toDate)

      const res = await fetch(`${API_BASE}/sightings?${params}`)
      if (!res.ok) throw new Error('Failed to fetch sightings')
      const data = await res.json()
      setSightings(data.sightings)
      setPagination({ page: data.page, pages: data.pages, total: data.total })
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function validateDateRange(from, to) {
    if (!from || !to) {
      setDateError('')
      return
    }
    const fromMs = new Date(from).getTime()
    const toMs = new Date(to).getTime()
    if (toMs < fromMs) {
      setDateError('To date must be after from date')
      return
    }
    const diffDays = (toMs - fromMs) / (1000 * 60 * 60 * 24)
    if (diffDays > 31) {
      setDateError('Date range must not exceed 31 days')
      return
    }
    setDateError('')
  }

  function handleFromDateChange(value) {
    setFromDate(value)
    validateDateRange(value, toDate)
    setPage(1)
  }

  function handleToDateChange(value) {
    setToDate(value)
    validateDateRange(fromDate, value)
    setPage(1)
  }

  function clearDateFilter() {
    setFromDate('')
    setToDate('')
    setDateError('')
    setPage(1)
  }

  function formatConfidence(confidence) {
    return `${Math.round(confidence * 100)}%`
  }

  function formatDateTime(datetime) {
    const date = new Date(datetime)
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getSiteName(siteId) {
    const site = sites.find((s) => s.site_id === siteId)
    return site ? site.name : siteId
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm text-green-600 hover:underline">← Dashboard</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-700 font-medium">Bird Monitoring</span>
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Bird Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore bird sightings detected by BirdNET-Pi devices across Plymouth
        </p>
      </div>

      {/* Sites overview — two-column: list + map */}
      {sites.length > 0 && (
        <div className="bg-white border border-green-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 flex items-center gap-2">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2 className="text-sm font-semibold text-white">Monitoring Sites</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left column — site list */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-96 border-r border-green-100">
              {sites.map((site) => (
                <div
                  key={site.site_id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedSite === site.site_id
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-green-300 hover:bg-green-50/30'
                  }`}
                  onClick={() => {
                    setSelectedSite(selectedSite === site.site_id ? '' : site.site_id)
                    setPage(1)
                  }}
                >
                  <p className="text-sm font-medium text-slate-800">{site.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{site.type}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>

            {/* Right column — map */}
            <div className="h-96">
              <MapContainer
                center={[
                  sites.reduce((sum, s) => sum + s.latitude, 0) / sites.length,
                  sites.reduce((sum, s) => sum + s.longitude, 0) / sites.length,
                ]}
                zoom={12}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {sites.map((site) => (
                  <Marker
                    key={site.site_id}
                    position={[site.latitude, site.longitude]}
                    eventHandlers={{
                      click: () => {
                        setSelectedSite(selectedSite === site.site_id ? '' : site.site_id)
                        setPage(1)
                      },
                    }}
                  >
                    <Popup>
                      <div>
                        <p className="font-medium text-sm">{site.name}</p>
                        <p className="text-xs text-slate-500">{site.type}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* Sightings table */}
      <div className="bg-white border border-green-200 rounded-lg shadow-sm overflow-hidden">
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
            <h2 className="text-sm font-semibold text-white">Sightings</h2>
          </div>
          <span className="text-[11px] text-green-100">
            {pagination.total} total {(selectedSite || fromDate || toDate) && '(filtered)'}
          </span>
        </div>

        {/* Date filter */}
        <div className="px-4 py-3 border-b border-green-100 bg-green-50/30 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="from-date" className="block text-[11px] font-medium text-green-700 uppercase tracking-wide mb-1">From</label>
            <input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="px-2 py-1 text-sm border border-green-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="to-date" className="block text-[11px] font-medium text-green-700 uppercase tracking-wide mb-1">To</label>
            <input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="px-2 py-1 text-sm border border-green-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {(fromDate || toDate) && (
            <button
              onClick={clearDateFilter}
              className="px-2 py-1 text-xs font-medium text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
            >
              Clear dates
            </button>
          )}
          {dateError && (
            <p className="text-xs text-red-600">{dateError}</p>
          )}
        </div>

        {error && (
          <div className="px-4 py-3">
            <p className="text-sm text-red-600">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="px-4 py-6 flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin text-green-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-sm text-slate-500">Loading sightings…</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-100 bg-green-50/50">
                  <th className="text-left font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700">Species</th>
                  <th className="text-left font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700">Site</th>
                  <th className="text-right font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700 w-24">Confidence</th>
                  <th className="text-right font-medium px-4 py-2 text-[11px] uppercase tracking-wide text-green-700 w-40">Detected</th>
                </tr>
              </thead>
              <tbody>
                {sightings.map((sighting) => {
                  let confidenceColor = 'text-slate-600'
                  if (sighting.confidence >= 0.8) confidenceColor = 'text-green-700 font-semibold'
                  else if (sighting.confidence >= 0.5) confidenceColor = 'text-amber-600 font-medium'

                  return (
                    <tr
                      key={sighting.sighting_id}
                      className="border-b border-green-50 last:border-0 hover:bg-green-50/40"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full shrink-0 bg-green-500" />
                          <span className="font-medium text-slate-800">{sighting.species.common_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{getSiteName(sighting.site_id)}</td>
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
                    <td colSpan="4" className="px-4 py-6 text-center text-slate-400 text-sm">
                      No sightings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-green-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 text-xs font-medium rounded border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="px-3 py-1 text-xs font-medium rounded border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BirdMonitoringExplore
