// All functions compute relative to the moment the page loads — always current in the browser.

/** Today as YYYY-MM-DD */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/** Today formatted as "March 26, 2026" */
export function todayLong(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/** First day of month at offset from current month (0=this, -1=last, +2=two ahead) as YYYY-MM-DD */
export function monthStart(offset = 0): string {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  return d.toISOString().split('T')[0]
}

/** "Mar 2026" label for month at offset */
export function monthLabel(offset = 0): string {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/** Next upcoming occurrence of a specific month+day (1-based month).
 *  If today is already past that date this year, returns next year's. */
export function nextAnnual(month: number, day: number): string {
  const now = new Date()
  const candidate = new Date(now.getFullYear(), month - 1, day)
  if (candidate <= now) candidate.setFullYear(now.getFullYear() + 1)
  return candidate.toISOString().split('T')[0]
}

/** N days ago as YYYY-MM-DD */
export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

/** N days from today as YYYY-MM-DD */
export function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

/** Current school year e.g. "2025–2026" (academic year starts in August) */
export function currentSchoolYear(): string {
  const now = new Date()
  const yr = now.getFullYear()
  return now.getMonth() >= 7 ? `${yr}–${yr + 1}` : `${yr - 1}–${yr}`
}

/** Next school year e.g. "2026–2027" */
export function nextSchoolYear(): string {
  const now = new Date()
  const yr = now.getFullYear()
  return now.getMonth() >= 7 ? `${yr + 1}–${yr + 2}` : `${yr}–${yr + 1}`
}

/** Current 4-digit year */
export function thisYear(): number {
  return new Date().getFullYear()
}

/** Format YYYY-MM-DD as "Month D, YYYY" */
export function fmtLong(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/** Format YYYY-MM-DD as "Mon D, YYYY" */
export function fmtShort(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
