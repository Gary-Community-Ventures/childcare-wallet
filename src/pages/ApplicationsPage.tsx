import { useState } from 'react'
import {
  CheckCircle, Clock, AlertTriangle, ChevronRight,
  FileText, Calendar, RotateCcw, PlusCircle, Info
} from 'lucide-react'
import { applications, programs } from '../data/mockData'
import { formatShortDate, daysUntil } from '../lib/utils'
import { cn } from '../lib/utils'
import type { PageId } from '../App'

interface ApplicationsPageProps {
  onNavigate: (page: PageId) => void
}

type AppFilter = 'all' | 'active' | 'upcoming' | 'approved'

const statusConfig = {
  approved: { label: 'Approved', icon: <CheckCircle className="w-3.5 h-3.5" />, className: 'status-active' },
  pending: { label: 'Pending', icon: <Clock className="w-3.5 h-3.5" />, className: 'status-pending' },
  upcoming: { label: 'Upcoming', icon: <Calendar className="w-3.5 h-3.5" />, className: 'status-review' },
  denied: { label: 'Denied', icon: <AlertTriangle className="w-3.5 h-3.5" />, className: 'status-expiring' },
}

const programColors: Record<string, { bg: string; text: string; border: string }> = {
  cccap: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  upk: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  larimer: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  cap: { bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe' },
}

export function ApplicationsPage({ onNavigate }: ApplicationsPageProps) {
  const [filter, setFilter] = useState<AppFilter>('all')
  const [expandedApp, setExpandedApp] = useState<string | null>(null)

  const filtered = applications.filter(app => {
    if (filter === 'all') return true
    if (filter === 'active') return app.status === 'approved'
    if (filter === 'upcoming') return app.status === 'upcoming'
    if (filter === 'approved') return app.status === 'approved'
    return true
  })

  const upcomingApps = applications.filter(a => a.status === 'upcoming')

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 text-sm mt-1">All submitted and upcoming applications for childcare assistance</p>
      </div>

      {/* Upcoming action required */}
      {upcomingApps.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display font-bold text-lg mb-1">Action Required</div>
              <p className="text-white/80 text-sm">{upcomingApps.length} renewal application{upcomingApps.length > 1 ? 's' : ''} due soon. Start early to avoid gaps in coverage.</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
          <div className="mt-4 space-y-2">
            {upcomingApps.map(app => (
              <div key={app.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm">{app.programName}</span>
                  {app.applicationDeadline && (
                    <span className="text-white/70 text-xs ml-2">Due {formatShortDate(app.applicationDeadline)}</span>
                  )}
                </div>
                <button
                  onClick={() => onNavigate('apply')}
                  className="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors flex items-center gap-1"
                >
                  Start Renewal <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'approved', 'upcoming'] as AppFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize',
              filter === f
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            {f === 'all' ? `All (${applications.length})` : f === 'approved' ? `Approved (${applications.filter(a => a.status === 'approved').length})` : `Upcoming (${applications.filter(a => a.status === 'upcoming').length})`}
          </button>
        ))}
      </div>

      {/* Applications list */}
      <div className="space-y-3">
        {filtered.map((app) => {
          const isExpanded = expandedApp === app.id
          const progColor = programColors[app.program] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' }
          const statusConf = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.pending
          const programInfo = programs[app.program as keyof typeof programs]

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Main row */}
              <button
                onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                {/* Program color dot */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: progColor.bg, border: `1px solid ${progColor.border}` }}
                >
                  {programInfo?.icon || '📄'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 text-sm">{app.programName}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{ background: progColor.bg, color: progColor.text }}
                    >
                      {app.type === 'initial' ? 'Initial' : 'Renewal'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {app.submittedDate ? (
                      <span className="text-slate-400 text-xs">Submitted {formatShortDate(app.submittedDate)}</span>
                    ) : (
                      <span className="text-slate-400 text-xs">Not yet submitted</span>
                    )}
                    {app.caseNumber && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400 text-xs">{app.caseNumber}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold', statusConf.className)}>
                    {statusConf.icon} {statusConf.label}
                  </span>
                  <ChevronRight className={cn('w-4 h-4 text-slate-400 transition-transform', isExpanded ? 'rotate-90' : '')} />
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4 animate-slide-up">
                  {/* Timeline */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {app.submittedDate && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-slate-500 text-xs mb-1">Date Submitted</div>
                        <div className="font-semibold text-slate-900 text-sm">{formatShortDate(app.submittedDate)}</div>
                      </div>
                    )}
                    {app.approvedDate && (
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="text-green-600 text-xs mb-1">Date Approved</div>
                        <div className="font-semibold text-slate-900 text-sm">{formatShortDate(app.approvedDate)}</div>
                      </div>
                    )}
                    {(app as any).applicationDeadline && (
                      <div className="bg-amber-50 rounded-xl p-3">
                        <div className="text-amber-600 text-xs mb-1">Application Deadline</div>
                        <div className="font-semibold text-slate-900 text-sm">{formatShortDate((app as any).applicationDeadline)}</div>
                        <div className="text-amber-600 text-xs mt-0.5">{daysUntil((app as any).applicationDeadline)} days away</div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {app.notes && (
                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-blue-50 rounded-xl p-3">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p>{app.notes}</p>
                    </div>
                  )}

                  {/* Documents */}
                  {app.documents && app.documents.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Documents Submitted</div>
                      <div className="flex flex-wrap gap-2">
                        {app.documents.map(doc => (
                          <span key={doc} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                            <FileText className="w-3 h-3" /> {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reconsideration info */}
                  {(app as any).reconsiderationDeadline && (
                    <div className="rounded-xl bg-violet-50 border border-violet-100 p-3 flex items-start gap-2">
                      <RotateCcw className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-violet-900 text-xs mb-0.5">Reconsideration Process</div>
                        <p className="text-violet-700 text-xs">{(app as any).reconsiderationInfo}</p>
                        <div className="text-violet-600 text-xs mt-1 font-medium">
                          Reconsideration deadline: {formatShortDate((app as any).reconsiderationDeadline)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action button for upcoming */}
                  {app.status === 'upcoming' && (
                    <button
                      onClick={() => onNavigate('apply')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Start {app.programName} Application
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit new application */}
      <div className="rounded-2xl border-2 border-dashed border-blue-200 p-6 text-center bg-blue-50/30">
        <div className="text-3xl mb-2">📝</div>
        <div className="font-semibold text-slate-800 mb-1">Need to Apply for a New Program?</div>
        <p className="text-slate-500 text-sm mb-4">All childcare assistance applications are managed in one place on this portal.</p>
        <button
          onClick={() => onNavigate('apply')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Go to Applications Portal
        </button>
      </div>
    </div>
  )
}
