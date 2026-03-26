import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Navigation } from './components/layout/Navigation'
import { WalletPage } from './pages/WalletPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ProvidersPage } from './pages/ProvidersPage'
import { ApplyPage } from './pages/ApplyPage'
import { ChildrenPage } from './pages/ChildrenPage'

export type PageId = 'wallet' | 'programs' | 'applications' | 'providers' | 'children' | 'apply'

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('wallet')
  const [programFocus, setProgramFocus] = useState<string | null>(null)

  const handleNavigate = (page: PageId, program?: string) => {
    setActivePage(page)
    setProgramFocus(program ?? null)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'wallet': return <WalletPage onNavigate={handleNavigate} />
      case 'programs': return <ProgramsPage onNavigate={handleNavigate} initialProgram={programFocus ?? undefined} />
      case 'applications': return <ApplicationsPage onNavigate={handleNavigate} />
      case 'providers': return <ProvidersPage />
      case 'children': return <ChildrenPage />
      case 'apply': return <ApplyPage onNavigate={handleNavigate} />
      default: return <WalletPage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f7f9fc'}}>
      <Header activePage={activePage} onNavigate={handleNavigate} />
      <Navigation activePage={activePage} onNavigate={handleNavigate} />
      <main className="max-w-5xl mx-auto px-4 pb-16 pt-4 animate-fade-in">
        {renderPage()}
      </main>
    </div>
  )
}
