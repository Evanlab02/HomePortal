import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../components/Icon'
import type { DiscoveryIssue, PrototypeDefinition, PrototypeStatus } from '../types/prototype'

type EngineTheme = 'system' | 'light' | 'dark'
type Sort = 'updated' | 'name' | 'status'

const statusFilters: Array<{ id: PrototypeStatus; label: string }> = [
  { id: 'exploratory', label: 'Exploratory' },
  { id: 'in-progress', label: 'In progress' },
  { id: 're-review', label: 'Re-review' },
  { id: 'ready', label: 'Ready' },
  { id: 'implemented', label: 'Implemented' },
]

const statusOrder: PrototypeStatus[] = ['re-review', 'in-progress', 'exploratory', 'ready', 'implemented']

const statusLabels: Record<PrototypeStatus, string> = {
  exploratory: 'Exploratory',
  'in-progress': 'In progress',
  're-review': 'Re-review',
  ready: 'Ready',
  implemented: 'Implemented',
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
  const [selectedStatuses, setSelectedStatuses] = useState<PrototypeStatus[]>([])
  const [selectedTag, setSelectedTag] = useState('all')
  const [sort, setSort] = useState<Sort>('updated')
  const [theme, setTheme] = useState<EngineTheme>(() =>
    (localStorage.getItem('prototype-engine:theme') as EngineTheme | null) ?? 'system',
  )
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const resolvedTheme = theme === 'system'
    ? systemDark ? 'dark' : 'light'
    : theme

  const availableTags = useMemo(() => {
    const tags = prototypes.map(({ meta }) => meta.tag)
    return [...new Set(tags)].sort((a, b) => a.localeCompare(b))
  }, [prototypes])

  const visiblePrototypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return prototypes.filter(({ meta }) => {
      const matchesFilter = selectedStatuses.length === 0 || selectedStatuses.includes(meta.status)
      const matchesTag = selectedTag === 'all' || meta.tag === selectedTag
      const haystack = [meta.name, meta.description, meta.tag]
        .join(' ')
        .toLowerCase()
      return matchesFilter && matchesTag && (!normalizedQuery || haystack.includes(normalizedQuery))
    }).sort((a, b) => {
      if (sort === 'updated') return b.meta.updatedAt.localeCompare(a.meta.updatedAt)
      if (sort === 'status') return statusOrder.indexOf(a.meta.status) - statusOrder.indexOf(b.meta.status)
      return a.meta.name.localeCompare(b.meta.name)
    })
  }, [selectedStatuses, prototypes, query, selectedTag, sort])

  const groupedPrototypes = useMemo(() => availableTags
    .map((tag) => ({
      tag,
      prototypes: visiblePrototypes.filter(({ meta }) => meta.tag === tag),
    }))
    .filter(({ prototypes: taggedPrototypes }) => taggedPrototypes.length > 0),
  [availableTags, visiblePrototypes])

  const clearFilters = () => {
    setQuery('')
    setSelectedStatuses([])
    setSelectedTag('all')
  }

  const activeFilterCount = selectedStatuses.length + (selectedTag === 'all' ? 0 : 1) + (query ? 1 : 0)
  const counts = Object.fromEntries(statusOrder.map((status) => [
    status,
    prototypes.filter(({ meta }) => meta.status === status).length,
  ])) as Record<PrototypeStatus, number>

  return (
    <main className="index-page" data-engine-theme={resolvedTheme}>
      <header className="index-header">
        <div className="index-header__identity">
          <span className="index-wordmark"><img alt="" src="/logo.png" />HomePortal</span>
          <h1>Prototype bench</h1>
          <p>
            Find, review, and track working models before they enter product code.
          </p>
        </div>
        <div className="index-header__tools">
          <label className="index-theme">
            <span>Appearance</span>
            <select onChange={(event) => { const next = event.target.value as EngineTheme; setTheme(next); localStorage.setItem('prototype-engine:theme', next) }} value={theme}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <div className="index-header__count" aria-label={`${prototypes.length} prototypes`}>
            <strong>{String(prototypes.length).padStart(2, '0')}</strong>
            <span>in the index</span>
          </div>
        </div>
      </header>

      <section className="index-overview" aria-label="Prototype status overview">
        <div>
          <strong>{prototypes.length}</strong>
          <span>Total</span>
        </div>
        {statusFilters.map(({ id, label }) => (
          <div key={id}>
            <strong>{counts[id]}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

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

      <section className="index-workspace" aria-label="Prototype index">
        <aside className="index-sidebar">
          <div className="index-sidebar__heading">
            <h2>Collections</h2>
            <span>{availableTags.length}</span>
          </div>
          <nav aria-label="Filter prototypes by collection">
            <button aria-current={selectedTag === 'all' ? 'page' : undefined} onClick={() => setSelectedTag('all')} type="button">
              <span>All prototypes</span><strong>{prototypes.length}</strong>
            </button>
            {availableTags.map((tag) => (
              <button aria-current={selectedTag === tag ? 'page' : undefined} key={tag} onClick={() => setSelectedTag(tag)} type="button">
                <span>{tag}</span><strong>{prototypes.filter(({ meta }) => meta.tag === tag).length}</strong>
              </button>
            ))}
          </nav>
        </aside>

        <div className="index-content">
        <div className="index-controls">
          <div className="index-controls__primary">
            <label className="index-search">
              <Icons.Search aria-hidden="true" />
              <span className="sr-only">Search prototypes</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names, descriptions, and collections"
                type="search"
                value={query}
              />
            </label>
            <div className="index-filters" aria-label="Filter prototypes by status">
              {statusFilters.map(({ id, label }) => (
                <button
                  aria-pressed={selectedStatuses.includes(id)}
                  key={id}
                  onClick={() => setSelectedStatuses((current) => current.includes(id)
                    ? current.filter((status) => status !== id)
                    : [...current, id])}
                  type="button"
                >
                  {label} <span>{counts[id]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="index-results-bar">
            <p><strong>{visiblePrototypes.length}</strong> of {prototypes.length} prototypes</p>
            <div>
              {activeFilterCount > 0 && <button onClick={clearFilters} type="button">Clear {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}</button>}
              <label>
                <span>Sort by</span>
                <select onChange={(event) => setSort(event.target.value as Sort)} value={sort}>
                  <option value="updated">Recently updated</option>
                  <option value="name">Name</option>
                  <option value="status">Needs attention</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {visiblePrototypes.length > 0 ? (
          <div className="prototype-groups">
            {groupedPrototypes.map(({ tag, prototypes: taggedPrototypes }) => (
              <details className="prototype-group" key={tag} open>
                <summary className="prototype-group__header">
                  <span className="prototype-group__heading">{tag}</span>
                  <span className="prototype-group__count">{taggedPrototypes.length} {taggedPrototypes.length === 1 ? 'prototype' : 'prototypes'}</span>
                  <Icons.ChevronRight aria-hidden="true" />
                </summary>
                <ol className="prototype-list">
                  {taggedPrototypes.map(({ meta }) => (
                    <li key={meta.id}>
                <Link to={`/prototypes/${meta.id}`}>
                  <span className="prototype-list__body">
                    <span className="prototype-list__title-row">
                      <strong>{meta.name}</strong>
                      <span className={`prototype-status prototype-status--${meta.status}`}><i />
                        {statusLabels[meta.status]}
                      </span>
                    </span>
                    <span className="prototype-list__description">{meta.description}</span>
                    <span className="prototype-list__meta">
                      <span>Updated {formatDate(meta.updatedAt)}</span>
                      <span className="prototype-list__tag">{meta.tag}</span>
                    </span>
                  </span>
                  <span className="prototype-list__open">
                    Open <Icons.ChevronRight aria-hidden="true" />
                  </span>
                </Link>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        ) : (
          <div className="index-empty">
            <h2>{prototypes.length === 0 ? 'No prototypes yet' : 'No matching prototypes'}</h2>
            <p>
              {prototypes.length === 0
                ? 'Add a folder under src/prototypes to create the first index entry.'
                : 'Try a different search term or clear the current filters.'}
            </p>
            {prototypes.length > 0 && (
              <button
                className="btn btn-neutral btn-sm"
                onClick={clearFilters}
                type="button"
              >
                <Icons.RotateCcw aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>
        )}
        </div>
      </section>

    </main>
  )
}
