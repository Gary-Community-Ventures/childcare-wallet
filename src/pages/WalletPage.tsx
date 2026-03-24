import { ArrowUpRight, TrendingUp, Calendar, AlertTriangle, CheckCircle, Clock, ChevronRight, PlusCircle } from 'lucide-react'
import { family, walletSummary, transactions, programs, children } from '../data/mockData'
import { formatCurrency, formatShortDate, daysUntil, getUrgencyLevel } from '../lib/utils'
import { cn } from '../lib/utils'
import type { PageId } from '../App'

interface WalletPageProps {
  onNavigate: (page: PageId) => void
}

export function WalletPage({ onNavigate }: WalletPageProps) {
  const allReminders = Object.values(programs).flatMap(p => p.reminders || [])
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Welcome row */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Hello, {family.firstName}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{family.county} · Case #{family.caseId}</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400">As of March 1, 2025</div>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="rounded-2xl overflow-hidden border border-sky-100 shadow-sm" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)'}}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Monthly Wallet Balance</div>
              <div className="font-display text-4xl font-bold text-slate-800 tracking-tight">
                {formatCurrency(walletSummary.totalMonthlyBalance)}
              </div>
              <div className="text-slate-400 text-sm mt-1">across 4 active programs</div>
            </div>
            <div className="bg-white rounded-xl px-3 py-2 border border-slate-100 shadow-sm">
              <div className="text-slate-400 text-xs">YTD Disbursed</div>
              <div className="text-slate-800 font-bold text-lg">{formatCurrency(walletSummary.ytdSpent)}</div>
            </div>
          </div>

          <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
            {walletSummary.breakdown.map((item) => (
              <div key={item.program} className="h-full rounded-sm opacity-60"
                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                title={`${item.name}: ${formatCurrency(item.amount)}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {walletSummary.breakdown.map((item) => (
              <div key={item.program} className="bg-white rounded-xl px-3 py-2 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full opacity-70" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500 text-xs">{item.name}</span>
                </div>
                <div className="text-slate-800 font-semibold text-sm">{formatCurrency(item.amount)}<span className="text-slate-400 text-xs font-normal">/mo</span></div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {children.map(child => (
                <div key={child.id} className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-slate-100 shadow-sm">
                  <span className="text-base">{child.avatar}</span>
                  <div>
                    <div className="text-slate-700 text-xs font-semibold">{child.name.split(' ')[0]}</div>
                    <div className="text-slate-400 text-xs">Age {child.age}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-teal-600 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              All programs active
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Programs', icon: <TrendingUp className="w-4 h-4" />, page: 'programs' as PageId },
          { label: 'Applications', icon: <Calendar className="w-4 h-4" />, page: 'applications' as PageId },
          { label: 'Apply', icon: <PlusCircle className="w-4 h-4" />, page: 'apply' as PageId },
        ].map((action) => (
          <button key={action.label} onClick={() => onNavigate(action.page)}
            className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center gap-1.5 hover:border-sky-200 hover:bg-sky-50 transition-all text-slate-500 hover:text-sky-700"
          >
            {action.icon}
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      {allReminders.length > 0 && (
        <div id="upcoming-deadlines">
          <h2 className="font-semibold text-slate-700 text-base mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-2">
            {allReminders.map((reminder) => {
              const days = daysUntil(reminder.deadline)
              const urgency = getUrgencyLevel(days)
              return (
                <div key={reminder.id} className={cn(
                  'rounded-xl border p-4 flex items-start gap-3',
                  urgency === 'critical' ? 'bg-rose-50 border-rose-200' :
                  urgency === 'warning' ? 'bg-amber-50 border-amber-200' :
                  'bg-slate-50 border-slate-200'
                )}>
                  <Clock className={cn('w-4 h-4 flex-shrink-0 mt-0.5',
                    urgency === 'critical' ? 'text-rose-400' :
                    urgency === 'warning' ? 'text-amber-400' : 'text-slate-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-600 text-sm">{reminder.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                        urgency === 'critical' ? 'bg-rose-100 text-rose-600' :
                        urgency === 'warning' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-500'
                      )}>
                        {days > 0 ? `${days} days away` : 'Past due'}
                      </span>
                      <span className="text-xs text-slate-400">{formatShortDate(reminder.deadline)}</span>
                    </div>
                  </div>
                  <button onClick={() => onNavigate('apply')} className="text-slate-300 hover:text-sky-500 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700 text-base">Recent Payments</h2>
          <button onClick={() => onNavigate('programs')}
            className="text-sky-600 text-sm font-medium flex items-center gap-1 hover:text-sky-800"
          >
            View all <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {transactions.slice(0, 6).map((tx, i) => (
            <div key={tx.id} className={cn(
              'flex items-center gap-4 px-5 py-3.5',
              i < transactions.slice(0, 6).length - 1 ? 'border-b border-slate-100' : ''
            )}>
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-base">
                {tx.providerId === 'p1' ? 'S' : tx.providerId === 'p3' ? 'H' : 'F'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-700 text-sm truncate">{tx.provider}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-slate-400 text-xs">{formatShortDate(tx.date)}</span>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-slate-400 text-xs">{tx.children.join(', ')}</span>
                </div>
              </div>
              <div className="hidden sm:flex gap-1">
                {tx.programs.slice(0, 2).map(prog => (
                  <span key={prog} className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: programs[prog as keyof typeof programs]?.lightColor || '#f1f5f9',
                      color: programs[prog as keyof typeof programs]?.color || '#64748b',
                    }}>
                    {programs[prog as keyof typeof programs]?.name || prog}
                  </span>
                ))}
                {tx.programs.length > 2 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">+{tx.programs.length - 2}</span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-slate-700 text-sm">{formatCurrency(tx.amount)}</div>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <CheckCircle className="w-3 h-3 text-teal-500" />
                  <span className="text-xs text-teal-600">Paid</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Head Start notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-xl border border-amber-100">
          H
        </div>
        <div>
          <div className="font-semibold text-slate-700 text-sm mb-1">Head Start — Not Yet Integrated</div>
          <p className="text-slate-500 text-sm">
            Head Start is not available in this system yet. Contact your local Head Start office directly to check eligibility and enrollment.
          </p>
          <a href="https://www.acf.hhs.gov/ohs/about/head-start" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sky-600 text-sm font-medium mt-2 hover:text-sky-800"
          >
            Find a local program <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}