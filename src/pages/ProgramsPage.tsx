import { useState } from 'react'
import {
  CheckCircle, Clock, AlertTriangle, ChevronRight,
  Calendar, User, Phone, MapPin, BookOpen,
  Star, Rocket, GraduationCap, Building2, ArrowUpRight, DollarSign
} from 'lucide-react'
import { programs, children, transactions } from '../data/mockData'
import { formatCurrency, formatShortDate, daysUntil, getUrgencyLevel } from '../lib/utils'
import { cn } from '../lib/utils'
import type { PageId } from '../App'

interface ProgramsPageProps {
  onNavigate: (page: PageId, program?: string) => void
  initialProgram?: string
}

type ProgramId = 'cccap' | 'upk' | 'larimer' | 'cap' | 'cctc'

const programList: { id: ProgramId; icon: React.ReactNode; shortDesc: string }[] = [
  { id: 'cccap', icon: <Building2 className="w-5 h-5" />, shortDesc: 'State childcare subsidy' },
  { id: 'upk', icon: <GraduationCap className="w-5 h-5" />, shortDesc: 'Universal preschool' },
  { id: 'larimer', icon: <MapPin className="w-5 h-5" />, shortDesc: 'County supplement' },
  { id: 'cap', icon: <Rocket className="w-5 h-5" />, shortDesc: 'Pilot wallet funds' },
  { id: 'cctc', icon: <DollarSign className="w-5 h-5" />, shortDesc: 'State tax credit' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') return (
    <span className="status-active inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      Active
    </span>
  )
  return (
    <span className="status-pending inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold">
      <Clock className="w-3 h-3" /> Pending
    </span>
  )
}

function RenewalAlert({ deadline, programId, onNavigate }: { deadline: string; programId: string; onNavigate: (p: PageId) => void }) {
  const days = daysUntil(deadline)
  const urgency = getUrgencyLevel(days)
  if (urgency === 'ok') return null
  return (
    <div className={cn(
      'rounded-xl p-4 flex items-start gap-3 mb-4',
      urgency === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
    )}>
      <AlertTriangle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', urgency === 'critical' ? 'text-red-500' : 'text-amber-500')} />
      <div>
        <div className={cn('font-semibold text-sm', urgency === 'critical' ? 'text-red-800' : 'text-amber-800')}>
          Renewal Deadline Approaching
        </div>
        <p className={cn('text-sm mt-0.5', urgency === 'critical' ? 'text-red-700' : 'text-amber-700')}>
          Deadline: <strong>{formatShortDate(deadline)}</strong> ({days} days away)
        </p>
        <button
          onClick={() => onNavigate('apply')}
          className={cn(
            'text-xs font-semibold mt-2 flex items-center gap-1 hover:opacity-80',
            urgency === 'critical' ? 'text-red-700' : 'text-amber-700'
          )}
        >
          Start {programId.toUpperCase()} Renewal <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export function ProgramsPage({ onNavigate, initialProgram }: ProgramsPageProps) {
  const [activeProgram, setActiveProgram] = useState<ProgramId>(
    (initialProgram as ProgramId) || 'cccap'
  )
  const [selectedChild, setSelectedChild] = useState<string | null>(null)

  const selectedChildData = selectedChild ? children.find(c => c.id === selectedChild) ?? null : null

  const handleChildSelect = (childId: string | null) => {
    setSelectedChild(childId)
    if (childId) {
      const childData = children.find(c => c.id === childId)
      // If active program isn't available for this child (and isn't family-level cctc), switch to first match
      if (childData && activeProgram !== 'cctc' && !childData.programs.includes(activeProgram)) {
        const first = programList.find(p => childData.programs.includes(p.id))
        if (first) setActiveProgram(first.id)
      }
    }
  }

  // cctc is family-level — show it regardless of which child is selected
  const visiblePrograms = selectedChildData
    ? programList.filter(p => p.id === 'cctc' || selectedChildData.programs.includes(p.id))
    : programList

  const prog = programs[activeProgram]
  const enrolledKids = children.filter(c =>
    c.programs.includes(activeProgram) && (!selectedChildData || c.id === selectedChildData.id)
  )
  const programTx = transactions.filter(tx =>
    tx.programs.includes(activeProgram) &&
    (!selectedChildData || tx.children.includes(selectedChildData.name.split(' ')[0]))
  )

  // Soft pastel backgrounds for program cards (light, not dark)
  const lightBgMap: Record<ProgramId, string> = {
    cccap: '#e0f2fe',
    upk: '#dcfce7',
    larimer: '#fef9c3',
    cap: '#ede9fe',
    cctc: '#f3e8ff',
  }
  const accentColorMap: Record<ProgramId, string> = {
    cccap: '#0369a1',
    upk: '#166534',
    larimer: '#92400e',
    cap: '#5b21b6',
    cctc: '#7e22ce',
  }
  // Keep the darker gradient only for the selected detail header, but make it softer
  const gradientMap: Record<ProgramId, string> = {
    cccap: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    upk: 'linear-gradient(135deg, #16a34a, #4ade80)',
    larimer: 'linear-gradient(135deg, #b45309, #fbbf24)',
    cap: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
    cctc: 'linear-gradient(135deg, #7e22ce, #d946ef)',
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">My Programs</h1>
          <p className="text-slate-500 text-sm mt-1">
            {selectedChildData
              ? `Showing ${selectedChildData.name.split(' ')[0]}'s ${visiblePrograms.length} programs`
              : 'All active childcare assistance programs for your family'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleChildSelect(null)}
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
              !selectedChild
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            )}
          >
            All
          </button>
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => handleChildSelect(selectedChild === child.id ? null : child.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 border transition-all text-xs font-semibold',
                selectedChild === child.id
                  ? 'bg-white border-slate-700 ring-2 ring-slate-300 shadow-sm text-slate-800'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 shadow-sm'
              )}
            >
              <span>{child.avatar}</span>
              {child.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Program selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {visiblePrograms.map(({ id, icon, shortDesc }) => {
          const p = programs[id]
          const isActive = activeProgram === id
          return (
            <button
              key={id}
              onClick={() => setActiveProgram(id)}
              className={cn(
                'rounded-2xl p-4 text-left transition-all program-card border',
                isActive
                  ? 'shadow-md ring-2 ring-offset-1'
                  : 'bg-white border-slate-200 hover:shadow-sm hover:border-slate-300'
              )}
              style={isActive
                ? { backgroundColor: lightBgMap[id], borderColor: accentColorMap[id] }
                : {}}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: isActive ? 'white' : '#f1f5f9', color: isActive ? accentColorMap[id] : '#64748b' }}>
                {icon}
              </div>
              <div className="font-semibold text-sm text-slate-800">{p.name}</div>
              <div className="text-xs mt-0.5 text-slate-500">{shortDesc}</div>
              {id === 'cctc' ? (
                <div className="mt-2">
                  <div className="text-lg font-bold text-slate-800">
                    {formatCurrency((p as any).estimatedAnnualCredit)}<span className="text-xs font-normal text-slate-400">/yr est.</span>
                  </div>
                  <span className="text-xs text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded-full">Pending</span>
                </div>
              ) : (
                <div className="text-lg font-bold mt-2 text-slate-800">
                  {formatCurrency(p.monthlyBenefit)}<span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Program detail */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-6 text-white relative overflow-hidden" style={{ background: gradientMap[activeProgram] }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 transform translate-x-16 -translate-y-16" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">{prog.name}</div>
                <h2 className="font-display text-xl font-bold text-white">{prog.fullName}</h2>
                <p className="text-white/70 text-sm mt-1 max-w-lg">{prog.description}</p>
              </div>
              <StatusBadge status={prog.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {activeProgram === 'cctc' ? (
                <>
                  <div className="glass rounded-xl p-3">
                    <div className="text-white/60 text-xs">Est. Annual Credit</div>
                    <div className="text-white font-bold text-xl">{formatCurrency((prog as any).estimatedAnnualCredit)}</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-white/60 text-xs">Submitted</div>
                    <div className="text-white font-semibold text-sm">{formatShortDate(prog.enrolledDate)}</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-white/60 text-xs">Case Number</div>
                    <div className="text-white font-semibold text-sm">{(prog as any).caseNumber}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="glass rounded-xl p-3">
                    <div className="text-white/60 text-xs">Monthly Benefit</div>
                    <div className="text-white font-bold text-xl">{formatCurrency(prog.monthlyBenefit)}</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-white/60 text-xs">Enrolled Since</div>
                    <div className="text-white font-semibold text-sm">{formatShortDate(prog.enrolledDate)}</div>
                  </div>
                  {activeProgram !== 'cap' ? (
                    <div className="glass rounded-xl p-3">
                      <div className="text-white/60 text-xs">Renews</div>
                      <div className="text-white font-semibold text-sm">{formatShortDate((prog as any).renewalDate)}</div>
                    </div>
                  ) : (
                    <div className="glass rounded-xl p-3 border border-yellow-300/30">
                      <div className="text-yellow-200/80 text-xs">⚠️ Pilot Ends</div>
                      <div className="text-white font-semibold text-sm">{formatShortDate((prog as any).pilotEndDate)}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Renewal alert */}
          {activeProgram !== 'cap' && activeProgram !== 'cctc' && (prog as any).nextRenewalDeadline && (
            <RenewalAlert
              deadline={(prog as any).nextRenewalDeadline}
              programId={activeProgram}
              onNavigate={onNavigate}
            />
          )}

          {/* CCTC pending notice */}
          {activeProgram === 'cctc' && (
            <div className="rounded-xl p-4 bg-purple-50 border border-purple-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-purple-900 text-sm">Application Under Review</div>
                  <p className="text-purple-700 text-sm mt-1">{(prog as any).notes}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => onNavigate('applications')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      View Application Status <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CAP pilot notice */}
          {activeProgram === 'cap' && (
            <div className="rounded-xl p-4 bg-violet-50 border border-violet-200">
              <div className="flex items-start gap-3">
                <Rocket className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-violet-900 text-sm">Pilot Program Notice</div>
                  <p className="text-violet-700 text-sm mt-1">{(programs.cap as any).pilotInfo}</p>
                  <p className="text-violet-600 text-sm font-medium mt-2">
                    🗓️ This pilot concludes on <strong>June 30, 2026</strong>. No action required — Gary Community Ventures will be in touch about next steps before the pilot ends.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enrolled children */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Children Enrolled in {prog.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enrolledKids.map(child => (
                <div key={child.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-xl flex-shrink-0">
                    {child.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{child.name}</div>
                    <div className="text-slate-500 text-xs">Age {child.age} · {child.grade}</div>
                    {activeProgram === 'upk' && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">30 hrs/week · Dual-language learner</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-auto">
                    <span className="status-active text-xs px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              ))}
              {enrolledKids.length === 0 && (
                <p className="text-slate-400 text-sm">No children currently enrolled in this program.</p>
              )}
            </div>
          </div>

          {/* UPK-specific details */}
          {activeProgram === 'upk' && (
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                UPK Colorado Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'School Year', value: (programs.upk as any).schoolYear },
                  { label: 'Hours/Week', value: `${(programs.upk as any).hoursPerWeek} hrs` },
                  { label: 'QRIS Rating', value: (programs.upk as any).qrisRating },
                  { label: 'Match Status', value: 'Matched ✓' },
                ].map(item => (
                  <div key={item.label} className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <div className="text-emerald-600 text-xs">{item.label}</div>
                    <div className="text-slate-900 font-semibold text-sm mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl bg-blue-50 border border-blue-100 p-3">
                <div className="text-blue-700 text-xs font-semibold mb-1">Additional Hours Qualification</div>
                <div className="flex gap-2">
                  {(programs.upk as any).additionalHoursReasons.map((r: string) => (
                    <span key={r} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">{r}</span>
                  ))}
                </div>
                <p className="text-blue-600 text-xs mt-2">Sofia receives 15 base hours + 15 additional hours = 30 hrs/week total.</p>
              </div>
            </div>
          )}

          {/* Contact info */}
          {activeProgram === 'cccap' && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Case Worker
              </h3>
              <div className="text-slate-700 text-sm font-medium">{(programs.cccap as any).caseWorker}</div>
              <div className="text-slate-500 text-sm">{(programs.cccap as any).caseWorkerPhone}</div>
            </div>
          )}

          {activeProgram === 'larimer' && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> County Office
              </h3>
              <div className="text-slate-700 text-sm">{(programs.larimer as any).contactOffice}</div>
              <div className="text-slate-500 text-sm">{(programs.larimer as any).contactPhone}</div>
            </div>
          )}

          {activeProgram === 'cctc' && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Contact Agency
              </h3>
              <div className="text-slate-700 text-sm font-medium">{(programs.cctc as any).contactAgency}</div>
              <div className="text-slate-500 text-sm">{(programs.cctc as any).contactPhone}</div>
              <div className="text-slate-500 text-sm">{(programs.cctc as any).contactWebsite}</div>
            </div>
          )}

          {/* Reminders */}
          {(prog.reminders || []).length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Reminders & Notifications
              </h3>
              <div className="space-y-2">
                {(prog.reminders || []).map(reminder => {
                  const days = daysUntil(reminder.deadline)
                  return (
                    <div key={reminder.id} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm">{reminder.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            {days > 0 ? `${days} days` : 'Past due'}
                          </span>
                          <span className="text-slate-400 text-xs">· {formatShortDate(reminder.deadline)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('apply')}
                        className="text-blue-600 text-xs font-medium flex items-center gap-0.5 hover:text-blue-800 flex-shrink-0"
                      >
                        Apply <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Transactions for this program */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              Payment History (via {prog.name})
            </h3>
            {programTx.length === 0 ? (
              <p className="text-slate-400 text-sm">No transactions recorded yet.</p>
            ) : (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                {programTx.slice(0, 5).map((tx, i) => (
                  <div
                    key={tx.id}
                    className={cn('px-4 py-3', i < Math.min(programTx.length, 5) - 1 ? 'border-b border-slate-100' : '')}
                  >
                    {/* Top row: provider + total */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                        {tx.providerId === 'p1' ? '⭐' : tx.providerId === 'p3' ? '🏠' : '🌻'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{tx.provider}</div>
                        <div className="text-xs text-slate-400">{formatShortDate(tx.date)} · {tx.children.join(', ')}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-slate-900 text-sm">{formatCurrency(tx.amount)}</div>
                        <div className="text-xs text-green-600">Paid</div>
                      </div>
                    </div>

                    {/* Breakdown row */}
                    {tx.breakdown && tx.breakdown.length > 0 && (
                      <div className="mt-2 ml-11">
                        {/* Stacked bar */}
                        <div className="flex h-1.5 rounded-full overflow-hidden gap-px mb-2">
                          {tx.breakdown.map(b => (
                            <div
                              key={b.program}
                              className="h-full"
                              style={{
                                width: `${(b.amount / tx.amount) * 100}%`,
                                backgroundColor: b.color,
                                opacity: 0.7,
                              }}
                            />
                          ))}
                        </div>
                        {/* Labels */}
                        <div className="flex flex-wrap gap-1.5">
                          {tx.breakdown.map(b => (
                            <span
                              key={b.program}
                              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: b.lightColor, color: b.color }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: b.color }}
                              />
                              {b.name} · {formatCurrency(b.amount)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Head Start notice */}
      <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-5 flex items-start gap-4">
        <div className="text-2xl flex-shrink-0">🧡</div>
        <div>
          <div className="font-semibold text-orange-900 text-sm mb-1">Head Start — Integration Coming Soon</div>
          <p className="text-orange-800 text-sm">
            Head Start is not yet integrated into this wallet system. Contact your local Head Start office directly to check eligibility and enrollment.
          </p>
          <a href="https://www.acf.hhs.gov/ohs/about/head-start" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-orange-700 font-semibold text-sm mt-2 hover:text-orange-900">
            Find local Head Start <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
