import { CheckCircle, MapPin, Calendar, User } from 'lucide-react'
import { children, programs, providers, transactions } from '../data/mockData'
import { formatCurrency, formatShortDate } from '../lib/utils'

const childAmounts: Record<string, Array<{ program: string; name: string; amount: number; color: string; lightColor: string }>> = {
  c1: [
    { program: 'cccap', name: 'CCCAP', amount: 940, color: '#0369a1', lightColor: '#e0f2fe' },
    { program: 'upk', name: 'UPK Colorado', amount: 800, color: '#216737', lightColor: '#dcfce7' },
    { program: 'larimer', name: 'Larimer County', amount: 150, color: '#b45309', lightColor: '#fef3c7' },
    { program: 'cap', name: 'CAP Pilot', amount: 50, color: '#6d28d9', lightColor: '#ede9fe' },
  ],
  c2: [
    { program: 'cccap', name: 'CCCAP', amount: 300, color: '#0369a1', lightColor: '#e0f2fe' },
    { program: 'larimer', name: 'Larimer County', amount: 150, color: '#b45309', lightColor: '#fef3c7' },
    { program: 'cap', name: 'CAP Pilot', amount: 350, color: '#6d28d9', lightColor: '#ede9fe' },
  ],
}

const childGradients: Record<string, string> = {
  c1: 'linear-gradient(135deg, #0284c7, #38bdf8)',
  c2: 'linear-gradient(135deg, #d97706, #fbbf24)',
}

export function ChildrenPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">My Children</h1>
        <p className="text-slate-500 text-sm mt-1">
          {children.length} children · program enrollment and payment breakdown per child
        </p>
      </div>

      {children.map(child => {
        const amounts = childAmounts[child.id] || []
        const total = amounts.reduce((sum, a) => sum + a.amount, 0)
        const primaryProvider = providers.find(p => p.id === child.primaryProvider)
        const childTx = transactions.filter(tx =>
          tx.children.includes(child.name.split(' ')[0])
        )

        return (
          <div key={child.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="p-6 text-white relative overflow-hidden" style={{ background: childGradients[child.id] }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 transform translate-x-12 -translate-y-12" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 border border-white/30">
                    {child.avatar}
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">{child.name}</h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-white/70 text-sm flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Age {child.age} · {child.grade}
                      </span>
                      <span className="text-white/70 text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> DOB {formatShortDate(child.dob)}
                      </span>
                    </div>
                    {primaryProvider && (
                      <div className="flex items-center gap-1 mt-1 text-white/70 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {primaryProvider.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="glass rounded-xl px-4 py-3 text-right flex-shrink-0">
                  <div className="text-white/60 text-xs">Monthly benefit</div>
                  <div className="text-white font-bold text-2xl">{formatCurrency(total)}</div>
                  <div className="text-white/60 text-xs">{amounts.length} programs</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Program funding breakdown */}
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Monthly Funding by Program</h3>

                {/* Stacked bar */}
                <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
                  {amounts.map(a => (
                    <div
                      key={a.program}
                      className="h-full rounded-sm"
                      style={{
                        width: `${(a.amount / total) * 100}%`,
                        backgroundColor: a.color,
                        opacity: 0.75,
                      }}
                      title={`${a.name}: ${formatCurrency(a.amount)}`}
                    />
                  ))}
                </div>

                {/* Program chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {amounts.map(a => {
                    const prog = programs[a.program as keyof typeof programs]
                    return (
                      <div
                        key={a.program}
                        className="rounded-xl p-3 border"
                        style={{ backgroundColor: a.lightColor, borderColor: a.color + '40' }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                          <span className="text-xs font-semibold" style={{ color: a.color }}>{a.name}</span>
                        </div>
                        <div className="font-bold text-slate-800 text-base">
                          {formatCurrency(a.amount)}
                          <span className="text-xs font-normal text-slate-400">/mo</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {Math.round((a.amount / total) * 100)}% of total
                        </div>
                        {prog && (
                          <div className="text-xs text-slate-400 mt-1 truncate">{prog.name === a.name ? prog.fullName : prog.name}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Enrolled programs list */}
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Enrolled Programs</h3>
                <div className="flex flex-wrap gap-2">
                  {child.programs.map(progId => {
                    const prog = programs[progId as keyof typeof programs]
                    if (!prog) return null
                    return (
                      <span
                        key={progId}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                        style={{
                          backgroundColor: prog.lightColor,
                          color: prog.color,
                          borderColor: prog.color + '30',
                        }}
                      >
                        {prog.icon} {prog.name}
                        {prog.status === 'active'
                          ? <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5" />
                          : <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" />
                        }
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Recent payments */}
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Recent Payments</h3>
                {childTx.length === 0 ? (
                  <p className="text-slate-400 text-sm">No payments recorded yet.</p>
                ) : (
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    {childTx.slice(0, 4).map((tx, i) => (
                      <div
                        key={tx.id}
                        className={i < Math.min(childTx.length, 4) - 1 ? 'border-b border-slate-100' : ''}
                      >
                        {/* Top row */}
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                            {tx.providerId === 'p1' ? '⭐' : tx.providerId === 'p3' ? '🏠' : '🌻'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">{tx.provider}</div>
                            <div className="text-xs text-slate-400">{formatShortDate(tx.date)}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-semibold text-slate-900 text-sm">{formatCurrency(tx.amount)}</div>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                              <CheckCircle className="w-3 h-3 text-teal-500" />
                              <span className="text-xs text-teal-600">Paid</span>
                            </div>
                          </div>
                        </div>

                        {/* Breakdown bar + chips */}
                        {tx.breakdown && tx.breakdown.length > 0 && (
                          <div className="px-4 pb-3 ml-11">
                            <div className="flex h-1.5 rounded-full overflow-hidden gap-px mb-2">
                              {tx.breakdown.map(b => (
                                <div
                                  key={b.program}
                                  className="h-full"
                                  style={{ width: `${(b.amount / tx.amount) * 100}%`, backgroundColor: b.color, opacity: 0.7 }}
                                />
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {tx.breakdown.map(b => (
                                <span
                                  key={b.program}
                                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{ backgroundColor: b.lightColor, color: b.color }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
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
        )
      })}
    </div>
  )
}
