import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PolicyReferences from '../components/PolicyTooltip'

const API_BASE = 'https://api.smartplymouth.org/api/planning/v1.0'

function EmailSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | conflict
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch(`${API_BASE}/phaseten_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.status === 201) {
        setStatus('success')
        setEmail('')
      } else if (res.status === 409) {
        setStatus('conflict')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Unable to connect. Please check your internet connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-lg mx-auto">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-white font-semibold">You're registered!</p>
        <p className="text-sm text-red-100 mt-1">We'll email you as soon as the reserved matters application is submitted.</p>
      </div>
    )
  }

  if (status === 'conflict') {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-lg mx-auto">
        <div className="text-3xl mb-2">👍</div>
        <p className="text-white font-semibold">Already registered</p>
        <p className="text-sm text-red-100 mt-1">This email address is already on our notification list. We'll be in touch when the application is submitted.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-lg mx-auto">
      <h4 className="font-semibold text-white text-lg mb-2">Get Notified</h4>
      <p className="text-sm text-red-100 mb-4 text-left leading-relaxed">
        Register your email address to be notified when the reserved matters application for Saltram Meadow Phase 10 is submitted. Your email address will not be shared with any third parties and will be used solely by Smart Plymouth for the purpose of sending three notification emails:
      </p>
      <ul className="text-sm text-red-100 mb-4 text-left space-y-1 list-disc list-inside">
        <li>When the reserved matters application is submitted by the applicant</li>
        <li>A reminder to submit an objection 7 days before the public comments expiry date</li>
        <li>A final reminder 3 days before the expiry date</li>
      </ul>
      <p className="text-sm text-red-100 mb-5 text-left leading-relaxed">
        After these three emails have been sent, your email address will be securely erased from the Smart Plymouth system.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="phase10-email" className="sr-only">Email address</label>
        <input
          id="phase10-email"
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
          className="flex-1 px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-6 py-3 bg-white text-red-800 font-bold rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Registering…' : 'Notify Me'}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-sm text-red-200 mt-3">{errorMsg}</p>
      )}
    </div>
  )
}

export default function Phase10Campaign() {
  useEffect(() => {
    document.title = 'Say No To Saltram Meadow Phase 10'
  }, [])

  return (
    <div className="min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 -mb-8">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEwzMCA2ME0wIDMwTDYwIDMwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Say No To <br/>Saltram Meadow Phase 10
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Persimmon Homes must not be allowed to build next to irreplaceable wildlife habitats and heritage landscapes. Our community is standing together to oppose Phase 10.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#take-action"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-900 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
            >
              Take Action Now
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#why-it-matters"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section id="why-it-matters" className="bg-white py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Why This Matters</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Phase 10 of the Saltram Meadow development borders and in our opinion threatens three ecologically and historically significant sites that sit on our doorstep.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Billacombe Green */}
            <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                🌷
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Billacombe Green</h3>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full mb-3">
                Site of Special Scientific Interest
              </span>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                Billacombe Green comprises approximately 10 hectares across eight fields of species-rich unimproved neutral, base-rich and calcareous grassland — classified as Lowland Meadow Priority Habitat. This is one of the rarest grassland types in England, with over 97% lost since the 1930s. The site supports a rich assemblage of wildflowers, butterflies and invertebrates that depend on this undisturbed habitat. SSSIs are designated under the Wildlife &amp; Countryside Act 1981 and receive the highest level of conservation protection in the UK. Any development adjacent to an SSSI risks pollution run-off, increased disturbance, light and noise impacts, and long-term habitat fragmentation that cannot be reversed.
              </p>
            </div>

            {/* Pomphlett Plantation */}
            <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                🌳
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pomphlett Plantation</h3>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full mb-3">
                County Wildlife Site
              </span>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                Pomphlett Plantation is a designated County Wildlife Site — a recognition of its special nature value as a woodland habitat supporting a rich community of species. The plantation provides vital ecological corridors for bats, badgers, nesting birds such as woodpeckers and nuthatches, and a diverse understory of native flora. County Wildlife Sites receive no statutory legal protection, unlike SSSIs, meaning they are particularly vulnerable to damage from adjacent development. Construction activity brings noise, vibration, artificial lighting and dust, while the long-term increase in domestic pets, footfall and run-off from hard surfaces degrades woodland edges and disturbs breeding wildlife. Once fragmented, these ecological connections cannot easily be restored.
              </p>
            </div>

            {/* Saltram / National Trust */}
            <div className="bg-gradient-to-b from-sky-50 to-white border border-sky-200 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                🏰
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Saltram House & Parkland</h3>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-sky-100 text-sky-800 rounded-full mb-3">
                Heritage Landscape
              </span>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                Saltram is a Grade I listed Georgian estate set within approximately 180 hectares of 18th-century landscaped parkland on the banks of the Plym Estuary. The Parker family shaped the estate from the 1740s, and it has been managed by the National Trust since 1957. It is one of the most significant heritage landscapes in Devon. The estate's setting and sense of place depend on the surrounding landscape remaining sympathetic to its historic character. Saltram Meadow Phase 10 would introduce modern housing visible from within the parkland, permanently diminishing the rural backdrop and tranquillity of a landscape visited by hundreds of thousands of people each year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Track record */}
      <section className="bg-slate-50 py-16 px-6 sm:px-10 lg:px-16 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Persimmon's Track Record</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            This isn't about being anti-development. It's about holding a developer accountable whose history raises serious questions about whether they can be trusted next to sensitive environments.
          </p>

          <div className="space-y-4">
            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Leasehold Scandal in Early Phases</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 mt-1 text-justify">Early phases of Saltram Meadow were sold on leasehold tenure with RPI-linked ground rent review terms and unreasonable estate service charges that escalated without meaningful transparency or resident control. Homeowners found themselves locked into long leases with ongoing costs they had not anticipated, making properties harder to sell and burdening residents with charges for estate maintenance they had little say over. The issue caused such concern locally that Sir Gary Streeter, then Conservative MP for South West Devon, took up the cause on behalf of his Plymstock constituents, publicly challenging Persimmon's practices and pressing for fairer terms. The controversy at Saltram Meadow formed part of the wider national leasehold scandal that ultimately led to the CMA launching enforcement action against Persimmon in 2020 for possible mis-selling of leasehold homes. More recent phases are sold as freehold but still retain the service charges and restrictive covenants disadvantaging home owners, a practice nicknamed "fleecehold".</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/persimmon-homes-told-return-freeholds-3331660" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Persimmon Told to Return Freeholds
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/plymouth-trading-standards-investigation-persimmon-3407368" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Trading Standards Investigation
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/truth-buying-new-build-freehold-3376240" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Truth About New Build Freehold
                  </a>
                  <a href="https://www.gov.uk/government/news/leasehold-homes-cma-launches-enforcement-action" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    CMA Enforcement Action (2020)
                  </a>
                  <a href="https://www.gov.uk/government/news/cma-secures-landmark-commitments-for-leaseholders" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    CMA Commitments Secured (2021)
                  </a>
                </div>
              </div>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Life-Threatening Fire Safety Defects</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 mt-1 text-justify">In existing phases at Saltram Meadow, fire barriers were found to be missing from properties after residents themselves pushed for inspections. Persimmon initially told Saltram Meadow homeowners they were unaffected, but when individual residents arranged checks, missing barriers were discovered. Persimmon then committed to inspecting all 200 homes on the estate. The exact number of affected properties has not been publicly disclosed. Nationally, a BBC investigation found missing fire barriers at 37% of homes on another Persimmon estate, and an independent review concluded that the absence of cavity barriers represented an "intolerable" fire risk and a breach of building regulations.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/persimmon-re-inspecting-hundreds-plymouth-2760919" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Re-inspecting Hundreds of Plymouth Homes
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/persimmon-homes-admits-dangerous-missing-2816785" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Persimmon Admits Dangerous Missing Barriers
                  </a>
                  <a href="https://www.bbc.com/news/business-48113301" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    BBC Investigation
                  </a>
                  <a href="https://www.bbc.co.uk/news/business-50827576" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    BBC — Independent Review
                  </a>
                </div>
              </div>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Heritage Monument Lost — Lime Kiln Stone</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 mt-1 text-justify">A planning condition required the stone from a heritage lime kiln on the site to be salvaged and reused within the development. Drawings were submitted by Persimmon showing how the stone would be incorporated, and the condition was formally discharged by Plymouth City Council on the basis of those drawings. However, both Plymouth City Council and Persimmon are now unable to locate the drawings, and the stone itself is nowhere to be seen on the estate. A heritage asset has effectively been destroyed with no accountability, raising serious questions about whether planning conditions imposed on Phase 10 — particularly those protecting nearby ecological and heritage sites — would be honoured any differently. An enforcement case (26/00127/ENF) has been opened to investigate what happened to the stone.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://democracy.plymouth.gov.uk/documents/s27610/0%20Officers%20Report.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Officer's Report — Planning Condition (8.4.7)
                  </a>
                </div>
              </div>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Resident Reviews Indicate Poor Quality and Lack of Community Amenities</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 mt-1 text-justify">Across 40 resident reviews on HomeViews, Saltram Meadow scores poorly for facilities, design and management — ranking 10th out of 11 developments in Devon. Residents consistently describe an estate that prioritises housing density over community, lacking adequate green space, play areas, local shops, and communal facilities proportionate to the number of homes built. Alongside this, homeowners report snagging issues that take months to resolve, poor-quality finishes, and drainage problems. The pattern of feedback paints a picture of a developer focused on maximising units rather than delivering quality homes or a genuine community — raising serious doubts about what Phase 10 would bring to an area bordering irreplaceable wildlife and heritage sites.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.homeviews.com/development/saltram-meadow-pl9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    HomeViews — Saltram Meadow Resident Reviews (3.4/5)
                  </a>
                </div>
              </div>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Premature Clearance of Site Prior to Ecological Survey</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 text-justify">The ecological report submitted with the Phase 9 Reserved Matters application (26/00381/REM) openly admits that Section 41 priority habitat on the site was cleared before an ecological survey could be carried out. Section 41 habitats are those identified as being of principal importance for the conservation of biodiversity in England under the Natural Environment and Rural Communities Act 2006. Clearing such habitat before survey makes it impossible to assess what species or ecological value has been lost, and represents a serious failure of environmental due diligence. This matter is now the subject of enforcement case 26/00173/ENF. The precedent this sets for Phase 10 — which borders an SSSI and a County Wildlife Site — is deeply concerning.</p>
              </div>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Ordered to Stop Work for Breaching Planning Conditions</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 text-justify">In December 2017, Plymouth City Council issued a Temporary Stop Notice on the Saltram Meadow development after Persimmon repeatedly failed to stop construction work past 1pm on Saturdays and Sundays — a condition of their planning permission. Despite being asked to comply, Persimmon continued working outside permitted hours until the council was forced to formally intervene. A Freedom of Information request later revealed that the council had to contact Persimmon on numerous occasions throughout 2018 over continued out-of-hours working, culminating in a Community Protection Warning being issued in September 2018. This demonstrates a pattern of treating planning conditions as optional rather than binding, adding to concerns that any conditions attached to Phase 10 would be similarly disregarded.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/major-plymouth-developments-builders-were-1040962" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Builders Ordered to Stop Work
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/housebuilder-warned-again-breaking-building-2295627" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Warned AGAIN for Breaking Rules
                  </a>
                </div>
              </div>
            </details>

            <details className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="p-5 flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 flex-1">Antisocial Behaviour and Fly-Tipping on the Estate</h4>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-0 ml-12">
                <p className="text-sm text-slate-600 text-justify">The Saltram Meadow estate and its immediate surroundings have become persistent fly-tipping hotspots, attracting dumped vehicles, household waste, and drug use. The site has also been targeted by intruders and has suffered arson attacks on properties under construction. Residents describe the situation as a "nightmare" and say the problem has been ongoing for years with inadequate action to resolve it. Separately, homeowners on the estate have reported feeling unsafe due to antisocial behaviour, with one resident telling the Herald she was considering moving house over the issues. The failure to manage the environment on and around the development raises questions about what impact further expansion into Phase 10 would have on an area already under strain — particularly one bordering sensitive ecological sites that cannot tolerate this kind of degradation.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/smashed-up-ice-cream-van-11043043" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Fly-Tip Hotspot Near Saltram Meadow
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/plymouth-woman-considering-moving-house-5901986" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Resident Considering Moving House
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/investigation-after-fire-destroys-new-842006" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Fire Destroys New Build
                  </a>
                  <a href="https://www.plymouthherald.co.uk/news/plymouth-news/intruders-repeatedly-target-plymouth-building-10062952" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Herald — Intruders Repeatedly Target Building Site
                  </a>
                  <a href="https://news.devon-cornwall.police.uk/news-article/a0bfde87-9e3c-f011-9d7b-6045bdd24049" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Devon &amp; Cornwall Police
                  </a>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>
      <section className="bg-white py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Planning Applications</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            These are the live planning applications associated with Phase 10 of the Saltram Meadow development.
          </p>

          <div className="space-y-4">
            <Link
              to="/planning/26%2F00893%2FMJR"
              className="block bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">26/00893/MJR</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                  Pre-Application
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Pre Application Advice for Reserved Matters Application for Phase 10
              </p>
            </Link>

            <Link
              to="/planning/26%2F00890%2FERS103"
              className="block bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">26/00890/ERS103</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">
                  EIA Screening
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Environmental Impact Assessment Screening Opinion for Phase 10
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section id="take-action" className="bg-gradient-to-br from-red-700 to-red-900 text-white py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Take Action</h2>
          <p className="text-red-100 text-lg mb-6 leading-relaxed">
            The reserved matters application for Phase 10 has not yet been submitted to Plymouth City Council. Register your email address below and we will notify you the moment it is submitted so you can act quickly to object.
          </p>

          <EmailSignup />

        </div>
      </section>

      {/* Reasons to object */}
      <section className="bg-white py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Reasons to Object</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            When submitting your objection, the following are material planning considerations that carry weight in the decision-making process.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Impact on Adjacent Wildlife Sites</h4>
              <p className="text-sm text-slate-600">Development adjacent to Billacombe Green SSSI and Pomphlett Plantation County Wildlife Site risks pollution run-off, habitat fragmentation, and disturbance to legally protected species. Increased noise, artificial lighting, domestic pets, and footfall from new housing would degrade these sites and sever ecological corridors connecting them.</p>
              <PolicyReferences policies="NPPF Paragraph 186, Item a; NPPF Paragraph 187; NPPF Paragraph 192, Items a–d; JLP Policy SPT12; JLP Policy DEV26" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Harm to the Setting of Saltram</h4>
              <p className="text-sm text-slate-600">Modern housing visible from within the Grade I listed Saltram parkland would harm the heritage significance and visual character of this National Trust landscape.</p>
              <PolicyReferences policies="NPPF Paragraph 205; NPPF Paragraph 208; NPPF Paragraph 212, Item a; JLP Policy SPT11; JLP Policy DEV21" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Developer's Track Record</h4>
              <p className="text-sm text-slate-600">Persimmon's history of breaching planning conditions, clearing habitat before survey, and losing heritage assets on this very estate demonstrates they cannot be trusted to comply with ecological protections.</p>
              <PolicyReferences policies="NPPF Paragraph 11, Item d; NPPF Paragraph 44; JLP Policy DEV1" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Inadequate Infrastructure</h4>
              <p className="text-sm text-slate-600">Local roads, schools, and medical services are already under significant pressure from earlier phases. The road network serving the site — including Billacombe Road and Pomphlett Road — is at capacity during peak hours, and there is a lack of suitable bus routes or other public transport provision serving the estate. Phase 10 would add further demand without adequate upgrades to highways, transport links, or community services.</p>
              <PolicyReferences policies="NPPF Paragraph 114, Items a–b; NPPF Paragraph 115; NPPF Paragraph 116; JLP Policy SPT9; JLP Policy DEV31; JLP Policy DEV32" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Biodiversity Loss and Net Gain</h4>
              <p className="text-sm text-slate-600">The premature clearance of Section 41 priority habitat on Phase 9 — now under enforcement investigation — sets a dangerous precedent. Under the Environment Act 2021, developments must deliver a minimum 10% biodiversity net gain, yet Persimmon's track record of clearing habitat before ecological survey provides no confidence this requirement would be genuinely met rather than circumvented.</p>
              <PolicyReferences policies="NPPF Paragraph 186, Item d; NPPF Paragraph 189, Item a; NPPF Paragraph 190; JLP Policy SPT12; JLP Policy DEV26, Item 5" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Overdevelopment and Density</h4>
              <p className="text-sm text-slate-600">The estate already prioritises housing numbers over community amenities. Further high-density development would compound existing problems with lack of green space and facilities.</p>
              <PolicyReferences policies="NPPF Paragraph 131; NPPF Paragraph 135, Items a, c; JLP Policy DEV20; JLP Policy SPT3, Item 3" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Environmental Impact Assessment</h4>
              <p className="text-sm text-slate-600">Given the proximity to an SSSI, a County Wildlife Site, and a heritage landscape, a full Environmental Impact Assessment should be required — not screened out.</p>
              <PolicyReferences policies="NPPF Paragraph 11, Item b; NPPF Paragraph 186; Town and Country Planning (Environmental Impact Assessment) Regulations 2017, Schedule 2" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Lack of Cumulative Impact Assessment</h4>
              <p className="text-sm text-slate-600">Other major developments in the area — such as Sherford — are adding significant burden to local infrastructure. Phase 10 has not been assessed cumulatively alongside these projects, meaning the true combined impact on roads, schools, and services is not being properly considered.</p>
              <PolicyReferences policies="NPPF Paragraph 11, Item b; NPPF Paragraph 116, Item b; JLP Policy SPT1; JLP Policy SPT2" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Scale and Character Out of Keeping</h4>
              <p className="text-sm text-slate-600">The scale and style of the proposed development does not conform to the neighbouring 1920s and 1930s bungalows of Colesdown Hill. The introduction of high-density modern housing would be visually incongruous and harmful to the established residential character of the area.</p>
              <PolicyReferences policies="NPPF Paragraph 135, Items b–c; NPPF Paragraph 139, Item a; JLP Policy DEV20, Items 1–4; JLP Policy DEV23" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Drainage and Flood Risk</h4>
              <p className="text-sm text-slate-600">Residents on existing phases already report drainage problems. Further development on greenfield land increases impermeable surface area, raising the risk of surface water flooding and pollution run-off into adjacent watercourses and the nearby SSSI.</p>
              <PolicyReferences policies="NPPF Paragraph 173; NPPF Paragraph 175; NPPF Paragraph 180, Item a; JLP Policy DEV35; JLP Policy DEV37" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Designing Out Crime</h4>
              <p className="text-sm text-slate-600">The estate already suffers from antisocial behaviour, fly-tipping, arson, and drug use. The layout and design of Phase 10 must demonstrate how it would avoid creating further secluded areas, poor natural surveillance, and the conditions that have enabled crime and disorder on earlier phases.</p>
              <PolicyReferences policies="NPPF Paragraph 135, Item f; JLP Policy DEV20, Item 8; JLP Policy DEV10" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Loss of Public Access and Recreation Space</h4>
              <p className="text-sm text-slate-600">The Phase 10 land is currently used as amenity space by local residents for walking between Billacombe Road, Colesdown Hill and Wixenford, as well as for recreational purposes including dog walking and exercise. Its loss would remove a valued green corridor connecting neighbouring communities.</p>
              <PolicyReferences policies="NPPF Paragraph 96; NPPF Paragraph 103, Item b; JLP Policy DEV3; JLP Policy DEV27" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Construction Phase Impacts on Protected Sites</h4>
              <p className="text-sm text-slate-600">Vibration, dust, and temporary drainage during the construction phase itself — not just the permanent development — could directly harm the adjacent SSSI and County Wildlife Site. Persimmon's repeated breaches of Construction Environmental Management Plans on earlier phases provide no confidence these risks would be properly managed.</p>
              <PolicyReferences policies="NPPF Paragraph 192, Item c; NPPF Paragraph 193; JLP Policy DEV26; JLP Policy DEV2" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Noise and Light Pollution on Wildlife</h4>
              <p className="text-sm text-slate-600">Permanent residential lighting and noise from 200+ homes adjacent to the SSSI and CWS would disrupt nocturnal species including legally protected bats, owls, and invertebrates. Light spill is a recognised cause of habitat degradation and behavioural disruption in sensitive ecological areas.</p>
              <PolicyReferences policies="NPPF Paragraph 192, Item d; NPPF Paragraph 191; JLP Policy DEV2; JLP Policy DEV26, Item 3" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Air Quality</h4>
              <p className="text-sm text-slate-600">Increased vehicle movements from additional homes would worsen localised air pollution. Nitrogen deposition from traffic is a known threat to species-rich calcareous grasslands like those at Billacombe Green, potentially degrading the very habitats the SSSI designation is meant to protect.</p>
              <PolicyReferences policies="NPPF Paragraph 191; NPPF Paragraph 192, Item d; JLP Policy DEV2, Item 4; JLP Policy DEV26" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Residential Amenity of Existing Residents</h4>
              <p className="text-sm text-slate-600">Properties on Colesdown Hill, Billacombe Road, and Wixenford that currently back onto open land would suffer overlooking, loss of privacy, and loss of outlook. The transition from open green space to a built-up housing estate would significantly diminish the residential amenity these homes have enjoyed for decades.</p>
              <PolicyReferences policies="NPPF Paragraph 135, Item f; NPPF Paragraph 139, Item c; JLP Policy DEV1; JLP Policy DEV20, Item 5" />
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="bg-white py-8 px-6 sm:px-10 lg:px-16 text-center">
        <Link
          to="/planning"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Planning Applications
        </Link>
      </section>
    </div>
  )
}
