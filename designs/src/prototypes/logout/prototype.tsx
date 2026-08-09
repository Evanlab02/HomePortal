import { useState } from 'react'
import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function LogoutPrototype() {
  const [signOutEverywhere, setSignOutEverywhere] = useState(false)

  return (
    <AuthSurface
      area="account"
      context={[]}
      intro="You’ll need to sign in again to use HomePortal on this device."
      rootClass="homeportal-logout-prototype"
      surfaceLabel="Sign out"
      title="Sign out of HomePortal?"
    >
      <div className="auth-static__logout">
        <img alt="" src="/logo.png" />
        <div><strong>{signOutEverywhere ? 'End all sessions' : 'End this session'}</strong><p>{signOutEverywhere ? 'You’ll be signed out on every device.' : 'Other signed-in devices will not be affected.'}</p></div>
      </div>
      <div className="auth-static__logout-actions">
        <div className="auth-static__switch-row">
          <div>
            <strong id="sign-out-everywhere-label">Sign out on all devices</strong>
            <p id="sign-out-everywhere-description">End every active HomePortal session.</p>
          </div>
          <button
            aria-describedby="sign-out-everywhere-description"
            aria-labelledby="sign-out-everywhere-label"
            aria-checked={signOutEverywhere}
            className="auth-static__switch"
            onClick={() => setSignOutEverywhere((enabled) => !enabled)}
            role="switch"
            type="button"
          >
            <span />
          </button>
        </div>
        <PrimaryButton>{signOutEverywhere ? 'Sign out everywhere' : 'Sign out'}</PrimaryButton>
      </div>
    </AuthSurface>
  )
}
