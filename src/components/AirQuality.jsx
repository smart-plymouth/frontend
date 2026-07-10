import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/air-quality/v1.0'

// DEFRA DAQI breakpoints — based on 24-hour mean concentrations (µg/m³)
const DAQI_BREAKPOINTS = {
  'PM2.5': [
    { low: 0, high: 11, index: 1 },
    { low: 12, high: 23, index: 2 },
    { low: 24, high: 35, index: 3 },
    { low: 36, high: 41, index: 4 },
    { low: 42, high: 47, index: 5 },
    { low: 48, high: 53, index: 6 },
    { low: 54, high: 58, index: 7 },
    { low: 59, high: 64, index: 8 },
    { low: 65, high: 70, index: 9 },
    { low: 71, high: Infinity, index: 10 },
  ],
  'PM10': [
    { low: 0, high: 16, index: 1 },
    { low: 17, high: 33, index: 2 },
    { low: 34, high: 50, index: 3 },
    { low: 51, high: 58, index: 4 },
    { low: 59, high: 66, index: 5 },
    { low: 67, high: 75, index: 6 },
    { low: 76, high: 83, index: 7 },
    { low: 84, high: 91, index: 8 },
    { low: 92, high: 100, index: 9 },
    { low: 101, high: Infinity, index: 10 },
  ],
}

function getPollutantIndex(pollutant, value) {
  const breakpoints = DAQI_BREAKPOINTS[pollutant]
  if (!breakpoints) return null
  for (const bp of breakpoints) {
    if (value >= bp.low && value <= bp.high) return bp.index
  }
  return 10
}

function getDAQIBand(daqi) {
  if (daqi === null) return { label: 'Unknown', bg: 'bg-slate-50', text: 'text-slate-600' }
  if (daqi <= 3) return { label: 'Excellent', bg: 'bg-green-50', text: 'text-green-700' }
  if (daqi <= 6) return { label: 'Good', bg: 'bg-blue-50', text: 'text-blue-700' }
  if (daqi <= 8) return { label: 'Average', bg: 'bg-amber-50', text: 'text-amber-700' }
  return { label: 'Poor', bg: 'bg-red-50', text: 'text-red-700' }
}

function getPollutantColor(pollutant, value) {
  const index = getPollutantIndex(pollutant, value)
  if (index === null) return 'text-slate-700'
  if (index <= 3) return 'text-green-600'
  if (index <= 6) return 'text-blue-600'
  if (index <= 8) return 'text-amber-600'
  return 'text-red-600'
}

function AirQuality() {
  const [daqi, setDaqi] = useState(null)
  const [band, setBand] = useState(null)
  const [pm25Mean, setPm25Mean] = useState(null)
  const [pm10Mean, setPm10Mean] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 300000) // refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      // Fetch last 24 hours of readings across all sites
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const fromDate = yesterday.toISOString().split('T')[0]
      const toDate = now.toISOString().split('T')[0]

      // Fetch all pages of readings from the last 24 hours
      const allReadings = []
      let currentPage = 1
      let totalPages = 1

      while (currentPage <= totalPages) {
        const res = await fetch(
          `${API_BASE}/readings?from_date=${fromDate}&to_date=${toDate}&per_page=100&page=${currentPage}`
        )
        if (!res.ok) throw new Error('Failed to fetch air quality data')
        const data = await res.json()
        allReadings.push(...data.readings)
        totalPages = data.pages
        currentPage++
      }

      // Filter to only readings within the last 24 hours
      const cutoff = now.getTime() - 24 * 60 * 60 * 1000
      const recent = allReadings.filter((r) => new Date(r.datetime).getTime() >= cutoff)

      // Calculate 24-hour mean for PM2.5 and PM10
      const pm25Values = []
      const pm10Values = []

      for (const reading of recent) {
        for (const metric of reading.metrics) {
          if (metric.pollutant === 'PM2.5') pm25Values.push(metric.value)
          if (metric.pollutant === 'PM10') pm10Values.push(metric.value)
        }
      }

      const pm25Avg = pm25Values.length > 0
        ? pm25Values.reduce((sum, v) => sum + v, 0) / pm25Values.length
        : null
      const pm10Avg = pm10Values.length > 0
        ? pm10Values.reduce((sum, v) => sum + v, 0) / pm10Values.length
        : null

      setPm25Mean(pm25Avg)
      setPm10Mean(pm10Avg)

      // DAQI is the highest index from PM2.5 and PM10 24-hour means
      const pm25Index = pm25Avg !== null ? getPollutantIndex('PM2.5', pm25Avg) : null
      const pm10Index = pm10Avg !== null ? getPollutantIndex('PM10', pm10Avg) : null

      const indices = [pm25Index, pm10Index].filter((i) => i !== null)
      const score = indices.length > 0 ? Math.max(...indices) : null

      setDaqi(score)
      setBand(getDAQIBand(score))
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link to="/air-quality" className="block group">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col justify-between group-hover:shadow-md group-hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center">
              <svg className="h-4.5 w-4.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-700">Air Quality</h2>
          </div>
          {lastUpdated && (
            <span className="text-[11px] text-slate-400">
              Last updated: {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="flex-1 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">Unavailable</p>
          ) : (
            <div className="w-full flex items-center justify-between">
              <div>
                {band && (
                  <p className={`text-2xl font-bold ${band.text}`}>
                    {band.label}
                  </p>
                )}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">{daqi ?? '–'}</span>
                  <span className="text-xs text-slate-400">/ 10 DAQI</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className={`text-sm font-semibold tabular-nums ${pm25Mean !== null ? getPollutantColor('PM2.5', pm25Mean) : 'text-slate-700'}`}>
                    {pm25Mean !== null ? pm25Mean.toFixed(1) : '–'}
                  </p>
                  <p className="text-[11px] text-slate-400">PM2.5 µg/m³</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold tabular-nums ${pm10Mean !== null ? getPollutantColor('PM10', pm10Mean) : 'text-slate-700'}`}>
                    {pm10Mean !== null ? pm10Mean.toFixed(1) : '–'}
                  </p>
                  <p className="text-[11px] text-slate-400">PM10 µg/m³</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">DEFRA Air Quality Data</span>
          <span className="text-xs text-sky-600 font-medium group-hover:translate-x-0.5 transition-transform">Explore data →</span>
        </div>
      </div>
    </Link>
  )
}

export default AirQuality
