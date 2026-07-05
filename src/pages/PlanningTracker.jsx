import { useState } from 'react'
import { Link } from 'react-router-dom'
import contacts from '../../data/contacts.json'
import cases from '../../data/cases.json'

function PlanningTracker() {
  const [activeTab, setActiveTab] = useState('cases')
  const [campaignFilter, setCampaignFilter] = useState('')

  const campaigns = [...new Set(cases.map((c) => c.campaign))].sort()
  const filteredCases = campaignFilter
    ? cases.filter((c) => c.campaign === campaignFilter)
    : cases

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/hud" className="text-slate-400 hover:text-slate-600 transition-colors">Dashboard</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <Link to="/planning" className="text-slate-400 hover:text-slate-600 transition-colors">Planning</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-slate-700 font-medium">Tracker</span>
      </nav>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Planning Case Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">
          Contacts and tracked planning cases for active campaigns
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'cases'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Planning Cases
            <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              {cases.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Contacts
            <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              {contacts.length}
            </span>
          </button>
        </div>
      </div>

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {/* Campaign filter */}
          <div className="flex items-center gap-3">
            <label htmlFor="campaign-filter" className="text-sm font-medium text-slate-600">Campaign:</label>
            <select
              id="campaign-filter"
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign} value={campaign}>{campaign}</option>
              ))}
            </select>
            <span className="text-xs text-slate-400">
              {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Cases table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Reference</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Campaign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        {c.reference !== 'PENDING' ? (
                          <Link
                            to={`/planning/${encodeURIComponent(c.reference)}`}
                            className="text-indigo-600 font-medium hover:underline"
                          >
                            {c.reference}
                          </Link>
                        ) : (
                          <span className="text-amber-600 font-medium">{c.reference}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColor(c.type)}`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-md">
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.description}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.campaign}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Organisation</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Telephone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((contact, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{contact.name}</td>
                    <td className="px-4 py-3 text-slate-600">{contact.position}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{contact.organisation}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {contact.telephone !== 'Unknown' ? (
                        <a href={`tel:${contact.telephone}`} className="text-indigo-600 hover:underline">
                          {contact.telephone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function typeColor(type) {
  switch (type) {
    case 'Enforcement': return 'bg-red-50 text-red-700'
    case 'Reserved Matters': return 'bg-blue-50 text-blue-700'
    case 'Full': return 'bg-green-50 text-green-700'
    case 'Outline': return 'bg-purple-50 text-purple-700'
    case 'Pre-Application': return 'bg-amber-50 text-amber-700'
    case 'Condition Discharge': return 'bg-slate-100 text-slate-700'
    case 'Retrospective': return 'bg-orange-50 text-orange-700'
    default: return 'bg-slate-100 text-slate-600'
  }
}

export default PlanningTracker
