import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  AppWindow,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clapperboard,
  Images,
  LockKeyhole,
  LogOut,
  Menu,
  Moon,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sun,
  UserRound,
  UsersRound,
  WalletCards,
  Wrench,
  X,
} from 'lucide-react'
import type { PrototypeComponentProps } from '../../engine/types/prototype'

const applicationGroups = [
  {
    id: 'built-in',
    name: 'Built-In Applications',
    applications: [
      {
        name: 'Account & security',
        description: 'Manage your profile, password, and sign-in security.',
        Icon: ShieldCheck,
        tone: 'navy',
      },
      {
        name: 'Application Manager',
        description: 'Add, review, and manage the applications available in HomePortal.',
        Icon: AppWindow,
        tone: 'amber',
      },
      {
        name: 'Custom Module Editor',
        description: 'Edit home portal modules and apps using docker compose files',
        Icon: Pencil,
        tone: 'teal',
      },
      {
        name: 'Home Portal Admin',
        description: 'Open the Django administration interface for HomePortal.',
        Icon: Wrench,
        tone: 'amber',
      },
      {
        name: 'Reverse Proxy',
        description: 'Manage the reverse proxy used by HomePortal applications.',
        Icon: Network,
        tone: 'navy',
      },
      {
        name: 'User access',
        description: 'Manage household members and their application access.',
        Icon: UsersRound,
        tone: 'amber',
      },
    ],
  },
  {
    id: 'third-party',
    name: 'Third Party Applications',
    applications: [
      {
        name: 'Actual Budget',
        description: 'Open your household budget and financial planning tools.',
        Icon: WalletCards,
        tone: 'teal',
      },
      {
        name: 'Jellyfin',
        description: 'Browse and stream from the household media library.',
        Icon: Clapperboard,
        tone: 'navy',
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Applications',
    applications: [
      {
        name: 'Immich',
        description: 'Browse and manage the household photo library.',
        Icon: Images,
        tone: 'amber',
      },
      {
        name: 'OpenVPN Server',
        description: 'Manage secure access to the home network.',
        Icon: LockKeyhole,
        tone: 'navy',
      },
    ],
  },
]

const applicationCount = applicationGroups.reduce(
  (total, group) => total + group.applications.length,
  0,
)

function Shell({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const shellRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null)
  const previousOpen = useRef(sidebarOpen)

  useLayoutEffect(() => {
    const inheritedTheme = shellRef.current?.parentElement?.closest('[data-theme]')?.getAttribute('data-theme')
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
    const closeAccountMenu = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountMenuOpen(false)
    }
    const closeAccountMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setAccountMenuOpen(false)
      accountButtonRef.current?.focus()
    }
    window.addEventListener('pointerdown', closeAccountMenu)
    window.addEventListener('keydown', closeAccountMenuOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeAccountMenu)
      window.removeEventListener('keydown', closeAccountMenuOnEscape)
    }
  }, [accountMenuOpen])

  return (
    <div className="all-apps" data-sidebar-open={sidebarOpen} data-theme={theme} ref={shellRef}>
      <header className="all-apps__topbar" inert={isMobile && sidebarOpen ? true : undefined}>
        <button
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          className="all-apps__mobile-menu"
          onClick={() => setSidebarOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <a className="all-apps__brand" href="#home" aria-label="HomePortal home">
          <img alt="" src="/logo.png" />
          <span>HomePortal</span>
        </a>
        <div className="all-apps__top-actions">
          <button
            aria-label={`${theme === 'dark' ? 'Dark' : 'Light'} theme active. Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'dark'}
            className="all-apps__theme-toggle"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            title={`${theme === 'dark' ? 'Dark' : 'Light'} theme active`}
            type="button"
          >
            {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <div className="all-apps__account-control" ref={accountMenuRef}>
            <button
              aria-controls="account-menu"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
              aria-label="Open account menu"
              className="all-apps__account"
              onClick={() => setAccountMenuOpen((open) => !open)}
              ref={accountButtonRef}
              type="button"
            >
              <span className="all-apps__avatar"><UserRound aria-hidden="true" /></span>
              <span className="all-apps__account-copy"><strong>Evan</strong><small>Home owner</small></span>
              <ChevronDown aria-hidden="true" />
            </button>
            {accountMenuOpen && (
              <div aria-label="Account options" className="all-apps__account-menu" id="account-menu">
                <a href="#edit-profile"><Pencil aria-hidden="true" />Edit Profile</a>
                <button className="all-apps__sign-out" type="button"><LogOut aria-hidden="true" />Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="all-apps__body">
        <button
          aria-label="Close navigation"
          className="all-apps__scrim"
          onClick={() => setSidebarOpen(false)}
          tabIndex={-1}
          type="button"
        />
        <aside
          aria-label="Main navigation"
          aria-modal={isMobile && sidebarOpen ? true : undefined}
          className="all-apps__sidebar"
          inert={isMobile && !sidebarOpen ? true : undefined}
          role={isMobile && sidebarOpen ? 'dialog' : undefined}
        >
          <nav>
            <a aria-current="page" href="#applications" ref={firstNavLinkRef}><AppWindow aria-hidden="true" /><span>Applications</span></a>
          </nav>
          <div className="all-apps__sidebar-foot">
            <button
              aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
              className="all-apps__collapse"
              onClick={() => setSidebarOpen((open) => !open)}
              type="button"
            >
              {sidebarOpen ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
              <span>{sidebarOpen ? 'Collapse menu' : 'Expand menu'}</span>
            </button>
          </div>
        </aside>

        <main className="all-apps__main" inert={isMobile && sidebarOpen ? true : undefined}>
          <div className="all-apps__main-inner">{children}</div>
        </main>
      </div>
    </div>
  )
}

function LoadedState() {
  return (
    <>
      <div className="all-apps__heading">
        <div>
          <h1>All applications</h1>
          <p>Everything you have access to, in one place.</p>
        </div>
        <span className="all-apps__count">{applicationCount} available</span>
      </div>
      <div className="all-apps__groups">
        {applicationGroups.map((group) => (
          <section aria-labelledby={`${group.id}-applications`} className="all-apps__group" key={group.id}>
            <div className="all-apps__group-heading">
              <h2 id={`${group.id}-applications`}>{group.name}</h2>
              <span>{group.applications.length}</span>
            </div>
            <div className="all-apps__grid">
              {group.applications.map(({ name, description, Icon, tone }) => (
                <a className="all-apps__app" data-tone={tone} href={`#${name.toLowerCase().replaceAll(' ', '-')}`} key={name}>
                  <span className="all-apps__app-icon"><Icon aria-hidden="true" /></span>
                  <span className="all-apps__app-copy"><strong>{name}</strong><span>{description}</span></span>
                  <span className="all-apps__app-open"><span>Open</span><ChevronRight aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

function LoadingState() {
  return (
    <div aria-busy="true" aria-label="Loading applications">
      <div className="all-apps__heading all-apps__heading--loading">
        <div><span className="skeleton skeleton--title" /><span className="skeleton skeleton--copy" /></div>
      </div>
      <div className="all-apps__groups" aria-hidden="true">
        {[0, 1, 2].map((group) => (
          <section className="all-apps__group" key={group}>
            <div className="all-apps__group-heading"><span className="skeleton skeleton--section" /></div>
            <div className="all-apps__grid">
              {[0, 1].map((item) => <div className="all-apps__app all-apps__app--loading" key={item}><span className="skeleton skeleton--icon" /><span className="all-apps__app-copy"><span className="skeleton skeleton--name" /><span className="skeleton skeleton--description" /></span></div>)}
            </div>
          </section>
        ))}
      </div>
      <span className="sr-only">Loading your applications…</span>
    </div>
  )
}

function ErrorState() {
  return (
    <section className="all-apps__error" aria-labelledby="applications-error" role="alert">
      <span className="all-apps__error-icon"><CircleAlert aria-hidden="true" /></span>
      <h1 id="applications-error">We couldn’t load your applications</h1>
      <p>Your access hasn’t changed. Try loading the list again.</p>
      <button type="button"><RefreshCw aria-hidden="true" />Try again</button>
    </section>
  )
}

export function AllApplicationsPrototype({ prototypeState = 'loaded' }: PrototypeComponentProps) {
  return (
    <Shell>
      {prototypeState === 'loading' ? <LoadingState /> : prototypeState === 'error' ? <ErrorState /> : <LoadedState />}
    </Shell>
  )
}
