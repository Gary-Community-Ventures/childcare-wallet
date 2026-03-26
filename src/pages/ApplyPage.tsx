import { useState } from 'react'
import {
  Building2, GraduationCap, MapPin, Rocket,
  CheckCircle, ChevronRight, Clock, FileText,
  Info, AlertTriangle, ArrowLeft, Upload, FolderOpen, X
} from 'lucide-react'
import { programs, applications, children } from '../data/mockData'
import { formatShortDate, daysUntil } from '../lib/utils'
import { cn } from '../lib/utils'
import type { PageId } from '../App'

// Build document vault once (same logic as ApplicationsPage)
type DocVaultEntry = { children: string[]; programs: { id: string; name: string }[] }
const docVault = new Map<string, DocVaultEntry>()
applications.forEach(app => {
  if (!app.documents || app.documents.length === 0) return
  const programInfo = programs[app.program as keyof typeof programs]
  const enrolledIds: string[] = programInfo?.enrolledChildren ?? []
  const childNames = enrolledIds.length > 0
    ? children.filter(c => enrolledIds.includes(c.id)).map(c => c.name.split(' ')[0])
    : children.map(c => c.name.split(' ')[0])
  app.documents.forEach(doc => {
    if (!docVault.has(doc)) docVault.set(doc, { children: [], programs: [] })
    const entry = docVault.get(doc)!
    childNames.forEach(n => { if (!entry.children.includes(n)) entry.children.push(n) })
    if (!entry.programs.find(p => p.id === app.program))
      entry.programs.push({ id: app.program, name: app.programName })
  })
})

interface ApplyPageProps {
  onNavigate: (page: PageId) => void
}

type AppProgram = 'cccap' | 'upk' | 'larimer' | 'cap'
type AppType = 'initial' | 'renewal' | 'appeal'

const programApplyConfig: Record<AppProgram, {
  icon: React.ReactNode
  gradient: string
  requirements: string[]
  processingTime: string
  renewalNote?: string
}> = {
  cccap: {
    icon: <Building2 className="w-5 h-5" />,
    gradient: 'from-blue-700 to-sky-500',
    requirements: [
      'Proof of income (recent pay stubs or tax return)',
      'Proof of Colorado residency (utility bill, lease)',
      'Child birth certificates for each enrolled child',
      'Proof of work, school, or training schedule',
      'Social Security numbers for all household members',
    ],
    processingTime: '10–15 business days',
    renewalNote: 'Submit by November 1 each year to avoid any gap in coverage.',
  },
  upk: {
    icon: <GraduationCap className="w-5 h-5" />,
    gradient: 'from-emerald-700 to-green-500',
    requirements: [
      'Child birth certificate (must be turning 4 by October 1)',
      'Proof of Colorado residency',
      'Income verification (for additional hours qualification)',
      'Dual language learner or disability documentation (if applicable)',
    ],
    processingTime: '3–5 business days (matching takes up to 2 weeks)',
    renewalNote: 'Enrollment opens in February each year for the following school year.',
  },
  larimer: {
    icon: <MapPin className="w-5 h-5" />,
    gradient: 'from-amber-700 to-yellow-500',
    requirements: [
      'Current CCCAP enrollment confirmation letter',
      'Proof of Larimer County residency',
      'Most recent income documentation',
      'Child care provider confirmation',
    ],
    processingTime: '5–7 business days',
    renewalNote: 'Annual renewal required by January 15.',
  },
  cap: {
    icon: <Rocket className="w-5 h-5" />,
    gradient: 'from-violet-700 to-purple-500',
    requirements: [
      'CCCAP or UPK enrollment confirmation',
      'Larimer County residency verification',
      'Participation agreement signed',
      'Digital wallet consent form',
    ],
    processingTime: 'Enrollment by invitation — contact Gary Community Ventures',
    renewalNote: 'CAP pilot ends June 30, 2026. No renewal required.',
  },
}

export function ApplyPage({ onNavigate }: ApplyPageProps) {
  const [selectedProgram, setSelectedProgram] = useState<AppProgram | null>(null)
  const [appType, setAppType] = useState<AppType>('initial')
  const [formStep, setFormStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: 'Maria',
    lastName: 'Rivera',
    phone: '(970) 555-0142',
    email: 'maria.rivera@email.com',
    address: '1847 Pinecone Dr, Fort Collins, CO 80521',
    program: '',
    type: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [selectedVaultDocs, setSelectedVaultDocs] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [vaultExpanded, setVaultExpanded] = useState(true)

  const toggleVaultDoc = (doc: string) =>
    setSelectedVaultDocs(prev =>
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    )

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map(f => f.name)
    setUploadedFiles(prev => [...prev, ...files.filter(f => !prev.includes(f))])
    e.target.value = ''
  }

  const removeUploadedFile = (i: number) =>
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))

  const programOrder: AppProgram[] = ['cccap', 'upk', 'larimer', 'cap']

  const upcomingRenewals = [
    { program: 'cccap' as AppProgram, deadline: '2026-11-01', label: 'CCCAP Renewal' },
    { program: 'upk' as AppProgram, deadline: '2025-04-15', label: 'UPK 2025–26 Enrollment' },
    { program: 'larimer' as AppProgram, deadline: '2026-01-15', label: 'Larimer County Renewal' },
  ]

  if (submitted) {
    return (
      <div className="space-y-6 animate-slide-up max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600">
            Your {selectedProgram ? programs[selectedProgram].name : ''} application has been submitted successfully.
            You'll receive a confirmation by email within 1–2 business days.
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            Processing time: {selectedProgram ? programApplyConfig[selectedProgram].processingTime : '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileText className="w-4 h-4 text-slate-400" />
            Confirmation sent to: {formData.email}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onNavigate('applications')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Track Application
          </button>
          <button
            onClick={() => { setSubmitted(false); setSelectedProgram(null); setFormStep(0) }}
            className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        {selectedProgram && (
          <button
            onClick={() => { setSelectedProgram(null); setFormStep(0) }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Applications Portal</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            All childcare assistance applications in one place
          </p>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm">
          This portal consolidates all childcare subsidy applications — CCCAP, UPK Colorado, Larimer County, and the CAP pilot — into a single experience. Submit, renew, and track everything here.
        </p>
      </div>

      {/* Upcoming renewal deadlines */}
      <div>
        <h2 className="font-semibold text-slate-900 text-base mb-3">Upcoming Renewal Deadlines</h2>
        <div className="space-y-2">
          {upcomingRenewals.map(r => {
            const days = daysUntil(r.deadline)
            return (
              <div key={r.program} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-slate-900 text-sm">{r.label}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-amber-700 text-xs font-medium">{formatShortDate(r.deadline)}</span>
                    <span className="text-slate-400 text-xs">({days} days)</span>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedProgram(r.program); setAppType('renewal'); setFormStep(1) }}
                  className="text-blue-600 text-xs font-semibold flex items-center gap-0.5 hover:text-blue-800"
                >
                  Renew <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {!selectedProgram ? (
        /* Program selection */
        <div>
          <h2 className="font-semibold text-slate-900 text-base mb-3">Select a Program to Apply</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programOrder.map((pid) => {
              const p = programs[pid]
              const config = programApplyConfig[pid]
              const gradMap = { cccap: 'linear-gradient(135deg, #1e40af, #0ea5e9)', upk: 'linear-gradient(135deg, #166534, #22c55e)', larimer: 'linear-gradient(135deg, #92400e, #f59e0b)', cap: 'linear-gradient(135deg, #5b21b6, #a78bfa)' }
              return (
                <button
                  key={pid}
                  onClick={() => { setSelectedProgram(pid); setFormStep(1) }}
                  className="rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all text-left overflow-hidden group program-card"
                >
                  <div className="h-2" style={{ background: gradMap[pid] }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-display font-bold text-slate-900 text-base">{p.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{p.fullName}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">⏱ {config.processingTime}</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                        background: p.lightColor, color: p.color
                      }}>Apply →</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* Application form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          {/* Form header */}
          <div
            className="p-6 text-white"
            style={{ background: { cccap: 'linear-gradient(135deg, #1e40af, #0ea5e9)', upk: 'linear-gradient(135deg, #166534, #22c55e)', larimer: 'linear-gradient(135deg, #92400e, #f59e0b)', cap: 'linear-gradient(135deg, #5b21b6, #a78bfa)' }[selectedProgram] }}
          >
            <div className="text-white/70 text-xs uppercase tracking-widest mb-1">{programs[selectedProgram].name}</div>
            <h2 className="font-display text-xl font-bold">{appType === 'renewal' ? 'Renewal Application' : appType === 'appeal' ? 'Appeal / Reconsideration' : 'New Application'}</h2>
            <p className="text-white/70 text-sm mt-1">{programs[selectedProgram].fullName}</p>

            {/* Steps */}
            <div className="flex items-center gap-2 mt-4">
              {['Select Program', 'Your Info', 'Documents', 'Review'].map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    formStep > i ? 'bg-green-400 text-white' : formStep === i ? 'bg-white text-blue-700' : 'bg-white/20 text-white/60'
                  )}>
                    {formStep > i ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {i < 3 && <div className={cn('w-8 h-0.5', formStep > i ? 'bg-green-400' : 'bg-white/20')} />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Application type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Application Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['initial', 'renewal', 'appeal'] as AppType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setAppType(type)}
                    className={cn(
                      'py-2 px-3 rounded-xl border text-sm font-medium transition-all capitalize',
                      appType === type ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {type === 'initial' ? 'New Application' : type === 'renewal' ? 'Renewal' : 'Appeal/Recon.'}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'First Name', key: 'firstName', type: 'text' },
                { label: 'Last Name', key: 'lastName', type: 'text' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Email Address', key: 'email', type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Home Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Required documents */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Required Documents</label>
              <p className="text-slate-500 text-xs mb-3">
                Please have the following documents ready. You can upload them digitally or bring them to your county office.
              </p>
              <div className="space-y-2">
                {programApplyConfig[selectedProgram].requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700">Documents Upload</label>
                <span className="text-xs text-slate-400">{selectedVaultDocs.length + uploadedFiles.length} attached</span>
              </div>
              <p className="text-slate-500 text-xs mb-3">
                Select from your Document Vault to reuse previously submitted files, or upload new ones.
              </p>

              {/* Vault reuse panel */}
              {docVault.size > 0 && (
                <div className="mb-3 rounded-xl border border-violet-100 bg-violet-50/50 overflow-hidden">
                  <button
                    onClick={() => setVaultExpanded(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-violet-700 uppercase tracking-wide">
                      <FolderOpen className="w-3.5 h-3.5" /> Document Vault
                      <span className="bg-violet-200 text-violet-800 px-1.5 py-0.5 rounded-full text-xs font-bold">{docVault.size}</span>
                    </span>
                    <ChevronRight className={cn('w-4 h-4 text-violet-400 transition-transform', vaultExpanded ? 'rotate-90' : '')} />
                  </button>
                  {vaultExpanded && (
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                      {Array.from(docVault.entries()).map(([docName, entry]) => {
                        const isSelected = selectedVaultDocs.includes(docName)
                        return (
                          <button
                            key={docName}
                            type="button"
                            onClick={() => toggleVaultDoc(docName)}
                            className={cn(
                              'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-all text-left',
                              isSelected
                                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                                : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-100'
                            )}
                          >
                            {isSelected
                              ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                              : <FileText className="w-3 h-3 flex-shrink-0" />}
                            <span className="truncate max-w-[180px]">{docName}</span>
                            {entry.children.length > 0 && (
                              <span className="opacity-60 font-normal">
                                · {entry.children.map(c => children.find(ch => ch.name.split(' ')[0] === c)?.avatar).join('')}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* New file upload area */}
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                onClick={() => document.getElementById('doc-upload-input')?.click()}
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-sm text-slate-600 font-medium">Drop files here or <span className="text-blue-600">browse</span></p>
                <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG — up to 10 MB each</p>
                <input
                  id="doc-upload-input"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Attached summary */}
              {(selectedVaultDocs.length > 0 || uploadedFiles.length > 0) && (
                <div className="mt-3 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Attached ({selectedVaultDocs.length + uploadedFiles.length})
                  </div>
                  {selectedVaultDocs.map(doc => (
                    <div key={doc} className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                      <FolderOpen className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                      <span className="text-xs text-slate-700 flex-1 truncate">{doc}</span>
                      <span className="text-xs text-violet-500 font-medium whitespace-nowrap">From vault</span>
                      <button type="button" onClick={() => toggleVaultDoc(doc)} className="text-slate-300 hover:text-slate-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <FileText className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-slate-700 flex-1 truncate">{f}</span>
                      <span className="text-xs text-green-600 font-medium whitespace-nowrap">New upload</span>
                      <button type="button" onClick={() => removeUploadedFile(i)} className="text-slate-300 hover:text-slate-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Renewal note */}
            {programApplyConfig[selectedProgram].renewalNote && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">{programApplyConfig[selectedProgram].renewalNote}</p>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Additional Notes (Optional)</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            {/* Submit */}
            <button
              onClick={() => setSubmitted(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <CheckCircle className="w-5 h-5" />
              Submit {appType === 'renewal' ? 'Renewal ' : ''}Application
            </button>

            <p className="text-slate-400 text-xs text-center">
              By submitting, you confirm the information provided is accurate. You will receive email confirmation within 1–2 business days.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
