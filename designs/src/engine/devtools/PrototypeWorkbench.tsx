import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Icons } from '../components/Icon'
import type { PrototypeState } from '../types/prototype'

type Viewport =
  | 'responsive'
  | '4k'
  | '1440p'
  | '1080p'
  | 'laptop-1080p'
  | 'tablet-landscape'
  | 'tablet-portrait'
  | 'mobile'
type Theme = 'system' | 'light' | 'dark'

const viewportOptions: Array<{
  id: Viewport
  label: string
  width: string
  height: string
}> = [
  {
    id: 'responsive',
    label: 'Responsive',
    width: '100%',
    height: 'calc(100vh - 72px)',
  },
  { id: '4k', label: '4K · 3840 × 2160', width: '3840px', height: '2160px' },
  { id: '1440p', label: '1440p · 2560 × 1440', width: '2560px', height: '1440px' },
  { id: '1080p', label: '1080p · 1920 × 1080', width: '1920px', height: '1080px' },
  {
    id: 'laptop-1080p',
    label: '1080p laptop · 1536 × 864',
    width: '1536px',
    height: '864px',
  },
  {
    id: 'tablet-landscape',
    label: 'Tablet horizontal · 1024 × 768',
    width: '1024px',
    height: '768px',
  },
  {
    id: 'tablet-portrait',
    label: 'Tablet vertical · 768 × 1024',
    width: '768px',
    height: '1024px',
  },
  { id: 'mobile', label: 'Mobile · 390 × 844', width: '390px', height: '844px' },
]

function readPreference<T extends string>(key: string, fallback: T): T {
  return (localStorage.getItem(key) as T | null) ?? fallback
}

function readViewportPreference(): Viewport {
  const stored = localStorage.getItem('prototype-engine:viewport')
  if (stored === 'desktop') return 'laptop-1080p'
  if (stored === 'tablet') return 'tablet-portrait'
  return viewportOptions.some(({ id }) => id === stored) ? (stored as Viewport) : 'responsive'
}

function PrototypePreview({
  children,
  prototypeName,
  theme,
  viewport,
  width,
  height,
}: {
  children: ReactNode
  prototypeName: string
  theme: 'light' | 'dark'
  viewport: Viewport
  width: string
  height: string
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const syncStyles = useCallback(() => {
    const frameDocument = frameRef.current?.contentDocument
    if (!frameDocument) return

    frameDocument.head
      .querySelectorAll('[data-prototype-engine-style]')
      .forEach((node) => node.remove())

    const styles = Array.from(document.head.children)
      .filter((node) =>
        node.matches('style, link[rel="stylesheet"], link[rel="preload"][as="style"]'),
      )
      .map((node) => {
        const clone = node.cloneNode(true) as HTMLElement
        clone.dataset.prototypeEngineStyle = ''
        return clone
      })

    frameDocument.head.append(...styles)
  }, [])

  const prepareFrame = () => {
    const frameDocument = frameRef.current?.contentDocument
    if (!frameDocument) return

    syncStyles()

    const root = frameDocument.getElementById('prototype-root')
    if (root) setPortalRoot(root)
  }

  useEffect(() => {
    if (!portalRoot) return

    const observer = new MutationObserver(syncStyles)
    observer.observe(document.head, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [portalRoot, syncStyles])

  useEffect(() => {
    if (portalRoot) portalRoot.dataset.theme = theme
  }, [portalRoot, theme])

  return (
    <iframe
      className="workbench__viewport"
      data-viewport={viewport}
      onLoad={prepareFrame}
      ref={frameRef}
      srcDoc={'<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body,#prototype-root{margin:0;min-height:100%}</style></head><body><div id="prototype-root"></div></body></html>'}
      style={{ height, width }}
      title={`${prototypeName} preview`}
    >
      {portalRoot && createPortal(children, portalRoot)}
    </iframe>
  )
}

export function PrototypeWorkbench({
  children,
  prototypeName,
  states,
}: {
  children: (prototypeState?: string) => ReactNode
  prototypeName: string
  states?: PrototypeState[]
}) {
  const [viewport, setViewport] = useState<Viewport>(readViewportPreference)
  const [theme, setTheme] = useState<Theme>(() =>
    readPreference('prototype-engine:theme', 'system'),
  )
  const [toolsOpen, setToolsOpen] = useState(false)
  const [prototypeState, setPrototypeState] = useState(() => states?.[0]?.id)
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    localStorage.setItem('prototype-engine:viewport', viewport)
  }, [viewport])

  useEffect(() => {
    localStorage.setItem('prototype-engine:theme', theme)
  }, [theme])

  useEffect(() => {
    setPrototypeState((current) =>
      states?.some(({ id }) => id === current) ? current : states?.[0]?.id,
    )
  }, [states])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const activeViewport = viewportOptions.find((option) => option.id === viewport)!
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

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
          {states && states.length > 1 && (
            <label className="workbench__state-picker">
              <span>State</span>
              <select
                aria-label="Prototype state"
                className="select select-sm"
                onChange={(event) => setPrototypeState(event.target.value)}
                value={prototypeState}
              >
                {states.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </label>
          )}
          <label className="workbench__viewport-picker">
            <span>Viewport</span>
            <select
              aria-label="Preview viewport"
              className="select select-sm"
              onChange={(event) => setViewport(event.target.value as Viewport)}
              value={viewport}
            >
              {viewportOptions.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </label>
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
          {states && states.length > 1 && (
            <label>
              <span>State</span>
              <select
                aria-label="Prototype state"
                className="select select-sm"
                onChange={(event) => setPrototypeState(event.target.value)}
                value={prototypeState}
              >
                {states.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </label>
          )}
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
        <PrototypePreview
          prototypeName={prototypeName}
          theme={resolvedTheme}
          viewport={viewport}
          height={activeViewport.height}
          width={activeViewport.width}
        >
          {children(prototypeState)}
        </PrototypePreview>
      </div>
    </div>
  )
}
