import { createContext, useContext } from 'react'
import type { Session } from '../types/domain'

export interface AuthValue { session: Session | null; login: (username: string, password: string) => Promise<Session>; logout: () => Promise<void> }
export const AuthContext = createContext<AuthValue | null>(null)
export function useAuth(): AuthValue { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider is required'); return value }
