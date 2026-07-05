import { Link } from 'react-router-dom'

export default function Phase10Campaign() {
  return (
    <div className="min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 -mb-8">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEwzMCA2ME0wIDMwTDYwIDMwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Say No To <br/>Saltram Meadows Phase 10
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
            Phase 10 of the Saltram Meadows development borders and in our opinion threatens three ecologically and historically significant sites that sit on our doorstep.
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
                Saltram is a Grade I listed Georgian estate set within approximately 180 hectares of 18th-century landscaped parkland on the banks of the Plym Estuary. The Parker family shaped the estate from the 1740s, and it has been managed by the National Trust since 1957. It is one of the most significant heritage landscapes in Devon. The estate's setting and sense of place depend on the surrounding landscape remaining sympathetic to its historic character. Saltram Meadows Phase 10 would introduce modern housing visible from within the parkland, permanently diminishing the rural backdrop and tranquillity of a landscape visited by hundreds of thousands of people each year.
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
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Leasehold Scandal in Early Phases</h4>
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
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Life-Threatening Fire Safety Defects</h4>
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
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Heritage Monument Lost — Lime Kiln Stone</h4>
                <p className="text-sm text-slate-600 mt-1 text-justify">A planning condition required the stone from a heritage lime kiln on the site to be salvaged and reused within the development. Drawings were submitted by Persimmon showing how the stone would be incorporated, and the condition was formally discharged by Plymouth City Council on the basis of those drawings. However, both Plymouth City Council and Persimmon are now unable to locate the drawings, and the stone itself is nowhere to be seen on the estate. A heritage asset has effectively been destroyed with no accountability, raising serious questions about whether planning conditions imposed on Phase 10 — particularly those protecting nearby ecological and heritage sites — would be honoured any differently. An enforcement case (26/00127/ENF) has been opened to investigate what happened to the stone.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://democracy.plymouth.gov.uk/documents/s27610/0%20Officers%20Report.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Officer's Report — Planning Condition (8.4.7)
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Resident Reviews Indicate Poor Quality and Lack of Community Amenities</h4>
                <p className="text-sm text-slate-600 mt-1 text-justify">Across 40 resident reviews on HomeViews, Saltram Meadow scores poorly for facilities, design and management — ranking 10th out of 11 developments in Devon. Residents consistently describe an estate that prioritises housing density over community, lacking adequate green space, play areas, local shops, and communal facilities proportionate to the number of homes built. Alongside this, homeowners report snagging issues that take months to resolve, poor-quality finishes, and drainage problems. The pattern of feedback paints a picture of a developer focused on maximising units rather than delivering quality homes or a genuine community — raising serious doubts about what Phase 10 would bring to an area bordering irreplaceable wildlife and heritage sites.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href="https://www.homeviews.com/development/saltram-meadow-pl9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    HomeViews — Saltram Meadow Resident Reviews (3.4/5)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related planning applications */}
      <section className="bg-white py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Planning Applications</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            These are the live planning applications associated with Phase 10 of the Saltram Meadows development.
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
          <p className="text-red-100 text-lg mb-10 leading-relaxed">
            The planning process gives every resident a voice. Use yours. Object to Phase 10 and help protect the wildlife and heritage on our doorstep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-left">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-semibold text-white mb-1">Submit an Objection</h4>
              <p className="text-sm text-red-100">Write to Plymouth City Council's planning department with your concerns about the impact on protected sites.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-left">
              <div className="text-2xl mb-2">📣</div>
              <h4 className="font-semibold text-white mb-1">Spread the Word</h4>
              <p className="text-sm text-red-100">Share this page with neighbours and community groups. The more voices, the greater the impact on the decision.</p>
            </div>
          </div>

          <a
            href="https://planning.plymouth.gov.uk/online-applications/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-red-800 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
          >
            Visit the Planning Portal
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
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
