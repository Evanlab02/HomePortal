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
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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
    const tags = prototypes.flatMap(({ meta }) => meta.tags ?? [])
    return [...new Set(tags)].sort((a, b) => a.localeCompare(b))
  }, [prototypes])

  const visiblePrototypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return prototypes.filter(({ meta }) => {
      const matchesFilter = filter === 'all' || meta.status === filter
      const matchesTags = selectedTags.length === 0
        || selectedTags.every((tag) => meta.tags?.includes(tag))
      const haystack = [meta.name, meta.description, ...(meta.tags ?? [])]
        .join(' ')
        .toLowerCase()
      return matchesFilter && matchesTags && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [filter, prototypes, query, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => current.includes(tag)
      ? current.filter((candidate) => candidate !== tag)
      : [...current, tag])
  }

  const clearFilters = () => {
    setQuery('')
    setFilter('all')
    setSelectedTags([])
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
          {availableTags.length > 0 && (
            <div className="tag-filters">
              <span className="tag-filters__label">Tags</span>
              <div className="tag-filters__options" aria-label="Filter prototypes by tag">
                {availableTags.map((tag) => (
                  <button
                    aria-pressed={selectedTags.includes(tag)}
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button className="tag-filters__clear" onClick={() => setSelectedTags([])} type="button">
                  Clear tags
                </button>
              )}
            </div>
          )}
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
                      <span className={`prototype-status prototype-status--${meta.status}`}><i />
                        {statusLabels[meta.status]}
                      </span>
                    </span>
                    <span className="prototype-list__description">{meta.description}</span>
                    <span className="prototype-list__meta">
                      <span>Updated {formatDate(meta.updatedAt)}</span>
                      {meta.tags && meta.tags.length > 0 && (
                        <span className="prototype-list__tags" aria-label="Tags">
                          {meta.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </span>
                      )}
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
