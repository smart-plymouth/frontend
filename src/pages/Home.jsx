function Home() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900">
          Smart Plymouth
        </h1>
        <p className="text-lg text-slate-600 mt-4">
          An open-source project building a smart city ecosystem for Plymouth — bringing together open data, Internet of Things sensors, and AI to strengthen civic capabilities and improve everyday life.
        </p>
      </div>

      {/* What we do */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">What we're building</h2>
        <p className="text-slate-600 leading-relaxed">
          Smart Plymouth is a community-driven, open-source initiative that connects real-time data streams, IoT infrastructure, and intelligent analysis to help residents, councils, and local organisations make better-informed decisions. We believe civic technology should be transparent, collaborative, and freely available to everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900">Open Data</h3>
            <p className="text-sm text-slate-500 mt-1">
              Aggregating publicly available datasets — planning applications, environmental monitoring, transport, and more — into a single, accessible platform.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-900 rounded-lg flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900">Internet of Things</h3>
            <p className="text-sm text-slate-500 mt-1">
              Deploying and integrating low-cost sensors across the city to capture real-time information on air quality, noise, footfall, and wildlife activity.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="w-10 h-10 bg-violet-100 text-violet-900 rounded-lg flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5m-4.75-11.396c.251.023.501.05.75.082M5 14.5l-1.703 4.258A1.125 1.125 0 0 0 4.348 20.5h15.304a1.125 1.125 0 0 0 1.051-1.742L19 14.5" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900">AI &amp; Analysis</h3>
            <p className="text-sm text-slate-500 mt-1">
              Applying machine learning and intelligent automation to surface patterns, predict demand, and help the city respond faster to emerging issues.
            </p>
          </div>
        </div>
      </div>

      {/* Open source CTA */}
      <div className="max-w-3xl mx-auto bg-slate-100 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Open source &amp; community-led</h3>
        <p className="text-slate-600 mt-2 text-sm max-w-xl mx-auto">
          All of our code, data pipelines, and documentation are freely available on GitHub. We welcome contributions from developers, data scientists, urbanists, and anyone passionate about making Plymouth smarter together.
        </p>
        <a
          href="https://github.com/smart-plymouth"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}

export default Home
