import { useState } from 'react'
import { ArrowUpRight, TrendingUp, Calendar, AlertTriangle, CheckCircle, Clock, ChevronRight, PlusCircle, Send, X, Sparkles } from 'lucide-react'
import { family, walletSummary, transactions, programs, children, providers } from '../data/mockData'
import { formatCurrency, formatShortDate, daysUntil, getUrgencyLevel } from '../lib/utils'
import { cn } from '../lib/utils'
import type { PageId } from '../App'

interface WalletPageProps {
  onNavigate: (page: PageId, program?: string) => void
}

function PayModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0].id)
  const [amount, setAmount] = useState('1580')
  const [note, setNote] = useState('')

  const selectedProvider = providers.find(p => p.id === selectedProviderId)!

  const handleSubmit = () => {
    if (step === 'form') setStep('confirm')
    else if (step === 'confirm') setStep('success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">

        {step === 'success' ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-800 mb-1">Payment Sent!</h2>
            <p className="text-slate-500 text-sm mb-2">
              {formatCurrency(parseFloat(amount))} sent to <span className="font-semibold text-slate-700">{selectedProvider.name}</span>
            </p>
            <p className="text-slate-400 text-xs mb-6">Funds will arrive within 1–2 business days.</p>
            <button
              onClick={onClose}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm transition-colors"
            >
              Done
            </button>
          </div>

        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-display font-bold text-slate-800 text-lg">
                  {step === 'confirm' ? 'Confirm Payment' : 'Pay a Provider'}
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Balance available: <span className="font-semibold text-teal-600">{formatCurrency(walletSummary.totalMonthlyBalance)}</span>
                </p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {step === 'form' ? (
                <>
                  {/* Provider selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pay To</label>
                    <div className="space-y-2">
                      {providers.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProviderId(p.id)}
                          className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                            selectedProviderId === p.id
                              ? 'border-sky-400 bg-sky-50 ring-1 ring-sky-400'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          )}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{ backgroundColor: p.bgColor }}>
                            {p.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-sm truncate">{p.name}</div>
                            <div className="text-slate-400 text-xs">{p.typeLabel}</div>
                          </div>
                          {selectedProviderId === p.id && (
                            <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['560', '800', '1240', '1580'].map(preset => (
                        <button key={preset} onClick={() => setAmount(preset)}
                          className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors',
                            amount === preset ? 'bg-sky-100 border-sky-300 text-sky-700 font-semibold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          )}>
                          {formatCurrency(parseFloat(preset))}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Note <span className="font-normal text-slate-400 normal-case">(optional)</span></label>
                    <input
                      type="text"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="e.g. March care — Sofia"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                /* Confirm step */
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: selectedProvider.bgColor }}>
                        {selectedProvider.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{selectedProvider.name}</div>
                        <div className="text-slate-400 text-xs">{selectedProvider.typeLabel}</div>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                      <span className="text-slate-500 text-sm">Amount</span>
                      <span className="font-bold text-slate-800 text-xl">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    {note && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-sm">Note</span>
                        <span className="text-slate-700 text-sm">{note}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">Arrives</span>
                      <span className="text-slate-700 text-sm">1–2 business days</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs text-center">Funds are drawn from your active wallet balance.</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                {step === 'confirm' && (
                  <button onClick={() => setStep('form')}
                    className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-3 font-semibold text-sm hover:bg-slate-50 transition-colors">
                    Back
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {step === 'form' ? 'Review Payment' : 'Confirm & Send'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function WalletPage({ onNavigate }: WalletPageProps) {
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [eligibilityBannerDismissed, setEligibilityBannerDismissed] = useState(false)

  const allReminders = Object.values(programs).flatMap(p => p.reminders || [])
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

  return (
    <div className="space-y-5 animate-slide-up">
      {payModalOpen && <PayModal onClose={() => setPayModalOpen(false)} />}

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

      {/* Eligibility Recommendation Banner */}
      {!eligibilityBannerDismissed && (
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0 border border-violet-200 mt-0.5">
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800">You may qualify for more assistance</p>
            <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
              Based on your qualifications for{' '}
              <span className="font-semibold text-sky-700">CCCAP</span>, you are also likely eligible for the{' '}
              <span className="font-semibold text-violet-700">Colorado Child Care Tax Credit (CCTC)</span> — which can refund up to 50% of annual care expenses.
            </p>
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <button
                onClick={() => onNavigate('applications')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-900 transition-colors group"
              >
                Track application status
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <span className="text-violet-300 text-xs">·</span>
              <button
                onClick={() => onNavigate('programs', 'cctc')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-500 hover:text-violet-800 transition-colors group"
              >
                View program details
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setEligibilityBannerDismissed(true)}
            className="w-7 h-7 rounded-full hover:bg-violet-100 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      )}

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

          {/* Pay Provider button — prominent, lives inside the wallet card */}
          <button
            onClick={() => setPayModalOpen(true)}
            className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl py-3 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm mb-4"
          >
            <Send className="w-4 h-4" />
            Pay a Provider
          </button>

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
                {tx.providerId === 'p1' ? '⭐' : tx.providerId === 'p3' ? '🏠' : '🌻'}
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
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100 text-lg font-bold text-amber-400">
          HS
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
