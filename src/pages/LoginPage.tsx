import { useState, type FormEvent } from 'react'
import { LockKeyhole, ShieldCheck, UserRoundSearch } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { errorMessage } from '../api/client'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (auth.session) return <Navigate to={`/${auth.session.realm.toLowerCase()}`} replace />

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const session = await auth.login(String(form.get('username')), String(form.get('password')))
      navigate(`/${session.realm.toLowerCase()}`, { replace: true })
    } catch (reason) {
      setError(errorMessage(reason))
    } finally {
      setBusy(false)
    }
  }

  return <main className="login-page"><section className="login-story"><div className="brand large"><span>AG</span><div><strong>Agora</strong><small>Market operating system</small></div></div><div className="story-copy"><span className="eyebrow">One ledger. Four authorities.</span><h1>Trade with clarity.<br />Settle with proof.</h1><p>A complete operating surface for traders, brokers, exchange operators and custody teams—designed around immutable history and explicit market states.</p></div><div className="trust-row"><span><ShieldCheck /> Role-aware access</span><span><LockKeyhole /> Audited mutations</span></div></section><section className="login-panel"><form onSubmit={submit}><div><span className="eyebrow">Secure access</span><h2>Sign in to Agora</h2><p>Enter your credentials. Agora identifies your user type and opens the correct workspace automatically.</p></div><div className="callout"><UserRoundSearch size={18} /><strong>Automatic routing</strong><span>Trader · Broker · Exchange · Storage</span></div><label><span>Username</span><input name="username" required autoComplete="username" inputMode="email" placeholder="name@agora.com" /></label><label><span>Password</span><input name="password" required type="password" autoComplete="current-password" placeholder="••••••••••••" /></label>{error && <div className="alert error">{error}</div>}<button className="button primary submit" disabled={busy}>{busy ? 'Identifying workspace…' : 'Continue securely'}</button><small className="form-note">Your dashboard is selected from the user type stored in MongoDB.</small></form></section></main>
}
