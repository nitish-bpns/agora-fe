import { Link } from 'react-router-dom'
export function NotFoundPage() { return <main className="not-found"><span>404</span><h1>That market surface does not exist.</h1><p>The route may have moved or your current portal cannot expose it.</p><Link className="button primary" to="/">Return to Agora</Link></main> }
