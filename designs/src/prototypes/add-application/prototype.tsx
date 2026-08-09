import { ArrowLeft, Boxes, CircleAlert, ExternalLink, Plus, Sparkles } from 'lucide-react'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

export function AddApplicationPrototype() {
  return (
    <AuthenticatedAppShell>
      <section className="authenticated-app-shell__mobile-notice">
        <span><CircleAlert aria-hidden="true" /></span>
        <h1>Not available on mobile</h1>
        <p>Application Manager needs a larger screen. Open it on a tablet or computer.</p>
      </section>
      <div className="add-application">
        <a className="add-application__back" href="/prototypes/application-manager" target="_top"><ArrowLeft aria-hidden="true" />Application manager</a>
        <header className="add-application__heading">
          <h1>Add application</h1>
          <p>Choose how the application should be added to HomePortal.</p>
        </header>

        <div aria-label="Application source" className="add-application__modes">
          <button aria-pressed="true" className="add-application__mode add-application__mode--active" type="button">
            <span><Boxes aria-hidden="true" /></span>
            <strong>Custom application</strong>
            <small>Add an application using its name and URL.</small>
          </button>
          <button aria-describedby="third-party-coming-soon" className="add-application__mode" disabled type="button">
            <span><ExternalLink aria-hidden="true" /></span>
            <strong>Third-party application</strong>
            <small id="third-party-coming-soon">Choose from supported integrations.</small>
            <em><Sparkles aria-hidden="true" />Coming soon</em>
          </button>
        </div>

        <section aria-labelledby="custom-application-heading" className="add-application__section">
          <div className="add-application__section-heading">
            <h2 id="custom-application-heading">Custom application details</h2>
            <p>This information will be shown in the HomePortal application list.</p>
          </div>
          <form className="add-application__form" onSubmit={(event) => event.preventDefault()}>
            <label><span>Name</span><input autoComplete="off" name="name" placeholder="e.g. Grafana" type="text" /></label>
            <label><span>URL <small>Required</small></span><input autoComplete="url" name="url" placeholder="https://grafana.home" required type="url" /></label>
            <label className="add-application__wide-field"><span>Short description</span><input aria-describedby="short-description-hint" maxLength={100} name="shortDescription" placeholder="A short summary for application lists" type="text" /><small id="short-description-hint">Keep this to one sentence.</small></label>
            <label className="add-application__wide-field"><span>Long description</span><textarea name="longDescription" placeholder="Describe what the application does and when you use it." rows={5} /></label>
            <div className="add-application__actions"><a href="/prototypes/application-manager" target="_top">Cancel</a><button type="submit"><Plus aria-hidden="true" />Add application</button></div>
          </form>
        </section>
      </div>
    </AuthenticatedAppShell>
  )
}
