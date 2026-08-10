import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AppWindow,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Menu,
  MessageSquarePlus,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Shield,
  ShieldCheck,
  Smartphone,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import type { PrototypeComponentProps } from '../../engine/types/prototype'

function PasswordField({
  autoComplete = 'new-password',
  describedBy,
  label,
  name,
  wide = false,
}: {
  autoComplete?: 'current-password' | 'new-password'
  describedBy?: string
  label: string
  name: string
  wide?: boolean
}) {
  const [visible, setVisible] = useState(false)

  return (
    <label className={wide ? 'account-security__wide-field' : undefined}>
      <span>{label}</span>
      <span className="account-security__input-wrap">
        <input aria-describedby={describedBy} autoComplete={autoComplete} name={name} type={visible ? 'text' : 'password'} />
        <button aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible((current) => !current)} type="button">
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </span>
    </label>
  )
}

export function AccountSecurityPrototype({ prototypeState = 'mfa-enabled' }: PrototypeComponentProps) {
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
    <div className="account-security" data-sidebar-open={sidebarOpen} data-theme={theme} ref={rootRef}>
      <header className="account-security__topbar" inert={isMobile && sidebarOpen ? true : undefined}>
        <button
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          className="account-security__mobile-menu"
          onClick={() => setSidebarOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <a className="account-security__brand" href="#home" aria-label="HomePortal home">
          <img alt="" src="/logo.png" />
          <span>HomePortal</span>
        </a>
        <div className="account-security__top-actions">
          <button
            aria-label={`${theme === 'dark' ? 'Dark' : 'Light'} theme active. Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'dark'}
            className="account-security__theme-toggle"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <div className="account-security__account-control" ref={accountMenuRef}>
            <button
              aria-controls="account-security-menu"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
              aria-label="Open account menu"
              className="account-security__account"
              onClick={() => setAccountMenuOpen((open) => !open)}
              ref={accountButtonRef}
              type="button"
            >
              <span className="account-security__avatar"><UserRound aria-hidden="true" /></span>
              <span className="account-security__account-copy"><strong>Evan</strong><small>Home owner</small></span>
              <ChevronDown aria-hidden="true" />
            </button>
            {accountMenuOpen && (
              <div aria-label="Account options" className="account-security__account-menu" id="account-security-menu">
                <a href="#edit-profile"><Pencil aria-hidden="true" />Edit profile</a>
                <button className="account-security__sign-out" type="button"><LogOut aria-hidden="true" />Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="account-security__body">
        <button aria-label="Close navigation" className="account-security__scrim" onClick={() => setSidebarOpen(false)} tabIndex={-1} type="button" />
        <aside
          aria-label="Main navigation"
          aria-modal={isMobile && sidebarOpen ? true : undefined}
          className="account-security__sidebar"
          inert={isMobile && !sidebarOpen ? true : undefined}
          role={isMobile && sidebarOpen ? 'dialog' : undefined}
        >
          <nav><a href="#applications" ref={firstNavLinkRef}><AppWindow aria-hidden="true" /><span>Applications</span></a></nav>
          <div className="account-security__sidebar-foot">
            <a href="/prototypes/submit-feedback" target="_top"><MessageSquarePlus aria-hidden="true" /><span>Submit feedback</span></a>
            <button
              aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
              className="account-security__collapse"
              onClick={() => setSidebarOpen((open) => !open)}
              type="button"
            >
              {sidebarOpen ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
              <span>{sidebarOpen ? 'Collapse menu' : 'Expand menu'}</span>
            </button>
          </div>
        </aside>

        <main className="account-security__main" inert={isMobile && sidebarOpen ? true : undefined}>
          <div className="account-security__main-inner">
            <header className="account-security__heading">
              <h1>Account &amp; security</h1>
              <p>Manage your personal details and keep your HomePortal account secure.</p>
            </header>

            <section aria-labelledby="profile-details-heading" className="account-security__section">
              <div className="account-security__section-heading">
                <span><UserRound aria-hidden="true" /></span>
                <div><h2 id="profile-details-heading">Profile details</h2><p>Update the details associated with your account.</p></div>
              </div>
              <form className="account-security__form account-security__profile-form">
                <label><span>Name</span><input autoComplete="given-name" defaultValue="Evan" name="firstName" type="text" /></label>
                <label><span>Surname</span><input autoComplete="family-name" defaultValue="Smith" name="surname" type="text" /></label>
                <label className="account-security__wide-field"><span>Email</span><input autoComplete="email" defaultValue="evan@example.com" name="email" type="email" /></label>
                <div className="account-security__form-actions"><button type="button">Save profile</button></div>
              </form>
            </section>

            <section aria-labelledby="password-heading" className="account-security__section">
              <div className="account-security__section-heading">
                <span><KeyRound aria-hidden="true" /></span>
                <div><h2 id="password-heading">Password</h2><p>Replace your current password with a new one.</p></div>
              </div>
              <form className="account-security__form account-security__password-form">
                <PasswordField autoComplete="current-password" label="Current password" name="currentPassword" wide />
                <PasswordField describedBy="account-password-guidance" label="New password" name="newPassword" />
                <PasswordField label="Confirm new password" name="confirmPassword" />
                <p className="account-security__guidance" id="account-password-guidance">Use at least 12 characters.</p>
                <div className="account-security__form-actions"><button type="button">Change password</button></div>
              </form>
            </section>

            <section aria-labelledby="mfa-heading" className="account-security__section account-security__mfa-section">
              <div className="account-security__section-heading">
                <span><Smartphone aria-hidden="true" /></span>
                <div><h2 id="mfa-heading">Multi-factor authentication</h2><p>Adds a second verification step when you sign in.</p></div>
              </div>
              <div className="account-security__mfa-status">
                {prototypeState === 'mfa-disabled' ? (
                  <>
                    <div><span><Shield aria-hidden="true" /></span><p><strong>MFA is not enabled</strong><small>Protect your account with an authenticator app.</small></p></div>
                    <div className="account-security__mfa-actions"><button className="account-security__primary-secondary" type="button">Enable MFA</button></div>
                  </>
                ) : (
                  <>
                    <div><span><ShieldCheck aria-hidden="true" /></span><p><strong>MFA is enabled</strong><small>Authenticator app</small></p></div>
                    <div className="account-security__mfa-actions">
                      <button type="button">View recovery codes</button>
                      <button className="account-security__danger" type="button">Disable MFA</button>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
