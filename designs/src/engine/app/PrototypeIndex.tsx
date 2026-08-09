import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../components/Icon'
import type { DiscoveryIssue, PrototypeDefinition, PrototypeStatus } from '../types/prototype'

type Filter = 'all' | PrototypeStatus
type EngineTheme = 'system' | 'light' | 'dark'

const filters: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'exploratory', label: 'Exploratory' },
  { id: 'in-progress', label: 'In progress' },
  { id: 're-review', label: 'Re-review' },
  { id: 'ready', label: 'Ready' },
  { id: 'implemented', label: 'Implemented' },
]

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
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedTag, setSelectedTag] = useState('all')
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
      const matchesFilter = filter === 'all' || meta.status === filter
      const matchesTag = selectedTag === 'all' || meta.tag === selectedTag
      const haystack = [meta.name, meta.description, meta.tag]
        .join(' ')
        .toLowerCase()
      return matchesFilter && matchesTag && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [filter, prototypes, query, selectedTag])

  const groupedPrototypes = useMemo(() => availableTags
    .map((tag) => ({
      tag,
      prototypes: visiblePrototypes.filter(({ meta }) => meta.tag === tag),
    }))
    .filter(({ prototypes: taggedPrototypes }) => taggedPrototypes.length > 0),
  [availableTags, visiblePrototypes])

  const clearFilters = () => {
    setQuery('')
    setFilter('all')
    setSelectedTag('all')
  }

  return (
    <main className="index-page" data-engine-theme={resolvedTheme}>
      <header className="index-header">
        <div className="index-header__identity">
          <span className="index-wordmark"><img alt="" src="/logo.png" />HomePortal</span>
          <h1>Prototype Bench</h1>
          <p>
            Working models for deciding how HomePortal looks, feels, and behaves before ideas enter product code.
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
          <div className="index-controls__primary">
            <label className="index-search">
              <Icons.Search aria-hidden="true" />
              <span className="sr-only">Search prototypes</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prototypes"
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
          {availableTags.length > 0 && (
            <div className="tag-filters">
              <span className="tag-filters__label">Tags</span>
              <div className="tag-filters__options" aria-label="Filter prototypes by tag">
                {availableTags.map((tag) => (
                  <button
                    aria-pressed={selectedTag === tag}
                    key={tag}
                    onClick={() => setSelectedTag((current) => current === tag ? 'all' : tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTag !== 'all' && (
                <button className="tag-filters__clear" onClick={() => setSelectedTag('all')} type="button">
                  Clear tag
                </button>
              )}
            </div>
          )}
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
      </section>

    </main>
  )
}
