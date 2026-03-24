import { ArrowUpRight, TrendingUp, Calendar, AlertTriangle, CheckCircle, Clock, ChevronRight, Zap } from 'lucide-react'
import { family, walletSummary, transactions, programs, children } from '../data/mockData'
import { formatCurrency, formatShortDate, daysUntil, getUrgencyLevel } from '../lib/utils'
import { cn } from '../lib/utils'
import type { PageId } from '../App'

interface WalletPageProps {
  onNavigate: (page: PageId) => void
}


export function WalletPage({ onNavigate }: WalletPageProps) {
  // Collect all reminders
  const allReminders = Object.values(programs).flatMap(p => p.reminders || [])
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome row */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Hello, {family.firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{family.county} · Case #{family.caseId}</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400 uppercase tracking-wide">As of</div>
          <div className="text-sm font-medium text-slate-600">March 1, 2025</div>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{background: 'linear-gradient(135deg, #0c4a6e 0%, #1e40af 50%, #5b21b6 100%)'}}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-16 translate-y-16" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative p-6 sm:p-8">
          {/* Top row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-1">Monthly Wallet Balance</div>
              <div className="font-display text-5xl font-bold text-white tracking-tight">
                {formatCurrency(walletSummary.totalMonthlyBalance)}
              </div>
              <div className="text-blue-200 text-sm mt-1">across 4 active programs</div>
            </div>
            <div className="text-right">
              <div className="glass rounded-xl px-3 py-2 inline-block">
                <div className="text-white/60 text-xs">YTD Disbursed</div>
                <div className="text-white font-bold text-lg">{formatCurrency(walletSummary.ytdSpent)}</div>
              </div>
            </div>
          </div>

          {/* Program breakdown bars */}
          <div className="mb-5">
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
              {walletSummary.breakdown.map((item) => (
                <div
                  key={item.program}
                  className="h-full rounded-sm transition-all"
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  title={`${item.name}: ${formatCurrency(item.amount)}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {walletSummary.breakdown.map((item) => (
                <div key={item.program} className="glass rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/70 text-xs font-medium">{item.name}</span>
                  </div>
                  <div className="text-white font-bold text-sm">{formatCurrency(item.amount)}<span className="text-white/50 text-xs font-normal">/mo</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Children enrolled */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {children.map(child => (
                <div key={child.id} className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                  <span className="text-base">{child.avatar}</span>
                  <div>
                    <div className="text-white text-xs font-semibold">{child.name.split(' ')[0]}</div>
                    <div className="text-white/50 text-xs">Age {child.age}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-green-300 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              All programs active
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'View Programs', icon: <TrendingUp className="w-5 h-5" />, page: 'programs' as PageId, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100' },
          { label: 'Applications', icon: <Calendar className="w-5 h-5" />, page: 'applications' as PageId, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100' },
          { label: 'Apply Now', icon: <Zap className="w-5 h-5" />, page: 'apply' as PageId, color: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-100' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.page)}
            className={cn('rounded-xl border p-3 sm:p-4 flex flex-col items-center gap-2 transition-all font-medium text-sm', action.color)}
          >
            {action.icon}
            <span className="text-xs sm:text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Reminders */}
      {allReminders.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-slate-900 text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-2">
            {allReminders.map((reminder) => {
              const days = daysUntil(reminder.deadline)
              const urgency = getUrgencyLevel(days)
              return (
                <div
                  key={reminder.id}
                  className={cn(
                    'rounded-xl border p-4 flex items-start gap-3',
                    urgency === 'critical' ? 'bg-red-50 border-red-200' :
                    urgency === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    urgency === 'critical' ? 'bg-red-100 text-red-600' :
                    urgency === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-500'
                  )}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 text-sm">{reminder.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        urgency === 'critical' ? 'bg-red-100 text-red-700' :
                        urgency === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      )}>
                        {days > 0 ? `${days} days away` : 'Past due'}
                      </span>
                      <span className="text-xs text-slate-400">Deadline: {formatShortDate(reminder.deadline)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('apply')}
                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-slate-900 text-lg">Recent Payments</h2>
          <button
            onClick={() => onNavigate('programs')}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800"
          >
            View all <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {transactions.slice(0, 6).map((tx, i) => (
            <div
              key={tx.id}
              className={cn(
                'flex items-center gap-4 px-5 py-4',
                i < transactions.slice(0, 6).length - 1 ? 'border-b border-slate-100' : ''
              )}
            >
              {/* Provider icon */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 text-lg">
                {tx.providerId === 'p1' ? '⭐' : tx.providerId === 'p3' ? '🏠' : '🌻'}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 text-sm truncate">{tx.provider}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-400 text-xs">{formatShortDate(tx.date)}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 text-xs">{tx.children.join(', ')}</span>
                </div>
              </div>

              {/* Program tags */}
              <div className="flex gap-1 hidden sm:flex">
                {tx.programs.slice(0, 2).map(prog => (
                  <span
                    key={prog}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: programs[prog as keyof typeof programs]?.lightColor || '#f1f5f9',
                      color: programs[prog as keyof typeof programs]?.color || '#64748b',
                    }}
                  >
                    {programs[prog as keyof typeof programs]?.name || prog}
                  </span>
                ))}
                {tx.programs.length > 2 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">+{tx.programs.length - 2}</span>
                )}
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-slate-900">{formatCurrency(tx.amount)}</div>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Paid</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Head Start notice */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 text-xl">
          🧡
        </div>
        <div>
          <div className="font-semibold text-slate-800 text-sm mb-1">Head Start — Not Yet Integrated</div>
          <p className="text-slate-600 text-sm">
            Head Start integration is not available in this system yet. If your child may be eligible, please contact your
            local Head Start office directly to check availability and apply.
          </p>
          <a
            href="https://www.acf.hhs.gov/ohs/about/head-start"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium mt-2 hover:text-blue-800"
          >
            Find a local Head Start program <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
