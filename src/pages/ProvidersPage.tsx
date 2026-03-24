import { useState } from 'react'
import {
  MapPin, Phone, Clock, Star, Users, CheckCircle,
  ChevronRight, Home, Building2, Heart, Shield
} from 'lucide-react'
import { providers, programs } from '../data/mockData'
import { formatCurrency, formatShortDate } from '../lib/utils'
import { cn } from '../lib/utils'

type ProviderFilter = 'all' | 'licensed-center' | 'licensed-home' | 'ffn'

const typeConfig = {
  'licensed-center': {
    label: 'Licensed Center',
    icon: <Building2 className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700',
    description: 'State-licensed childcare centers with structured programs',
  },
  'licensed-home': {
    label: 'Licensed Home',
    icon: <Home className="w-4 h-4" />,
    color: 'bg-emerald-100 text-emerald-700',
    description: 'Licensed home-based providers in a family setting',
  },
  'ffn': {
    label: 'Family, Friend & Neighbor',
    icon: <Heart className="w-4 h-4" />,
    color: 'bg-violet-100 text-violet-700',
    description: 'Trusted, informal caregivers including relatives',
  },
}

export function ProvidersPage() {
  const [filter, setFilter] = useState<ProviderFilter>('all')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const filtered = filter === 'all' ? providers : providers.filter(p => p.type === filter)
  const enrolledProviders = providers.filter(p => p.enrolledChildren.length > 0)

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">My Providers</h1>
        <p className="text-slate-500 text-sm mt-1">Childcare providers connected to your wallet</p>
      </div>

      {/* Provider type legend */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(typeConfig) as [keyof typeof typeConfig, typeof typeConfig[keyof typeof typeConfig]][]).map(([type, config]) => {
          const count = providers.filter(p => p.type === type).length
          return (
            <button
              key={type}
              onClick={() => setFilter(filter === type ? 'all' : type)}
              className={cn(
                'rounded-2xl p-4 text-left transition-all border',
                filter === type ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-md',
                'bg-white border-slate-200'
              )}
            >
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', config.color)}>
                {config.icon}
              </div>
              <div className="font-semibold text-slate-900 text-sm">{config.label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{count} provider{count !== 1 ? 's' : ''}</div>
            </button>
          )
        })}
      </div>

      {/* Currently enrolled summary */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Currently Enrolled</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {enrolledProviders.map(p => (
            <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: p.bgColor }}
              >
                {p.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">{p.name}</div>
                <div className="text-white/60 text-xs">{p.typeLabel}</div>
                <div className="flex gap-1 mt-1">
                  {p.enrolledChildren.map(cId => {
                    const programs_list = p.programs.slice(0, 2)
                    return programs_list.map(prog => (
                      <span
                        key={`${cId}-${prog}`}
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          background: programs[prog as keyof typeof programs]?.lightColor || '#e2e8f0',
                          color: programs[prog as keyof typeof programs]?.color || '#64748b',
                        }}
                      >
                        {programs[prog as keyof typeof programs]?.name || prog}
                      </span>
                    ))
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter display */}
      {filter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Showing:</span>
          <span className={cn('text-xs px-3 py-1 rounded-full font-medium', typeConfig[filter].color)}>
            {typeConfig[filter].label}
          </span>
          <button onClick={() => setFilter('all')} className="text-xs text-slate-400 hover:text-slate-600">Clear</button>
        </div>
      )}

      {/* Provider cards */}
      <div className="space-y-4">
        {filtered.map((provider) => {
          const isSelected = selectedProvider === provider.id
          const typeConf = typeConfig[provider.type as keyof typeof typeConfig]
          const isEnrolled = provider.enrolledChildren.length > 0

          return (
            <div
              key={provider.id}
              className={cn(
                'bg-white rounded-2xl border shadow-sm overflow-hidden transition-all program-card',
                isEnrolled ? 'border-slate-200' : 'border-slate-100',
                isSelected ? 'shadow-lg' : 'hover:shadow-md'
              )}
            >
              {/* Card header */}
              <div
                className="px-5 py-5 flex items-start gap-4 cursor-pointer"
                onClick={() => setSelectedProvider(isSelected ? null : provider.id)}
              >
                {/* Logo */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm"
                  style={{ background: provider.bgColor }}
                >
                  {provider.logo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-slate-900 text-base">{provider.name}</h3>
                        {isEnrolled && (
                          <span className="status-active text-xs px-2 py-0.5 rounded-full flex-shrink-0">Enrolled</span>
                        )}
                      </div>
                      <span className={cn('inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium mt-1', typeConf.color)}>
                        {typeConf.icon} {typeConf.label}
                      </span>
                    </div>
                    <ChevronRight className={cn('w-5 h-5 text-slate-400 flex-shrink-0 transition-transform mt-0.5', isSelected ? 'rotate-90' : '')} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{provider.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{provider.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Star className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                      <span>{provider.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{provider.phone}</span>
                    </div>
                  </div>

                  {/* Accepted programs */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {provider.programs.map(prog => (
                      <span
                        key={prog}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: programs[prog as keyof typeof programs]?.lightColor || '#f1f5f9',
                          color: programs[prog as keyof typeof programs]?.color || '#64748b',
                        }}
                      >
                        {programs[prog as keyof typeof programs]?.name || prog}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isSelected && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4 animate-slide-up">
                  {/* Provider details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-500 text-xs mb-1">Age Range</div>
                      <div className="font-semibold text-slate-900 text-sm">{provider.ageRange}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Capacity
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">{provider.currentEnrollment}/{provider.capacity}</div>
                    </div>
                    <div className={cn('rounded-xl p-3', provider.acceptingEnrollment ? 'bg-green-50' : 'bg-red-50')}>
                      <div className={cn('text-xs mb-1', provider.acceptingEnrollment ? 'text-green-600' : 'text-red-500')}>
                        Enrollment
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {provider.acceptingEnrollment ? '✓ Open' : '✗ Full'}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-500 text-xs mb-1">Director</div>
                      <div className="font-semibold text-slate-900 text-sm">{provider.director}</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  {provider.specialties && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-2">
                        {provider.specialties.map(spec => (
                          <span key={spec} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FFN-specific note */}
                  {provider.type === 'ffn' && (provider as any).note && (
                    <div className="flex items-start gap-2 bg-violet-50 border border-violet-100 rounded-xl p-3">
                      <Shield className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-violet-900 text-xs mb-0.5">Verified FFN Provider</div>
                        <p className="text-violet-700 text-xs">{(provider as any).note}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment history */}
                  {provider.monthlyPayments && provider.monthlyPayments.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recent Payments</div>
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        {provider.monthlyPayments.slice(0, 3).map((pay, i) => (
                          <div
                            key={`${pay.month}-${i}`}
                            className={cn('flex items-center justify-between px-4 py-3', i < 2 ? 'border-b border-slate-100' : '')}
                          >
                            <div>
                              <div className="font-medium text-slate-900 text-sm">{pay.month}</div>
                              <div className="text-slate-400 text-xs">{formatShortDate(pay.date)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{formatCurrency(pay.amount)}</span>
                              <div className="flex items-center gap-1 text-green-600 text-xs">
                                <CheckCircle className="w-3.5 h-3.5" /> Paid
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add provider CTA */}
      <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-blue-300 transition-colors bg-white">
        <div className="text-3xl mb-2">➕</div>
        <div className="font-semibold text-slate-700 mb-1">Add a New Provider</div>
        <p className="text-slate-400 text-sm">
          Want to use your wallet with a different provider? Register licensed centers, home providers, or FFN caregivers.
        </p>
        <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
          Register a Provider
        </button>
      </div>
    </div>
  )
}
