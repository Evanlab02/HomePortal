import { Link } from 'react-router-dom'
import { Icons } from '../components/Icon'

export function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>This prototype is not in the index</h1>
      <p>Check the URL or return to the prototype index to choose an available workspace.</p>
      <Link className="btn btn-neutral" to="/">
        <Icons.ArrowLeft aria-hidden="true" /> Return to index
      </Link>
    </main>
  )
}
