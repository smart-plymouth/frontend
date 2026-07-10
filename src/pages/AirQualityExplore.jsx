import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_BASE = 'https://api.smartplymouth.org/api/air-quality/v1.0'

const POLLUTANT_COLORS = {
  'PM1': '#7c3aed',
  'PM2.5': '#9333ea',
  'PM10': '#ea580c',
  'NO2': '#e11d48',
  'NOx': '#dc2626',
  'O3': '#0284c7',
  'SO2': '#d97706',
}

function formatDateForInput(date) {
  return date.toISOString().split('T')[0]
}

function AirQualityExplore() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return formatDateForInput(d)
  })
  const [toDate, setToDate] = useState(() => formatDateForInput(new Date()))
  const [chartData, setChartData] = useState([])
  const [pollutants, setPollutants] = useState([])
  const [loading, setLoading] = useState(false)
  const [sitesLoading, setSitesLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    fetchSites()
  }, [])

  useEffect(() => {
    if (selectedSite && !dateError) {
      fetchReadings()
    }
  }, [selectedSite, fromDate, toDate])

  async function fetchSites() {
    setSitesLoading(true)
    try {
      const res = await fetch(`${API_BASE}/sites`)
      if (!res.ok) throw new Error('Failed to fetch sites')
      const data = await res.json()
      setSites(data.sites)
    } catch (err) {
      setError(err.message)
    } finally {
      setSitesLoading(false)
    }
  }

  async function fetchReadings() {
    setLoading(true)
    setError(null)
    try {
      const allReadings = []
      let currentPage = 1
      let totalPages = 1

      while (currentPage <= totalPages) {
        const params = new URLSearchParams({
          site_id: selectedSite,
          from_date: fromDate,
          to_date: toDate,
          page: currentPage.toString(),
          per_page: '100',
        })

        const res = await fetch(`${API_BASE}/readings?${params}`)
        if (!res.ok) throw new Error('Failed to fetch readings')
        const data = await res.json()
        allReadings.push(...data.readings)
        totalPages = data.pages
        currentPage++
      }

      // Transform readings into chart data
      const pollutantSet = new Set()
      const transformed = allReadings
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
        .map((reading) => {
          const point = {
            time: new Date(reading.datetime).getTime(),
            label: new Date(reading.datetime).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
          for (const metric of reading.metrics) {
            point[metric.pollutant] = metric.value
            pollutantSet.add(metric.pollutant)
          }
          return point
        })

      setPollutants([...pollutantSet].sort())
      setChartData(transformed)
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
  }

  function handleToDateChange(value) {
    setToDate(value)
    validateDateRange(fromDate, value)
  }

  function getSiteName(siteId) {
    const site = sites.find((s) => s.site_id === siteId)
    return site ? site.name : ''
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/hud" className="text-slate-400 hover:text-slate-600 transition-colors">Dashboard</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-slate-700 font-medium">Air Quality</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Air Quality</h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore air quality monitoring data across Plymouth
          </p>
        </div>
        <a
          href="https://uk-air.defra.gov.uk/data/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
        >
          DEFRA Air Quality Data ↗
        </a>
      </div>

      {/* Controls */}
      <div className="bg-white border border-sky-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-sky-600 to-sky-700 flex items-center gap-2">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h2 className="text-sm font-semibold text-white">Select Site &amp; Date Range</h2>
        </div>
        <div className="p-4 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="site-select" className="block text-[11px] font-medium text-sky-700 uppercase tracking-wide mb-1">Site</label>
            {sitesLoading ? (
              <div className="flex items-center gap-2 py-1">
                <svg className="h-4 w-4 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-sm text-slate-400">Loading sites…</span>
              </div>
            ) : (
              <select
                id="site-select"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Choose a monitoring site…</option>
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>{site.name}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="from-date" className="block text-[11px] font-medium text-sky-700 uppercase tracking-wide mb-1">From</label>
            <input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="to-date" className="block text-[11px] font-medium text-sky-700 uppercase tracking-wide mb-1">To</label>
            <input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          {dateError && (
            <p className="text-xs text-red-600 self-center">{dateError}</p>
          )}
        </div>
      </div>

      {/* Chart area */}
      <div className="bg-white border border-sky-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-sky-600 to-sky-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <h2 className="text-sm font-semibold text-white">
              {selectedSite ? `Readings — ${getSiteName(selectedSite)}` : 'Readings'}
            </h2>
          </div>
          {chartData.length > 0 && (
            <span className="text-[11px] text-sky-100">{chartData.length} data points</span>
          )}
        </div>

        <div className="p-4" style={{ minHeight: '400px' }}>
          {!selectedSite ? (
            <div className="h-80 flex flex-col items-center justify-center text-slate-400">
              <svg className="h-12 w-12 mb-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <p className="text-sm font-medium">Select a monitoring site to view data</p>
              <p className="text-xs mt-1">Choose a site above and the chart will appear here</p>
            </div>
          ) : loading ? (
            <div className="h-80 flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-500">Loading readings…</span>
            </div>
          ) : error ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-sm text-red-500">Error: {error}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-slate-400">
              <p className="text-sm font-medium">No readings found</p>
              <p className="text-xs mt-1">Try adjusting the date range</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'µg/m³', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                {pollutants.map((p) => (
                  <Line
                    key={p}
                    type="monotone"
                    dataKey={p}
                    stroke={POLLUTANT_COLORS[p] || '#6b7280'}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default AirQualityExplore
