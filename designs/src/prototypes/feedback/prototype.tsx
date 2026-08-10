import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Columns3, Eye, MessageSquarePlus, Search, X } from 'lucide-react'
import type { PrototypeComponentProps } from '../../engine/types/prototype'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

const feedback = [
  { id: 'FB-018', type: 'Bug report', title: 'Container log view loses the selected time range', summary: 'The time range returns to the default after moving between containers.', detail: 'Select a custom time range in container logs, open another container, then return. The selected range has reset instead of being preserved.', submitted: '10 Aug 2026', status: 'Needs review' },
  { id: 'FB-017', type: 'Feature request', title: 'Add a compact resource usage view', summary: 'A denser layout would make comparing containers easier.', detail: 'Add an optional compact view that places CPU and memory values closer to each container name for quicker comparison.', submitted: '9 Aug 2026', status: 'Backlog' },
  { id: 'FB-016', type: 'Improvement', title: 'Keep search terms when returning to applications', summary: 'Returning from an application clears the previous search.', detail: 'Preserve the application search term when navigating back to the application list during the same session.', submitted: '8 Aug 2026', status: 'In progress' },
  { id: 'FB-015', type: 'Bug report', title: 'Long Compose paths overflow on narrow screens', summary: 'Long module paths extend outside the details area.', detail: 'A module with a deeply nested Compose file path causes horizontal overflow at tablet widths.', submitted: '7 Aug 2026', status: 'Complete' },
  { id: 'FB-014', type: 'Feature request', title: 'Show service restart counts', summary: 'Surface restart counts alongside container health.', detail: 'Include the Docker restart count in the container details so recurring failures are easier to spot.', submitted: '6 Aug 2026', status: 'Duplicate' },
  { id: 'FB-013', type: 'Improvement', title: 'Clarify disabled module status', summary: 'The disabled label looks too similar to unavailable actions.', detail: 'Make it clearer that a module is intentionally disabled rather than unavailable due to a pending change.', submitted: '5 Aug 2026', status: 'Cancelled' },
  { id: 'FB-012', type: 'Bug report', title: 'Theme briefly flashes when opening a prototype', summary: 'Dark mode opens in light mode for a moment.', detail: 'When opening a prototype in dark mode, the light canvas is visible briefly before the selected theme applies.', submitted: '4 Aug 2026', status: 'Needs review' },
  { id: 'FB-011', type: 'Feature request', title: 'Download a recent log excerpt', summary: 'Export the currently visible log window as a text file.', detail: 'Provide a small download action for the filtered log excerpt currently shown in the container log view.', submitted: '3 Aug 2026', status: 'Backlog' },
]

const statuses = ['Needs review', 'Backlog', 'In progress', 'Duplicate', 'Complete', 'Cancelled']
const columns = ['Type', 'Submitted', 'Status'] as const

export function FeedbackPrototype({ prototypeState }: PrototypeComponentProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...columns])
  const [statusById, setStatusById] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<(typeof feedback)[number] | null>(() => prototypeState === 'details' ? feedback[0] : null)
  const drawerRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const items = useMemo(() => feedback.filter((item) => {
    const status = statusById[item.id] ?? item.status
    return (!filters.length || filters.includes(status)) && `${item.id} ${item.title} ${item.summary} ${item.type}`.toLowerCase().includes(query.toLowerCase())
  }), [filters, query, statusById])
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const visible = items.slice((page - 1) * pageSize, page * pageSize)

  const closeDrawer = () => { setSelected(null); requestAnimationFrame(() => triggerRef.current?.focus()) }
  const openDrawer = (item: (typeof feedback)[number], trigger: HTMLButtonElement) => { triggerRef.current = trigger; setSelected(item) }
  const toggleFilter = (status: string) => { setFilters((current) => current.includes(status) ? current.filter((item) => item !== status) : [...current, status]); setPage(1) }
  const toggleColumn = (column: string) => setVisibleColumns((current) => current.includes(column) ? current.filter((item) => item !== column) : [...current, column])

  useEffect(() => {
    if (prototypeState === 'details') setSelected(feedback[0])
    if (prototypeState === 'list') setSelected(null)
  }, [prototypeState])

  useEffect(() => {
    if (!selected || !drawerRef.current) return
    const controls = drawerRef.current.querySelectorAll<HTMLElement>('button, [href], select')
    controls[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
      if (event.key !== 'Tab' || !controls.length) return
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])

  return (
    <AuthenticatedAppShell>
      <div className="feedback-list" inert={selected ? true : undefined}>
        <header><div><h1>Feedback</h1><p>Review requests, track decisions, and keep product feedback moving.</p></div><a href="/prototypes/submit-feedback" target="_top"><MessageSquarePlus aria-hidden="true" />Submit feedback</a></header>
        <div className="feedback-list__tools">
          <label className="feedback-list__search"><Search aria-hidden="true" /><span className="sr-only">Search feedback</span><input onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search feedback" type="search" value={query} /></label>
          <details className="feedback-list__columns"><summary><Columns3 aria-hidden="true" /><span>Columns</span><ChevronDown aria-hidden="true" /></summary><div aria-labelledby="feedback-columns-label" className="feedback-list__columns-menu" role="group"><strong id="feedback-columns-label">Show columns</strong>{columns.map((column) => <label key={column}><input checked={visibleColumns.includes(column)} onChange={() => toggleColumn(column)} type="checkbox" />{column}</label>)}</div></details>
        </div>
        <fieldset className="feedback-list__filters"><legend>Status</legend><div>{statuses.map((status) => <button aria-pressed={filters.includes(status)} data-status={status.toLowerCase().replace(' ', '-')} key={status} onClick={() => toggleFilter(status)} type="button"><span />{status}</button>)}</div></fieldset>
        <div className="feedback-list__table-wrap"><table><thead><tr><th scope="col">Feedback</th>{visibleColumns.includes('Type') && <th scope="col">Type</th>}{visibleColumns.includes('Submitted') && <th scope="col">Submitted</th>}{visibleColumns.includes('Status') && <th scope="col">Status</th>}<th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map((item) => { const status = statusById[item.id] ?? item.status; return <tr key={item.id}><th scope="row"><small>{item.id}</small><strong>{item.title}</strong><span>{item.summary}</span></th>{visibleColumns.includes('Type') && <td className="feedback-list__type">{item.type}</td>}{visibleColumns.includes('Submitted') && <td className="feedback-list__submitted">{item.submitted}</td>}{visibleColumns.includes('Status') && <td className="feedback-list__status"><button className="feedback-status" data-status={status.toLowerCase().replace(' ', '-')} onClick={(event) => openDrawer(item, event.currentTarget)} type="button"><span />{status}</button></td>}<td className="feedback-list__action"><button aria-label={`View ${item.id} details`} className="feedback-list__view" onClick={(event) => openDrawer(item, event.currentTarget)} type="button"><Eye aria-hidden="true" /></button></td></tr>})}</tbody></table>{!visible.length && <div className="feedback-list__empty"><Search aria-hidden="true" /><strong>No feedback found</strong><span>Try changing your search or status filters.</span></div>}</div>
        <footer className="feedback-list__pagination"><label>Rows per page<select onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }} value={pageSize}><option>5</option><option>10</option><option>25</option></select></label><p>{items.length ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, items.length)} of ${items.length}` : 'Showing 0 of 0'}</p><nav aria-label="Pagination"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button"><ChevronLeft aria-hidden="true" /></button>{Array.from({ length: pages }, (_, index) => index + 1).map((number) => <button aria-current={page === number ? 'page' : undefined} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}<button aria-label="Next page" disabled={page === pages} onClick={() => setPage((current) => current + 1)} type="button"><ChevronRight aria-hidden="true" /></button></nav></footer>
      </div>
      {selected && <div className="feedback-drawer-layer"><button aria-label="Close drawer" className="feedback-drawer-layer__scrim" onClick={closeDrawer} type="button" /><aside aria-labelledby="feedback-drawer-heading" aria-modal="true" className="feedback-drawer" ref={drawerRef} role="dialog"><header><div><p>{selected.id} · {selected.type}</p><h2 id="feedback-drawer-heading">{selected.title}</h2></div><button aria-label="Close drawer" onClick={closeDrawer} type="button"><X aria-hidden="true" /></button></header><div className="feedback-drawer__body"><section><h3>Details</h3><p>{selected.detail}</p></section><dl><div><dt>Submitted</dt><dd>{selected.submitted}</dd></div><div><dt>Status</dt><dd>{statusById[selected.id] ?? selected.status}</dd></div></dl><fieldset><legend>Change status</legend>{statuses.map((status) => <button aria-pressed={(statusById[selected.id] ?? selected.status) === status} key={status} onClick={() => setStatusById((current) => ({ ...current, [selected.id]: status }))} type="button"><span />{status}</button>)}</fieldset></div></aside></div>}
    </AuthenticatedAppShell>
  )
}
