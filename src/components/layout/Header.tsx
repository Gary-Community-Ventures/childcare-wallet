import { Bell, ChevronDown, Wallet } from 'lucide-react'
import { family } from '../../data/mockData'
import type { PageId } from '../../App'

interface HeaderProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('wallet')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-sky-500/30 transition-shadow">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-white text-sm tracking-tight">ChildCare</div>
            <div className="text-sky-400 text-xs font-medium tracking-widest uppercase">Wallet</div>
          </div>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <Bell className="w-4 h-4 text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full ring-2 ring-slate-900" style={{background: '#ff5733'}} />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full pl-1 pr-3 py-1 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {family.firstName[0]}{family.lastName[0]}
            </div>
            <span className="text-white text-sm font-medium hidden sm:block">{family.firstName}</span>
            <ChevronDown className="w-3 h-3 text-white/60 hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Pilot banner */}
      <div className="bg-gradient-to-r from-violet-900/80 to-purple-900/80 border-t border-violet-700/40">
        <div className="max-w-5xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <p className="text-violet-200 text-xs">
            <span className="font-semibold text-violet-100">🚀 CAP Pilot Active</span>
            {' '}— Gary Community Ventures Family-Directed Wallet Prototype
          </p>
          <span className="text-violet-300 text-xs hidden sm:block">Pilot ends June 30, 2026</span>
        </div>
      </div>
    </header>
  )
}
