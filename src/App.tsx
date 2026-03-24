import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Navigation } from './components/layout/Navigation'
import { WalletPage } from './pages/WalletPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ProvidersPage } from './pages/ProvidersPage'
import { ApplyPage } from './pages/ApplyPage'

export type PageId = 'wallet' | 'programs' | 'applications' | 'providers' | 'apply'

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('wallet')

  const renderPage = () => {
    switch (activePage) {
      case 'wallet': return <WalletPage onNavigate={setActivePage} />
      case 'programs': return <ProgramsPage onNavigate={setActivePage} />
      case 'applications': return <ApplicationsPage onNavigate={setActivePage} />
      case 'providers': return <ProvidersPage />
      case 'apply': return <ApplyPage onNavigate={setActivePage} />
      default: return <WalletPage onNavigate={setActivePage} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <Navigation activePage={activePage} onNavigate={setActivePage} />
      <main className="max-w-5xl mx-auto px-4 pb-16 pt-4 animate-fade-in">
        {renderPage()}
      </main>
    </div>
  )
}
