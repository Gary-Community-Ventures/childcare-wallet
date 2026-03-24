import { Wallet, LayoutGrid, FileText, Users, PlusCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { PageId } from '../../App'

interface NavigationProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

const navItems: { id: PageId; label: string; icon: React.ReactNode; mobileLabel: string }[] = [
  { id: 'wallet', label: 'My Wallet', mobileLabel: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
  { id: 'programs', label: 'Programs', mobileLabel: 'Programs', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'applications', label: 'Applications', mobileLabel: 'Apps', icon: <FileText className="w-4 h-4" /> },
  { id: 'providers', label: 'My Providers', mobileLabel: 'Providers', icon: <Users className="w-4 h-4" /> },
  { id: 'apply', label: 'Apply', mobileLabel: 'Apply', icon: <PlusCircle className="w-4 h-4" /> },
]

export function Navigation({ activePage, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 sm:px-5 py-3.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
                activePage === item.id
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <span className={cn(
                'transition-colors',
                activePage === item.id ? 'text-blue-600' : 'text-slate-400'
              )}>
                {item.icon}
              </span>
              <span className="hidden sm:block">{item.label}</span>
              <span className="sm:hidden">{item.mobileLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
