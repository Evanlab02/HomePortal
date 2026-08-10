import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Boxes,
  Clapperboard,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileCode2,
  Images,
  LockKeyhole,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  WalletCards,
  Wrench,
  X,
} from 'lucide-react'
import type { PrototypeComponentProps } from '../../engine/types/prototype'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

const modules = [
  { name: 'monitoring', services: ['prometheus', 'grafana', 'node-exporter'], ports: ['3000:3000', '9090:9090', '9100:9100'], volumes: ['grafana-data', './prometheus.yml'], description: 'Metrics, dashboards, and system monitoring.', enabled: true },
  { name: 'media-stack', services: ['jellyfin', 'sonarr', 'radarr', 'prowlarr'], ports: ['8096:8096', '8989:8989', '7878:7878'], volumes: ['media-data', './config'], description: 'Media server and supporting services.', enabled: true },
  { name: 'photos', services: ['immich-server', 'machine-learning', 'database'], ports: ['2283:2283'], volumes: ['photos-library', 'database-data'], description: 'Photo storage, processing, and database.', enabled: true },
  { name: 'vpn', services: ['openvpn'], ports: ['1194:1194/udp'], volumes: ['./config'], description: 'Secure remote access to the home network.', enabled: false },
  { name: 'backups', services: ['restic', 'scheduler'], ports: [], volumes: ['backup-data', './repository'], description: 'Scheduled backups for household services.', enabled: true },
  { name: 'dns', services: ['pihole', 'unbound'], ports: ['53:53/tcp', '53:53/udp'], volumes: ['dns-config'], description: 'Local DNS and network filtering.', enabled: true },
  { name: 'home-automation', services: ['home-assistant', 'mosquitto', 'zigbee2mqtt'], ports: ['8123:8123', '1883:1883'], volumes: ['automation-config'], description: 'Home automation and device messaging.', enabled: false },
  { name: 'observability', services: ['loki', 'tempo', 'alloy', 'grafana'], ports: ['3000:3000', '3100:3100', '3200:3200'], volumes: ['observability-data'], description: 'Logs, traces, and container diagnostics.', enabled: true },
]

const pendingModules = new Set(['media-stack', 'photos'])

const iconOptions = [
  { name: 'Modules', Icon: Boxes },
  { name: 'Media', Icon: Clapperboard },
  { name: 'Photos', Icon: Images },
  { name: 'Security', Icon: LockKeyhole },
  { name: 'Protected', Icon: ShieldCheck },
  { name: 'Finance', Icon: WalletCards },
  { name: 'Tools', Icon: Wrench },
]

export function CustomModulesPrototype({ prototypeState = 'all-applied' }: PrototypeComponentProps) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [drawer, setDrawer] = useState<{ action: 'detail' | 'edit' | 'status' | 'delete' | 'icon'; module: (typeof modules)[number] } | null>(null)
  const [moduleIcons, setModuleIcons] = useState<Record<string, string>>({})
  const [iconDraft, setIconDraft] = useState('Modules')
  const [statusDraft, setStatusDraft] = useState(true)
  const drawerTriggerRef = useRef<HTMLElement | null>(null)
  const drawerRef = useRef<HTMLElement>(null)

  const filteredModules = useMemo(() => modules.filter((module) => module.name.includes(query.toLowerCase())), [query])
  const totalPages = Math.max(1, Math.ceil(filteredModules.length / pageSize))
  const visibleModules = filteredModules.slice((page - 1) * pageSize, page * pageSize)
  const showPendingChanges = prototypeState === 'changes-pending'

  const closeDrawer = () => {
    setDrawer(null)
    requestAnimationFrame(() => drawerTriggerRef.current?.focus())
  }

  useEffect(() => {
    if (!drawer || !drawerRef.current) return
    const drawerElement = drawerRef.current
    const shell = drawerElement.closest('.authenticated-app-shell')
    const backgroundRegions = shell?.querySelectorAll<HTMLElement>('.authenticated-app-shell__topbar, .authenticated-app-shell__sidebar')
    const previousInert = Array.from(backgroundRegions ?? []).map((region) => region.inert)
    backgroundRegions?.forEach((region) => { region.inert = true })
    const focusable = drawerElement.querySelectorAll<HTMLElement>('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])')
    focusable[0]?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { closeDrawer(); return }
      if (event.key !== 'Tab' || !focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      backgroundRegions?.forEach((region, index) => { region.inert = previousInert[index] })
    }
  }, [drawer])

  return (
    <AuthenticatedAppShell>
      <div className="custom-modules-list" inert={drawer ? true : undefined}>
        <header className="custom-modules-list__heading">
          <div><h1>Custom modules</h1><p>Each module is a Docker Compose file managed by HomePortal.</p></div>
          <a href="/prototypes/add-module" target="_top"><Plus aria-hidden="true" />Add module</a>
        </header>

        <section aria-labelledby="module-list-heading" className="custom-modules-list__content">
          <h2 className="sr-only" id="module-list-heading">Modules</h2>
          <label className="custom-modules-list__search"><Search aria-hidden="true" /><span className="sr-only">Search modules</span><input onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search modules" type="search" value={query} /></label>
          {showPendingChanges && <div aria-live="polite" className="custom-modules-list__pending-notice"><LoaderCircle aria-hidden="true" /><div><strong>Some changes are waiting to be applied</strong><p>A worker is processing these updates and may batch them with other changes. Affected modules are locked until processing finishes.</p></div></div>}
          <div className="custom-modules-list__table-wrap">
            <table>
              <thead><tr><th scope="col">Module</th><th scope="col">Compose file</th><th scope="col">Services</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {visibleModules.map((module) => {
                  const isPending = showPendingChanges && pendingModules.has(module.name)
                  const ModuleIcon = iconOptions.find(({ name }) => name === moduleIcons[module.name])?.Icon ?? Boxes
                  return (
                  <tr aria-busy={isPending || undefined} aria-disabled={isPending || undefined} className={isPending ? 'custom-modules-list__row--pending' : undefined} key={module.name}>
                    <th scope="row"><button aria-label={`Change ${module.name} icon`} className="custom-modules-list__icon" disabled={isPending} onClick={(event) => { drawerTriggerRef.current = event.currentTarget; setIconDraft(moduleIcons[module.name] ?? 'Modules'); setDrawer({ action: 'icon', module }) }} title={isPending ? 'Unavailable while changes are pending' : 'Change module icon'} type="button"><ModuleIcon aria-hidden="true" /></button><div><strong>{module.name}</strong><small>{module.description}</small>{isPending && <span className="custom-modules-list__pending-status"><LoaderCircle aria-hidden="true" />Waiting to apply</span>}</div></th>
                    <td><code>custom/{module.name}/compose.yml</code></td>
                    <td>{module.services.length}</td>
                    <td><button className="custom-modules-list__status" data-enabled={module.enabled} disabled={isPending} onClick={(event) => { drawerTriggerRef.current = event.currentTarget; setStatusDraft(module.enabled); setDrawer({ action: 'status', module }) }} title={isPending ? 'Unavailable while changes are pending' : 'Change module status'} type="button"><span />{module.enabled ? 'Enabled' : 'Disabled'}</button></td>
                    <td><div className="custom-modules-list__actions"><button aria-label={`View ${module.name} details`} disabled={isPending} onClick={(event) => { drawerTriggerRef.current = event.currentTarget; setDrawer({ action: 'detail', module }) }} title={isPending ? 'Unavailable while changes are pending' : 'View module details'} type="button"><Eye aria-hidden="true" /></button><button aria-label={`Edit ${module.name} record`} disabled={isPending} onClick={(event) => { drawerTriggerRef.current = event.currentTarget; setDrawer({ action: 'edit', module }) }} title={isPending ? 'Unavailable while changes are pending' : 'Edit module record'} type="button"><Pencil aria-hidden="true" /></button>{isPending ? <button aria-label={`Edit ${module.name} Compose file`} disabled title="Unavailable while changes are pending" type="button"><FileCode2 aria-hidden="true" /></button> : <a aria-label={`Edit ${module.name} Compose file`} href="/prototypes/edit-module" target="_top" title="Edit Compose file"><FileCode2 aria-hidden="true" /></a>}<button aria-label={`Delete ${module.name}`} disabled={isPending} onClick={(event) => { drawerTriggerRef.current = event.currentTarget; setDrawer({ action: 'delete', module }) }} title={isPending ? 'Unavailable while changes are pending' : 'Delete module'} type="button"><Trash2 aria-hidden="true" /></button></div></td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredModules.length === 0 && <div className="custom-modules-list__no-results"><Search aria-hidden="true" /><strong>No matching modules</strong><span>Try a different search.</span></div>}
          </div>
          <footer className="custom-modules-list__pagination">
            <div><p>{filteredModules.length === 0 ? 'Showing 0 of 0' : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredModules.length)} of ${filteredModules.length}`}</p><label>Rows per page<select aria-label="Rows per page" onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }} value={pageSize}><option value="5">5</option><option value="10">10</option><option value="25">25</option></select></label></div>
            <nav aria-label="Pagination"><button aria-label="First page" disabled={page === 1} onClick={() => setPage(1)} type="button"><ChevronsLeft aria-hidden="true" /></button><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button aria-current={page === pageNumber ? 'page' : undefined} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}<button aria-label="Next page" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button"><ChevronRight aria-hidden="true" /></button><button aria-label="Last page" disabled={page === totalPages} onClick={() => setPage(totalPages)} type="button"><ChevronsRight aria-hidden="true" /></button></nav>
          </footer>
        </section>
      </div>

      {drawer && <div className="custom-modules-drawer-layer"><button aria-label="Close drawer" className="custom-modules-drawer-layer__scrim" onClick={closeDrawer} type="button" /><aside aria-labelledby="module-drawer-heading" aria-modal="true" className="custom-modules-drawer" ref={drawerRef} role="dialog"><header><div><p>{drawer.action === 'detail' ? 'Module details' : drawer.action === 'edit' ? 'Edit module record' : drawer.action === 'status' ? 'Module status' : drawer.action === 'icon' ? 'Module icon' : 'Delete module'}</p><h2 id="module-drawer-heading">{drawer.module.name}</h2></div><button aria-label="Close drawer" onClick={closeDrawer} type="button"><X aria-hidden="true" /></button></header>{drawer.action === 'detail' ? <div className="custom-modules-drawer__details"><p>{drawer.module.description}</p><div className="custom-modules-drawer__metrics"><span><strong>{drawer.module.services.length}</strong>Services</span><span><strong>{drawer.module.ports.length}</strong>Published ports</span><span><strong>{drawer.module.volumes.length}</strong>Volumes</span></div><section><h3>Compose file</h3><code>custom/{drawer.module.name}/compose.yml</code></section><section><h3>Services</h3><ul>{drawer.module.services.map((service) => <li key={service}>{service}</li>)}</ul></section><section><h3>Published ports</h3>{drawer.module.ports.length ? <ul>{drawer.module.ports.map((port) => <li key={port}><code>{port}</code></li>)}</ul> : <p>No ports are published.</p>}</section><section><h3>Volumes</h3>{drawer.module.volumes.length ? <ul>{drawer.module.volumes.map((volume) => <li key={volume}><code>{volume}</code></li>)}</ul> : <p>No volumes are defined.</p>}</section></div> : drawer.action === 'edit' ? <form className="custom-modules-drawer__edit"><label><span>Module name</span><input defaultValue={drawer.module.name} /></label><p>Renaming the record also changes the folder path to <code>custom/{drawer.module.name}/compose.yml</code>.</p><label><span>Description</span><textarea defaultValue={drawer.module.description} rows={5} /></label><footer><button onClick={closeDrawer} type="button">Cancel</button><button type="button">Save record</button></footer></form> : drawer.action === 'status' ? <div className="custom-modules-drawer__status"><p>Choose whether HomePortal should include this module when managing the custom Compose stack.</p><div aria-label="Module status" role="group"><button aria-pressed={statusDraft} onClick={() => setStatusDraft(true)} type="button"><span />Enabled<small>Include this module</small></button><button aria-pressed={!statusDraft} onClick={() => setStatusDraft(false)} type="button"><span />Disabled<small>Leave this module inactive</small></button></div><footer><button onClick={closeDrawer} type="button">Cancel</button><button type="button">Save status</button></footer></div> : drawer.action === 'icon' ? <div className="custom-modules-drawer__icon"><p>Choose the icon shown beside this module in the list.</p><div aria-label="Module icon" role="group">{iconOptions.map(({ name, Icon }) => <button aria-pressed={iconDraft === name} key={name} onClick={() => setIconDraft(name)} type="button"><Icon aria-hidden="true" /><span>{name}</span></button>)}</div><footer><button onClick={closeDrawer} type="button">Cancel</button><button onClick={() => { setModuleIcons((current) => ({ ...current, [drawer.module.name]: iconDraft })); closeDrawer() }} type="button">Save icon</button></footer></div> : <div className="custom-modules-drawer__delete"><span><Trash2 aria-hidden="true" /></span><p>Delete <code>custom/{drawer.module.name}/compose.yml</code>? This removes the module definition and cannot be undone.</p><div><button onClick={closeDrawer} type="button">Cancel</button><button type="button">Delete module</button></div></div>}</aside></div>}
    </AuthenticatedAppShell>
  )
}
