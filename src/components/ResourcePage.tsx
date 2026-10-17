import { useState, type FormEvent, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw, X } from 'lucide-react'
import { api, errorMessage } from '../api/client'
import type { ColumnConfig, FieldConfig, ListResponse } from '../types/domain'
import { DataTable } from './DataTable'
import { Loading } from './Loading'
import { PageHeader } from './PageHeader'

type ResourceResponse = ListResponse & { positions?: Record<string, unknown>[] }
function convert(value: FormDataEntryValue, field: FieldConfig): unknown {
  if (field.type === 'number') return Number(value)
  if (field.type === 'boolean') return value === 'true'
  if (field.type === 'json') return JSON.parse(String(value))
  return String(value)
}
function Editor({ title, fields, busy, error, onClose, onSubmit }: { title: string; fields: FieldConfig[]; busy: boolean; error: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span className="eyebrow">Create record</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></header><form onSubmit={onSubmit}><div className="form-grid">{fields.map((field) => <label key={field.name} className={field.type === 'textarea' || field.type === 'json' ? 'wide' : ''}><span>{field.label}</span>{field.type === 'select' || field.type === 'boolean' ? <select name={field.name} required={field.required} defaultValue={String(field.defaultValue ?? field.options?.[0] ?? 'false')}>{(field.type === 'boolean' ? ['false', 'true'] : field.options)?.map((option) => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' || field.type === 'json' ? <textarea name={field.name} required={field.required} defaultValue={String(field.defaultValue ?? (field.type === 'json' ? '[]' : ''))} /> : <input name={field.name} required={field.required} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'password' ? 'password' : 'text'} step={field.type === 'number' ? 'any' : undefined} defaultValue={String(field.defaultValue ?? '')} />}</label>)}</div>{error && <div className="alert error">{error}</div>}<footer><button type="button" className="button ghost" onClick={onClose}>Cancel</button><button className="button primary" disabled={busy}>{busy ? 'Saving…' : 'Save record'}</button></footer></form></section></div>
}
export function ResourcePage({ title, eyebrow, description, endpoint, columns, fields = [], createEndpoint, children, renderActions }: { title: string; eyebrow?: string; description?: string; endpoint: string; columns: ColumnConfig[]; fields?: FieldConfig[]; createEndpoint?: string; children?: ReactNode; renderActions?: (row: Record<string, unknown>, refresh: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['resource', endpoint], queryFn: async () => (await api.get<ResourceResponse>(endpoint)).data })
  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => (await api.post(createEndpoint ?? endpoint, payload)).data,
    onSuccess: async (data) => { if (data?.apiKey) alert(`Copy this API key now; it will not be shown again:\n\n${String(data.apiKey)}`); setOpen(false); setFormError(''); await client.invalidateQueries({ queryKey: ['resource'] }) },
    onError: (error) => setFormError(errorMessage(error))
  })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const data = new FormData(event.currentTarget)
      const payload = Object.fromEntries(fields.flatMap((field) => { const raw = data.get(field.name) ?? ''; return raw === '' && !field.required ? [] : [[field.name, convert(raw, field)]] }))
      mutation.mutate(payload)
    } catch (error) { setFormError(errorMessage(error)) }
  }
  const refresh = () => void query.refetch()
  if (query.isLoading) return <Loading />
  return <><PageHeader eyebrow={eyebrow} title={title} description={description} actions={<><button className="button ghost" onClick={refresh}><RefreshCw size={16} /> Refresh</button>{createEndpoint && <button className="button primary" onClick={() => setOpen(true)}><Plus size={16} /> New</button>}</>} />{query.error && <div className="alert error">{errorMessage(query.error)}</div>}{children}<DataTable rows={query.data?.items ?? query.data?.positions ?? []} columns={columns} renderActions={renderActions ? (row) => renderActions(row, refresh) : undefined} />{open && <Editor title={title} fields={fields} busy={mutation.isPending} error={formError} onClose={() => setOpen(false)} onSubmit={submit} />}</>
}
