export type Realm = 'Desk' | 'Broker' | 'Exchange' | 'Storage'
export type Role = 'Admin' | 'Operations' | 'Read-only' | 'Trader'
export interface Session { token: string; kind: 'operator' | 'trader'; realm: Realm; role: Role; displayName: string; accountId?: string }
export interface ListResponse<T = Record<string, unknown>> { items: T[]; total?: number; page?: number; limit?: number }
export interface FieldConfig { name: string; label: string; type?: 'text' | 'password' | 'number' | 'date' | 'select' | 'boolean' | 'textarea' | 'json'; required?: boolean; options?: string[]; defaultValue?: string | number | boolean }
export interface ColumnConfig { key: string; label: string; format?: 'money' | 'number' | 'date' | 'status' }
