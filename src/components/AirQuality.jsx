import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.smartplymouth.org/api/air-quality/v1.0'

// AQI breakpoints based on UK DAQI (Daily Air Quality Index) simplified bands
// Each pollutant maps value ranges (µg/m³) to index scores 1-10
const AQI_BREAKPOINTS = {
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
  'NO2': [
    { low: 0, high: 67, index: 1 },
    { low: 68, high: 134, index: 2 },
    { low: 135, high: 200, index: 3 },
    { low: 201, high: 267, index: 4 },
    { low: 268, high: 334, index: 5 },
    { low: 335, high: 400, index: 6 },
    { low: 401, high: 467, index: 7 },
    { low: 468, high: 534, index: 8 },
    { low: 535, high: 600, index: 9 },
    { low: 601, high: Infinity, index: 10 },
  ],
  'O3': [
    { low: 0, high: 33, index: 1 },
    { low: 34, high: 66, index: 2 },
    { low: 67, high: 100, index: 3 },
    { low: 101, high: 120, index: 4 },
    { low: 121, high: 140, index: 5 },
    { low: 141, high: 160, index: 6 },
    { low: 161, high: 187, index: 7 },
    { low: 188, high: 213, index: 8 },
    { low: 214, high: 240, index: 9 },
    { low: 241, high: Infinity, index: 10 },
  ],
  'SO2': [
    { low: 0, high: 88, index: 1 },
    { low: 89, high: 177, index: 2 },
    { low: 178, high: 266, index: 3 },
    { low: 267, high: 354, index: 4 },
    { low: 355, high: 443, index: 5 },
    { low: 444, high: 532, index: 6 },
    { low: 533, high: 710, index: 7 },
    { low: 711, high: 887, index: 8 },
    { low: 888, high: 1064, index: 9 },
    { low: 1065, high: Infinity, index: 10 },
  ],
}

function getPollutantIndex(pollutant, value) {
  const breakpoints = AQI_BREAKPOINTS[pollutant]
  if (!breakpoints) return null
  for (const bp of breakpoints) {
    if (value >= bp.low && value <= bp.high) return bp.index
  }
  return 10
}

function calculateAQI(metrics) {
  const indices = metrics
    .map((m) => getPollutantIndex(m.pollutant, m.value))
    .filter((i) => i !== null)

  if (indices.length === 0) return null
  // AQI is the maximum sub-index across all pollutants
  return Math.max(...indices)
}

function getAQIBand(aqi) {
  if (aqi === null) return { label: 'Unknown', color: 'slate', bg: 'bg-slate-50', text: 'text-slate-600' }
  if (aqi <= 3) return { label: 'Excellent', color: 'green', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' }
  if (aqi <= 6) return { label: 'Good', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' }
  if (aqi <= 8) return { label: 'Average', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' }
  return { label: 'Poor', color: 'red', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' }
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
  const [aqi, setAqi] = useState(null)
  const [band, setBand] = useState(null)
  const [pm25, setPm25] = useState(null)
  const [pm10, setPm10] = useState(null)
  const [readingTime, setReadingTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 300000) // refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(
        `${API_BASE}/readings?from_date=${today}&to_date=${today}&per_page=1`
      )
      if (!res.ok) throw new Error('Failed to fetch air quality data')
      const data = await res.json()

      if (data.readings && data.readings.length > 0) {
        const latest = data.readings[0]
        const score = calculateAQI(latest.metrics)
        setAqi(score)
        setBand(getAQIBand(score))
        setReadingTime(new Date(latest.datetime))

        const pm25Metric = latest.metrics.find((m) => m.pollutant === 'PM2.5')
        const pm10Metric = latest.metrics.find((m) => m.pollutant === 'PM10')
        setPm25(pm25Metric ? pm25Metric.value : null)
        setPm10(pm10Metric ? pm10Metric.value : null)
      } else {
        setAqi(null)
        setBand(getAQIBand(null))
        setPm25(null)
        setPm10(null)
      }
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
          {readingTime && (
            <span className="text-[11px] text-slate-400">
              Last updated: {readingTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
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
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">{aqi ?? '–'}</span>
                  <span className="text-xs text-slate-400">/ 10 DAQI</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className={`text-sm font-semibold tabular-nums ${pm25 !== null ? getPollutantColor('PM2.5', pm25) : 'text-slate-700'}`}>
                    {pm25 !== null ? pm25.toFixed(1) : '–'}
                  </p>
                  <p className="text-[11px] text-slate-400">PM2.5 µg/m³</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold tabular-nums ${pm10 !== null ? getPollutantColor('PM10', pm10) : 'text-slate-700'}`}>
                    {pm10 !== null ? pm10.toFixed(1) : '–'}
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
