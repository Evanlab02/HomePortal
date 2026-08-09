import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../components/Icon'
import type { DiscoveryIssue, PrototypeDefinition, PrototypeStatus } from '../types/prototype'

type Filter = 'all' | PrototypeStatus

const filters: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'exploratory', label: 'Exploratory' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'ready', label: 'Ready' },
]

const statusLabels: Record<PrototypeStatus, string> = {
  exploratory: 'Exploratory',
  'in-progress': 'In progress',
  ready: 'Ready',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export function PrototypeIndex({
  prototypes,
  issues,
}: {
  prototypes: PrototypeDefinition[]
  issues: DiscoveryIssue[]
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visiblePrototypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return prototypes.filter(({ meta }) => {
      const matchesFilter = filter === 'all' || meta.status === filter
      const haystack = [meta.name, meta.description, ...(meta.tags ?? [])]
        .join(' ')
        .toLowerCase()
      return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [filter, prototypes, query])

  return (
    <main className="index-page">
      <header className="index-header">
        <div>
          <h1>Prototypes</h1>
          <p>
            Independent workspaces for exploring HomePortal before product code.
          </p>
        </div>
        <div className="index-header__count" aria-label={`${prototypes.length} prototypes`}>
          <strong>{String(prototypes.length).padStart(2, '0')}</strong>
          <span>in the index</span>
        </div>
      </header>

      {issues.length > 0 && (
        <section className="discovery-issues" aria-labelledby="discovery-title">
          <Icons.CircleAlert aria-hidden="true" />
          <div>
            <h2 id="discovery-title">Some prototypes could not be indexed</h2>
            <ul>
              {issues.map((issue) => <li key={issue.message}>{issue.message}</li>)}
            </ul>
          </div>
        </section>
      )}

      <section aria-label="Prototype index">
        <div className="index-controls">
          <label className="index-search">
            <Icons.Search aria-hidden="true" />
            <span className="sr-only">Search prototypes</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, description, or tag"
              type="search"
              value={query}
            />
          </label>
          <div className="index-filters" aria-label="Filter prototypes by status">
            {filters.map(({ id, label }) => (
              <button
                aria-pressed={filter === id}
                key={id}
                onClick={() => setFilter(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visiblePrototypes.length > 0 ? (
          <ol className="prototype-list">
            {visiblePrototypes.map(({ meta }, index) => (
              <li key={meta.id}>
                <Link to={`/prototypes/${meta.id}`}>
                  <span className="prototype-list__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="prototype-list__body">
                    <span className="prototype-list__title-row">
                      <strong>{meta.name}</strong>
                      <span className={`status status--${meta.status}`}>
                        {statusLabels[meta.status]}
                      </span>
                    </span>
                    <span className="prototype-list__description">{meta.description}</span>
                    <span className="prototype-list__meta">
                      Updated {formatDate(meta.updatedAt)}
                      {meta.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                    </span>
                  </span>
                  <span className="prototype-list__open">
                    Open <Icons.ChevronRight aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="index-empty">
            <h2>{prototypes.length === 0 ? 'No prototypes yet' : 'No matching prototypes'}</h2>
            <p>
              {prototypes.length === 0
                ? 'Add a folder under src/prototypes to create the first index entry.'
                : 'Try a different search term or clear the current status filter.'}
            </p>
            {prototypes.length > 0 && (
              <button
                className="btn btn-neutral btn-sm"
                onClick={() => { setQuery(''); setFilter('all') }}
                type="button"
              >
                <Icons.RotateCcw aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      <footer className="index-footer">
        <span>Vite · React · Tailwind · daisyUI · Sass</span>
        <span>Contributor conventions live in AGENTS.md</span>
      </footer>
    </main>
  )
}
