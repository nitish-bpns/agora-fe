import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, errorMessage } from '../../api/client'
import { Loading } from '../../components/Loading'
import { PageHeader } from '../../components/PageHeader'

export function BrokerProfilePage() {
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['broker-profile'], queryFn: async () => (await api.get('/broker/profile')).data.profile })
  const mutation = useMutation({ mutationFn: async (payload: Record<string, unknown>) => (await api.put('/broker/profile', payload)).data, onSuccess: async () => { await client.invalidateQueries({ queryKey: ['broker-profile'] }) } })
  if (query.isLoading) return <Loading />
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); mutation.mutate({ exchangeBrokerId: String(data.get('exchangeBrokerId')), mandiId: String(data.get('mandiId')), principalStepIn: data.get('principalStepIn') === 'true' }) }
  return <><PageHeader eyebrow="Broker / Membership" title="Exchange membership" description="Bind this broker module to one exchange member and one venue. Cross-venue replicas are refused." /><section className="settings-card"><form key={JSON.stringify(query.data)} onSubmit={submit}><div className="form-grid"><label><span>Exchange broker ID</span><input name="exchangeBrokerId" required defaultValue={query.data?.exchangeBrokerId ?? ''} /></label><label><span>Mandi ID</span><input name="mandiId" required defaultValue={query.data?.mandiId ?? ''} /></label><label><span>Principal step-in</span><select name="principalStepIn" defaultValue={String(query.data?.principalStepIn ?? false)}><option value="false">Disabled</option><option value="true">Enabled</option></select></label></div>{mutation.error && <div className="alert error">{errorMessage(mutation.error)}</div>}<button className="button primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : 'Save membership'}</button></form></section></>
}
