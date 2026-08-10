import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AppWindow,
  ChevronDown,
  Eye,
  EyeOff,
  LogOut,
  Menu,
  MessageSquarePlus,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Sun,
  UserRound,
  X,
} from 'lucide-react'

function PasswordField({
  autoComplete,
  describedBy,
  label,
  name,
}: {
  autoComplete: 'current-password' | 'new-password'
  describedBy?: string
  label: string
  name: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <label>
      <span>{label}</span>
      <span className="change-password__input-wrap">
        <input aria-describedby={describedBy} autoComplete={autoComplete} name={name} type={visible ? 'text' : 'password'} />
        <button aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible((current) => !current)} type="button">
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </span>
    </label>
  )
}

export function ChangePasswordPrototype() {
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
    <div className="change-password" data-sidebar-open={sidebarOpen} data-theme={theme} ref={rootRef}>
      <header className="change-password__topbar" inert={isMobile && sidebarOpen ? true : undefined}>
        <button
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          className="change-password__mobile-menu"
          onClick={() => setSidebarOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <a className="change-password__brand" href="#home" aria-label="HomePortal home">
          <img alt="" src="/logo.png" />
          <span>HomePortal</span>
        </a>
        <div className="change-password__top-actions">
          <button
            aria-label={`${theme === 'dark' ? 'Dark' : 'Light'} theme active. Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'dark'}
            className="change-password__theme-toggle"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <div className="change-password__account-control" ref={accountMenuRef}>
            <button
              aria-controls="change-password-account-menu"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
              aria-label="Open account menu"
              className="change-password__account"
              onClick={() => setAccountMenuOpen((open) => !open)}
              ref={accountButtonRef}
              type="button"
            >
              <span className="change-password__avatar"><UserRound aria-hidden="true" /></span>
              <span className="change-password__account-copy"><strong>Evan</strong><small>Home owner</small></span>
              <ChevronDown aria-hidden="true" />
            </button>
            {accountMenuOpen && (
              <div aria-label="Account options" className="change-password__account-menu" id="change-password-account-menu">
                <a href="#edit-profile"><Pencil aria-hidden="true" />Edit profile</a>
                <button className="change-password__sign-out" type="button"><LogOut aria-hidden="true" />Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="change-password__body">
        <button aria-label="Close navigation" className="change-password__scrim" onClick={() => setSidebarOpen(false)} tabIndex={-1} type="button" />
        <aside
          aria-label="Main navigation"
          aria-modal={isMobile && sidebarOpen ? true : undefined}
          className="change-password__sidebar"
          inert={isMobile && !sidebarOpen ? true : undefined}
          role={isMobile && sidebarOpen ? 'dialog' : undefined}
        >
          <nav>
            <a href="#applications" ref={firstNavLinkRef}><AppWindow aria-hidden="true" /><span>Applications</span></a>
          </nav>
          <div className="change-password__sidebar-foot">
            <a href="/prototypes/submit-feedback" target="_top"><MessageSquarePlus aria-hidden="true" /><span>Submit feedback</span></a>
            <button
              aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
              className="change-password__collapse"
              onClick={() => setSidebarOpen((open) => !open)}
              type="button"
            >
              {sidebarOpen ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
              <span>{sidebarOpen ? 'Collapse menu' : 'Expand menu'}</span>
            </button>
          </div>
        </aside>

        <main className="change-password__main" inert={isMobile && sidebarOpen ? true : undefined}>
          <div className="change-password__main-inner">
            <header className="change-password__heading">
              <h1>Change password</h1>
              <p>Choose a strong password you don’t use anywhere else.</p>
            </header>

            <form className="change-password__form">
              <PasswordField autoComplete="current-password" label="Current password" name="currentPassword" />
              <PasswordField autoComplete="new-password" describedBy="password-guidance" label="New password" name="newPassword" />
              <p className="change-password__guidance" id="password-guidance">Use at least 12 characters.</p>
              <PasswordField autoComplete="new-password" label="Confirm new password" name="confirmPassword" />
              <div className="change-password__actions">
                <a href="#edit-profile">Cancel</a>
                <button type="button">Change password</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
