export function Loading() { return <div className="loading"><span /><p>Loading market data…</p></div> }
export function EmptyState({ title, detail }: { title: string; detail?: string }) { return <div className="empty-state"><strong>{title}</strong>{detail && <p>{detail}</p>}</div> }
