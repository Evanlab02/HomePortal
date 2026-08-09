import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  AppWindow,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import './authenticated-app-shell.scss'

export function AuthenticatedAppShell({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const rootRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null)
  const previousOpen = useRef(sidebarOpen)

  useLayoutEffect(() => {
    const themeSource = rootRef.current?.parentElement?.closest('[data-theme]')
    if (!themeSource) return
    const syncTheme = () => {
      const inheritedTheme = themeSource.getAttribute('data-theme')
      if (inheritedTheme === 'dark' || inheritedTheme === 'light') setTheme(inheritedTheme)
    }
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(themeSource, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)')
    const update = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
      setSidebarOpen(false)
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      previousOpen.current = sidebarOpen
      return
    }
    if (sidebarOpen && !previousOpen.current) firstNavLinkRef.current?.focus()
    if (!sidebarOpen && previousOpen.current) menuButtonRef.current?.focus()
    previousOpen.current = sidebarOpen
  }, [isMobile, sidebarOpen])

  useEffect(() => {
    if (!isMobile || !sidebarOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [isMobile, sidebarOpen])

  useEffect(() => {
    if (!accountMenuOpen) return
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setAccountMenuOpen(false)
      accountButtonRef.current?.focus()
    }
    window.addEventListener('pointerdown', closeOnPointerDown)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnPointerDown)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountMenuOpen])

  return (
    <div className="authenticated-app-shell" data-sidebar-open={sidebarOpen} data-theme={theme} ref={rootRef}>
      <header className="authenticated-app-shell__topbar" inert={isMobile && sidebarOpen ? true : undefined}>
        <button
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          className="authenticated-app-shell__mobile-menu"
          onClick={() => setSidebarOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <a className="authenticated-app-shell__brand" href="#home" aria-label="HomePortal home"><img alt="" src="/logo.png" /><span>HomePortal</span></a>
        <div className="authenticated-app-shell__top-actions">
          <button
            aria-label={`${theme === 'dark' ? 'Dark' : 'Light'} theme active. Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'dark'}
            className="authenticated-app-shell__theme-toggle"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <div className="authenticated-app-shell__account-control" ref={accountMenuRef}>
            <button
              aria-controls="authenticated-account-menu"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
              aria-label="Open account menu"
              className="authenticated-app-shell__account"
              onClick={() => setAccountMenuOpen((open) => !open)}
              ref={accountButtonRef}
              type="button"
            >
              <span className="authenticated-app-shell__avatar"><UserRound aria-hidden="true" /></span>
              <span className="authenticated-app-shell__account-copy"><strong>Evan</strong><small>Home owner</small></span>
              <ChevronDown aria-hidden="true" />
            </button>
            {accountMenuOpen && (
              <div aria-label="Account options" className="authenticated-app-shell__account-menu" id="authenticated-account-menu">
                <a href="#edit-profile"><Pencil aria-hidden="true" />Edit profile</a>
                <button className="authenticated-app-shell__sign-out" type="button"><LogOut aria-hidden="true" />Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="authenticated-app-shell__body">
        <button aria-label="Close navigation" className="authenticated-app-shell__scrim" onClick={() => setSidebarOpen(false)} tabIndex={-1} type="button" />
        <aside
          aria-label="Main navigation"
          aria-modal={isMobile && sidebarOpen ? true : undefined}
          className="authenticated-app-shell__sidebar"
          inert={isMobile && !sidebarOpen ? true : undefined}
          role={isMobile && sidebarOpen ? 'dialog' : undefined}
        >
          <nav><a href="#applications" ref={firstNavLinkRef}><AppWindow aria-hidden="true" /><span>Applications</span></a></nav>
          <div className="authenticated-app-shell__sidebar-foot">
            <button aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'} className="authenticated-app-shell__collapse" onClick={() => setSidebarOpen((open) => !open)} type="button">
              {sidebarOpen ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
              <span>{sidebarOpen ? 'Collapse menu' : 'Expand menu'}</span>
            </button>
          </div>
        </aside>
        <main className="authenticated-app-shell__main" inert={isMobile && sidebarOpen ? true : undefined}>{children}</main>
      </div>
    </div>
  )
}
