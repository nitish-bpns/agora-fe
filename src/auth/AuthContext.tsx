import { useMemo, useState, type PropsWithChildren } from 'react'
import { api, SESSION_KEY } from '../api/client'
import type { Session } from '../types/domain'
import { AuthContext, type AuthValue } from './useAuth'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(() => { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) as Session : null })
  const save = (next: Session) => { localStorage.setItem(SESSION_KEY, JSON.stringify(next)); setSession(next); return next }
  const value = useMemo<AuthValue>(() => ({
    session,
    login: async (username, password) => { const { data } = await api.post('/auth/login', { username, password }); return save({ token: data.token, kind: data.kind, realm: data.realm, role: data.role, displayName: data.user.displayName, ...(data.user.accountId ? { accountId: data.user.accountId } : {}) }) },
    logout: async () => { if (session?.kind === 'trader') await api.post('/trader/auth/logout').catch(() => undefined); localStorage.removeItem(SESSION_KEY); setSession(null) }
  }), [session])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
