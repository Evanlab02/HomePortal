import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../components/Icon'

type Viewport = 'responsive' | 'desktop' | 'tablet' | 'mobile'
type Theme = 'system' | 'light' | 'dark'

const viewportOptions: Array<{
  id: Viewport
  label: string
  width: string
  Icon: typeof Icons.Monitor
}> = [
  { id: 'responsive', label: 'Responsive', width: '100%', Icon: Icons.Monitor },
  { id: 'desktop', label: 'Desktop · 1440', width: '1440px', Icon: Icons.Laptop },
  { id: 'tablet', label: 'Tablet · 768', width: '768px', Icon: Icons.Tablet },
  { id: 'mobile', label: 'Mobile · 390', width: '390px', Icon: Icons.Smartphone },
]

function readPreference<T extends string>(key: string, fallback: T): T {
  return (localStorage.getItem(key) as T | null) ?? fallback
}

export function PrototypeWorkbench({
  children,
  prototypeName,
}: {
  children: ReactNode
  prototypeName: string
}) {
  const [viewport, setViewport] = useState<Viewport>(() =>
    readPreference('prototype-engine:viewport', 'responsive'),
  )
  const [theme, setTheme] = useState<Theme>(() =>
    readPreference('prototype-engine:theme', 'system'),
  )
  const [toolsOpen, setToolsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('prototype-engine:viewport', viewport)
  }, [viewport])

  useEffect(() => {
    localStorage.setItem('prototype-engine:theme', theme)
  }, [theme])

  const activeViewport = viewportOptions.find((option) => option.id === viewport)!
  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  return (
    <div className="workbench">
      <header className="workbench__bar" aria-label="Prototype developer tools">
        <Link className="workbench__back" to="/">
          <Icons.ArrowLeft aria-hidden="true" />
          <span>Prototypes</span>
        </Link>
        <span className="workbench__name" title={prototypeName}>
          {prototypeName}
        </span>

        <div className="workbench__desktop-controls">
          <div className="workbench__segmented" aria-label="Preview viewport">
            {viewportOptions.map(({ id, label, Icon }) => (
              <button
                aria-label={label}
                aria-pressed={viewport === id}
                className="workbench__icon-button"
                key={id}
                onClick={() => setViewport(id)}
                title={label}
                type="button"
              >
                <Icon aria-hidden="true" />
              </button>
            ))}
          </div>
          <label className="workbench__theme">
            <span>Theme</span>
            <select
              aria-label="Preview theme"
              className="select select-sm"
              onChange={(event) => setTheme(event.target.value as Theme)}
              value={theme}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>

        <button
          aria-expanded={toolsOpen}
          aria-label="Toggle preview tools"
          className="workbench__tools-toggle"
          onClick={() => setToolsOpen((open) => !open)}
          type="button"
        >
          {toolsOpen ? <Icons.X aria-hidden="true" /> : <Icons.Wrench aria-hidden="true" />}
        </button>
      </header>

      {toolsOpen && (
        <div className="workbench__mobile-controls">
          <label>
            <span>Viewport</span>
            <select
              className="select select-sm"
              onChange={(event) => setViewport(event.target.value as Viewport)}
              value={viewport}
            >
              {viewportOptions.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select
              className="select select-sm"
              onChange={(event) => setTheme(event.target.value as Theme)}
              value={theme}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      )}

      <div className="workbench__stage">
        <div
          className="workbench__viewport"
          data-theme={resolvedTheme}
          data-viewport={viewport}
          style={{ maxWidth: activeViewport.width }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
