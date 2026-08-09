import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AppWindow,
  ChevronDown,
  ChevronRight,
  KeyRound,
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

export function EditProfilePrototype() {
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
    const inheritedTheme = rootRef.current?.parentElement?.closest('[data-theme]')?.getAttribute('data-theme')
    if (inheritedTheme === 'dark' || inheritedTheme === 'light') setTheme(inheritedTheme)
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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
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
    <div className="edit-profile" data-sidebar-open={sidebarOpen} data-theme={theme} ref={rootRef}>
      <header className="edit-profile__topbar" inert={isMobile && sidebarOpen ? true : undefined}>
        <button
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          className="edit-profile__mobile-menu"
          onClick={() => setSidebarOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <a className="edit-profile__brand" href="#home" aria-label="HomePortal home">
          <img alt="" src="/logo.png" />
          <span>HomePortal</span>
        </a>
        <div className="edit-profile__top-actions">
          <button
            aria-label={`${theme === 'dark' ? 'Dark' : 'Light'} theme active. Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'dark'}
            className="edit-profile__theme-toggle"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            title={`${theme === 'dark' ? 'Dark' : 'Light'} theme active`}
            type="button"
          >
            {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <div className="edit-profile__account-control" ref={accountMenuRef}>
            <button
              aria-controls="edit-profile-account-menu"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
              aria-label="Open account menu"
              className="edit-profile__account"
              onClick={() => setAccountMenuOpen((open) => !open)}
              ref={accountButtonRef}
              type="button"
            >
              <span className="edit-profile__avatar"><UserRound aria-hidden="true" /></span>
              <span className="edit-profile__account-copy"><strong>Evan</strong><small>Home owner</small></span>
              <ChevronDown aria-hidden="true" />
            </button>
            {accountMenuOpen && (
              <div aria-label="Account options" className="edit-profile__account-menu" id="edit-profile-account-menu">
                <a aria-current="page" href="#edit-profile"><Pencil aria-hidden="true" />Edit profile</a>
                <button className="edit-profile__sign-out" type="button"><LogOut aria-hidden="true" />Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="edit-profile__body">
        <button aria-label="Close navigation" className="edit-profile__scrim" onClick={() => setSidebarOpen(false)} tabIndex={-1} type="button" />
        <aside
          aria-label="Main navigation"
          aria-modal={isMobile && sidebarOpen ? true : undefined}
          className="edit-profile__sidebar"
          inert={isMobile && !sidebarOpen ? true : undefined}
          role={isMobile && sidebarOpen ? 'dialog' : undefined}
        >
          <nav>
            <a href="#applications" ref={firstNavLinkRef}><AppWindow aria-hidden="true" /><span>Applications</span></a>
          </nav>
          <div className="edit-profile__sidebar-foot">
            <button
              aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
              className="edit-profile__collapse"
              onClick={() => setSidebarOpen((open) => !open)}
              type="button"
            >
              {sidebarOpen ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
              <span>{sidebarOpen ? 'Collapse menu' : 'Expand menu'}</span>
            </button>
          </div>
        </aside>

        <main className="edit-profile__main" inert={isMobile && sidebarOpen ? true : undefined}>
          <div className="edit-profile__main-inner">
            <header className="edit-profile__heading">
              <h1>Edit profile</h1>
              <p>Keep the details associated with your HomePortal account up to date.</p>
            </header>

            <form className="edit-profile__form">
              <div className="edit-profile__fields">
                <label>
                  <span>Name</span>
                  <input autoComplete="given-name" defaultValue="Evan" name="firstName" type="text" />
                </label>
                <label>
                  <span>Surname</span>
                  <input autoComplete="family-name" defaultValue="Smith" name="surname" type="text" />
                </label>
                <label className="edit-profile__email">
                  <span>Email</span>
                  <input autoComplete="email" defaultValue="evan@example.com" name="email" type="email" />
                </label>
              </div>
              <div className="edit-profile__actions">
                <button className="edit-profile__save" type="button">Save changes</button>
              </div>
            </form>

            <section aria-labelledby="password-heading" className="edit-profile__password">
              <span className="edit-profile__password-icon"><KeyRound aria-hidden="true" /></span>
              <div>
                <h2 id="password-heading">Password</h2>
                <p>Choose a new password for your account.</p>
              </div>
              <a href="#change-password">Change password<ChevronRight aria-hidden="true" /></a>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
