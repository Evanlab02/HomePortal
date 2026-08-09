import { useState, type ReactNode } from 'react'
import { ArrowRight, CircleHelp, Eye, EyeOff, ShieldCheck, SunMoon } from 'lucide-react'

export interface ContextItem {
  title: string
  body: string
  accent?: 'amber' | 'blue'
}

export function HomePortalIdentity({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`auth-static__identity ${compact ? 'auth-static__identity--compact' : ''}`}>
      <img alt="" src="/logo.png" />
      <span>HomePortal</span>
    </span>
  )
}

export function AuthSurface({
  area = 'access',
  children,
  context,
  intro,
  rootClass,
  surfaceLabel,
  title,
}: {
  area?: 'access' | 'account'
  children: ReactNode
  context: ContextItem[]
  intro?: string
  rootClass: string
  surfaceLabel: string
  title: string
}) {
  return (
    <div className={`auth-static ${rootClass}`}>
      <header className="auth-static__header">
        <HomePortalIdentity />
        <div className="auth-static__location">
          <span>{area === 'account' ? 'Account' : 'Access'}</span>
          <strong>{surfaceLabel}</strong>
        </div>
        <button
          aria-label="Toggle light and dark theme"
          className="auth-static__theme-toggle"
          onClick={(event) => {
            const prototypeRoot = event.currentTarget.ownerDocument.getElementById('prototype-root')
            if (prototypeRoot) prototypeRoot.dataset.theme = prototypeRoot.dataset.theme === 'dark' ? 'light' : 'dark'
          }}
          title="Toggle theme"
          type="button"
        >
          <SunMoon aria-hidden="true" />
        </button>
      </header>

      <main className="auth-static__surface">
        <section className="auth-static__task">
          <div className="auth-static__heading">
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
          </div>
          <div className="auth-static__body">{children}</div>
        </section>

        <aside
          className={`auth-static__context ${context.length === 0 ? 'auth-static__context--brand-only' : ''}`}
          aria-label={context.length === 0 ? 'HomePortal' : 'Helpful context'}
        >
          <div className="auth-static__brand-stage" aria-hidden="true">
            <img alt="" src="/logo.png" />
            <strong>HomePortal</strong>
          </div>
          {context.map((item) => (
            <section key={item.title}>
              <span className={`auth-static__context-icon ${item.accent === 'amber' ? 'is-amber' : ''}`} aria-hidden="true">
                {item.accent === 'amber' ? <ShieldCheck /> : <CircleHelp />}
              </span>
              <div><h2>{item.title}</h2><p>{item.body}</p></div>
            </section>
          ))}
        </aside>
      </main>
    </div>
  )
}

export function Field({
  autoComplete,
  hint,
  label,
  name,
  placeholder,
  type = 'text',
}: {
  autoComplete?: string
  hint?: string
  label: string
  name: string
  placeholder?: string
  type?: string
}) {
  const isPassword = type === 'password'
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className="auth-static__field">
      <label htmlFor={name}>{label}<em>Required</em></label>
      <span className="auth-static__input-wrap">
        <input autoComplete={autoComplete} id={name} name={name} placeholder={placeholder} type={isPassword && passwordVisible ? 'text' : type} />
        {isPassword && (
          <button
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            onClick={() => setPasswordVisible((visible) => !visible)}
            type="button"
          >
            {passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        )}
      </span>
      {hint && <small>{hint}</small>}
    </div>
  )
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return <button className="auth-static__primary" type="button"><span>{children}</span><ArrowRight aria-hidden="true" /></button>
}
