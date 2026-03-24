import { Bell, ChevronDown } from 'lucide-react'
import { family } from '../../data/mockData'
import type { PageId } from '../../App'

interface HeaderProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => onNavigate('wallet')}
          className="flex items-center gap-3 group"
        >
          {/* Kid-friendly logo mark: stacked colorful blocks */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute bottom-0 left-0 w-4 h-4 rounded-md bg-sky-400 group-hover:bg-sky-500 transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-md bg-teal-400 group-hover:bg-teal-500 transition-colors" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-md bg-amber-400 group-hover:bg-amber-500 transition-colors" />
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-slate-800 text-sm tracking-tight">ChildCare</div>
            <div className="text-cyan-600 text-xs font-semibold tracking-widest uppercase">Wallet</div>
          </div>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notification bell — scrolls to upcoming deadlines */}
          <button
            onClick={() => {
              onNavigate('wallet')
              setTimeout(() => {
                document.getElementById('upcoming-deadlines')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 80)
            }}
            className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title="View upcoming deadlines"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full ring-2 ring-white" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full pl-1 pr-3 py-1 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
              {family.firstName[0]}{family.lastName[0]}
            </div>
            <span className="text-slate-700 text-sm font-medium hidden sm:block">{family.firstName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  )
}
