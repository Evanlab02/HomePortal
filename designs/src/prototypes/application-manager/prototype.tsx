import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AppWindow,
  Boxes,
  CircleAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  ExternalLink,
  Eye,
  LockKeyhole,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react'
import type { PrototypeComponentProps } from '../../engine/types/prototype'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

type AppType = 'Built-in' | 'Third party' | 'Custom'
type DrawerAction = 'detail' | 'edit' | 'delete'

const applications: { name: string; description: string; longDescription: string; type: AppType; url: string }[] = [
  { name: 'Account & security', description: 'Manage profile and account security.', longDescription: 'Update profile details, change your password, and manage multi-factor authentication for your HomePortal account.', type: 'Built-in', url: '' },
  { name: 'Application Manager', description: 'Manage applications available in HomePortal.', longDescription: 'Review every registered application and manage custom applications from one place.', type: 'Built-in', url: '' },
  { name: 'Custom Module Editor', description: 'Edit custom HomePortal modules.', longDescription: 'Create and maintain custom HomePortal modules backed by Docker Compose configuration.', type: 'Built-in', url: '' },
  { name: 'Home Portal Admin', description: 'Open the administration interface.', longDescription: 'Access the HomePortal administration tools for lower-level system management.', type: 'Built-in', url: '' },
  { name: 'Reverse Proxy', description: 'Manage household reverse proxy routes.', longDescription: 'Review and maintain the reverse proxy routes used by applications in the home lab.', type: 'Built-in', url: '' },
  { name: 'User access', description: 'Manage household application access.', longDescription: 'Control which household members can access each application available through HomePortal.', type: 'Built-in', url: '' },
  { name: 'Actual Budget', description: 'Household budgeting and planning.', longDescription: 'Open the household budget to track spending, plan expenses, and review financial activity.', type: 'Third party', url: 'https://budget.home' },
  { name: 'Jellyfin', description: 'Household media library.', longDescription: 'Browse and stream films, television, music, and other media from the household library.', type: 'Third party', url: 'https://media.home' },
  { name: 'Immich', description: 'Household photo library.', longDescription: 'Browse, organize, and back up photos and videos from household devices.', type: 'Custom', url: 'https://photos.home' },
  { name: 'OpenVPN Server', description: 'Secure remote network access.', longDescription: 'Connect securely to the home network when away from the local connection.', type: 'Custom', url: 'https://vpn.home' },
]

const types = ['All', 'Built-in', 'Third party', 'Custom'] as const

function SummaryCards() {
  return (
    <div className="application-manager__summary" aria-label="Application totals">
      <article data-tone="navy"><span><AppWindow aria-hidden="true" /></span><div><strong>6</strong><p>Built-in</p></div></article>
      <article data-tone="amber"><span><ExternalLink aria-hidden="true" /></span><div><strong>2</strong><p>Third party</p></div></article>
      <article data-tone="teal"><span><Boxes aria-hidden="true" /></span><div><strong>2</strong><p>Custom</p></div></article>
    </div>
  )
}

function LoadingState() {
  return (
    <div aria-busy="true" aria-label="Loading applications">
      <div className="application-manager__summary application-manager__summary--loading" aria-hidden="true">{[0, 1, 2].map((item) => <span className="application-manager__skeleton" key={item} />)}</div>
      <div className="application-manager__table-skeleton" aria-hidden="true">{[0, 1, 2, 3, 4].map((row) => <span className="application-manager__skeleton" key={row} />)}</div>
    </div>
  )
}

export function ApplicationManagerPrototype({ prototypeState = 'loaded' }: PrototypeComponentProps) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof types)[number]>('All')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({ type: true, url: true })
  const [drawer, setDrawer] = useState<{ action: DrawerAction; app: (typeof applications)[number] } | null>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null)

  const filteredApplications = useMemo(() => applications.filter((application) =>
    (type === 'All' || application.type === type) && application.name.toLowerCase().includes(query.toLowerCase()),
  ), [query, type])
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize))
  const pageApplications = filteredApplications.slice((page - 1) * pageSize, page * pageSize)

  const closeDrawer = () => {
    setDrawer(null)
    requestAnimationFrame(() => drawerTriggerRef.current?.focus())
  }

  const openDrawer = (action: DrawerAction, app: (typeof applications)[number], trigger: HTMLButtonElement) => {
    drawerTriggerRef.current = trigger
    setDrawer({ action, app })
  }

  useEffect(() => {
    if (!drawer) return
    const panel = drawerRef.current
    const focusable = panel?.querySelectorAll<HTMLElement>('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])')
    focusable?.[0]?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer()
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawer])

  return (
    <AuthenticatedAppShell>
      <section className="authenticated-app-shell__mobile-notice">
        <span><CircleAlert aria-hidden="true" /></span>
        <h1>Not available on mobile</h1>
        <p>Application Manager needs a larger screen. Open it on a tablet or computer.</p>
      </section>
      <div className="application-manager" inert={drawer ? true : undefined}>
        <header className="application-manager__heading">
          <div><h1>Application manager</h1><p>Manage the applications available from HomePortal.</p></div>
          <a href="/prototypes/add-application" target="_top"><Plus aria-hidden="true" />Add application</a>
        </header>

        {prototypeState === 'loading' ? <LoadingState /> : (
          <>
            <SummaryCards />
            <section aria-labelledby="applications-table-heading" className="application-manager__list">
              <h2 className="sr-only" id="applications-table-heading">Applications</h2>
              <div aria-label="Filter by application type" className="application-manager__tabs" role="group">
                {types.map((item) => <button aria-pressed={type === item} key={item} onClick={() => { setType(item); setPage(1) }} type="button">{item}</button>)}
              </div>
              <div className="application-manager__tools">
                <label className="application-manager__search"><Search aria-hidden="true" /><span className="sr-only">Search applications</span><input onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search applications" type="search" value={query} /></label>
                <div className="application-manager__columns">
                  <button aria-expanded={columnsOpen} onClick={() => setColumnsOpen((open) => !open)} type="button"><Columns3 aria-hidden="true" />Columns</button>
                  {columnsOpen && <fieldset><legend>Show columns</legend>{Object.entries(visibleColumns).map(([column, checked]) => <label key={column}><input checked={checked} onChange={() => setVisibleColumns((current) => ({ ...current, [column]: !current[column as keyof typeof current] }))} type="checkbox" />{column[0].toUpperCase() + column.slice(1)}</label>)}</fieldset>}
                </div>
              </div>

              <div className="application-manager__table-wrap">
                <table>
                  <thead><tr><th scope="col">Application</th>{visibleColumns.type && <th scope="col">Type</th>}{visibleColumns.url && <th scope="col">URL</th>}<th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>
                    {pageApplications.map((application) => (
                      <tr key={application.name}>
                        <th scope="row"><strong>{application.name}</strong><small>{application.description}</small></th>
                        {visibleColumns.type && <td><span className="application-manager__type" data-type={application.type.toLowerCase().replace(' ', '-')}>{application.type}</span></td>}
                        {visibleColumns.url && <td className="application-manager__url">{application.url}</td>}
                        <td><div className="application-manager__row-actions"><button aria-label={`View ${application.name}`} onClick={(event) => openDrawer('detail', application, event.currentTarget)} title="View details" type="button"><Eye aria-hidden="true" /></button><button aria-label={`Edit ${application.name}`} onClick={(event) => openDrawer('edit', application, event.currentTarget)} title="Edit" type="button"><Pencil aria-hidden="true" /></button><button aria-label={`Delete ${application.name}`} onClick={(event) => openDrawer('delete', application, event.currentTarget)} title="Delete" type="button"><Trash2 aria-hidden="true" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredApplications.length === 0 && <div className="application-manager__no-results"><Search aria-hidden="true" /><strong>No matches</strong><span>Try a different search or filter.</span></div>}
              </div>

              <footer className="application-manager__pagination">
                <div><p>{filteredApplications.length === 0 ? 'Showing 0 of 0' : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredApplications.length)} of ${filteredApplications.length}`}</p><label>Rows per page<select aria-label="Rows per page" onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }} value={pageSize}><option value="5">5</option><option value="10">10</option><option value="25">25</option></select></label></div>
                <nav aria-label="Pagination">
                  <button aria-label="First page" disabled={page === 1} onClick={() => setPage(1)} type="button"><ChevronsLeft aria-hidden="true" /></button>
                  <button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" /></button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button aria-current={page === pageNumber ? 'page' : undefined} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}
                  <button aria-label="Next page" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button"><ChevronRight aria-hidden="true" /></button>
                  <button aria-label="Last page" disabled={page === totalPages} onClick={() => setPage(totalPages)} type="button"><ChevronsRight aria-hidden="true" /></button>
                </nav>
              </footer>
            </section>
          </>
        )}
      </div>

      {drawer && (
        <div className="application-manager__drawer-layer">
          <button aria-label="Close drawer" className="application-manager__drawer-scrim" onClick={closeDrawer} type="button" />
          <aside aria-labelledby="application-drawer-heading" aria-modal="true" className="application-manager__drawer" ref={drawerRef} role="dialog">
            <header><div><p>{drawer.action === 'detail' ? 'Application details' : drawer.action === 'edit' ? 'Edit application' : 'Delete application'}</p><h2 id="application-drawer-heading">{drawer.app.name}</h2></div><button aria-label="Close drawer" onClick={closeDrawer} type="button"><X aria-hidden="true" /></button></header>
            {drawer.action === 'detail' && <dl><div><dt>Type</dt><dd>{drawer.app.type}</dd></div>{drawer.app.url && <div><dt>URL</dt><dd>{drawer.app.url}</dd></div>}<div><dt>Short description</dt><dd>{drawer.app.description}</dd></div><div><dt>Long description</dt><dd>{drawer.app.longDescription}</dd></div></dl>}
            {drawer.action === 'edit' && drawer.app.type === 'Built-in' && <div className="application-manager__restricted"><span><LockKeyhole aria-hidden="true" /></span><h3>Built-in applications can’t be edited</h3><p>This application is part of HomePortal and its details are managed by the system.</p><button onClick={closeDrawer} type="button">Close</button></div>}
            {drawer.action === 'edit' && drawer.app.type === 'Third party' && <div className="application-manager__restricted"><span><ShieldAlert aria-hidden="true" /></span><h3>You don’t have permission to edit this application</h3><p>Third-party applications are managed by HomePortal and can’t be changed from this account.</p><button onClick={closeDrawer} type="button">Close</button></div>}
            {drawer.action === 'edit' && drawer.app.type === 'Custom' && <form><label><span>Name</span><input defaultValue={drawer.app.name} /></label><label><span>Short description</span><input defaultValue={drawer.app.description} /></label><label><span>Long description</span><textarea defaultValue={drawer.app.longDescription} rows={5} /></label><label><span>URL</span><input defaultValue={drawer.app.url} type="url" /></label><div><button onClick={closeDrawer} type="button">Cancel</button><button type="button">Save changes</button></div></form>}
            {drawer.action === 'delete' && drawer.app.type === 'Built-in' && <div className="application-manager__restricted"><span><LockKeyhole aria-hidden="true" /></span><h3>Built-in applications can’t be deleted</h3><p>This application is part of HomePortal and is required for the system to work.</p><button onClick={closeDrawer} type="button">Close</button></div>}
            {drawer.action === 'delete' && drawer.app.type === 'Third party' && <div className="application-manager__restricted"><span><ShieldAlert aria-hidden="true" /></span><h3>You don’t have permission to delete this application</h3><p>Third-party applications are managed by HomePortal and can’t be removed from this account.</p><button onClick={closeDrawer} type="button">Close</button></div>}
            {drawer.action === 'delete' && drawer.app.type === 'Custom' && <div className="application-manager__delete"><span><Trash2 aria-hidden="true" /></span><p>Remove this application from HomePortal? This action cannot be undone.</p><div><button onClick={closeDrawer} type="button">Cancel</button><button type="button">Delete application</button></div></div>}
          </aside>
        </div>
      )}
    </AuthenticatedAppShell>
  )
}
