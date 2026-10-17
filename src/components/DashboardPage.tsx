import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, ArrowUpRight } from 'lucide-react'
import { api, errorMessage } from '../api/client'
import { Loading } from './Loading'
import { PageHeader } from './PageHeader'

function label(key: string) { return key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()) }
function show(value: unknown): string { if (typeof value === 'number') return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value); if (value && typeof value === 'object') return 'View details'; return String(value ?? '—') }
export function DashboardPage({ realm, endpoint, description, action }: { realm: string; endpoint: string; description: string; action?: ReactNode }) {
  const query = useQuery({ queryKey: ['dashboard', endpoint], queryFn: async () => (await api.get<Record<string, unknown>>(endpoint)).data })
  if (query.isLoading) return <Loading />
  const metrics = Object.entries(query.data ?? {}).filter(([, value]) => typeof value !== 'object').slice(0, 8)
  return <><PageHeader eyebrow={`${realm} control plane`} title="Dashboard" description={description} actions={action ?? <span className="live"><i /> Live system</span>} />{query.error && <div className="alert error">{errorMessage(query.error)}</div>}<div className="metric-grid">{metrics.map(([key, value], index) => <article className="metric-card" key={key}><div className="metric-icon"><Activity size={18} /></div><span>{label(key)}</span><strong>{show(value)}</strong><small>{index % 2 === 0 ? 'Authoritative current state' : 'Updated from the ledger'} <ArrowUpRight size={12} /></small></article>)}</div><section className="info-panel"><div><span className="eyebrow">Operational model</span><h2>Traceable by construction</h2></div><p>Every material change is recorded in the audit ledger. Exchange, broker, desk and custody records retain separate ownership even though they share one deployment.</p></section></>
}
