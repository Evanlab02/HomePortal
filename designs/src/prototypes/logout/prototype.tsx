import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function LogoutPrototype() {
  return (
    <AuthSurface
      area="account"
      context={[
        { title: 'This device only', body: 'Signing out ends the current browser session without affecting other devices.', accent: 'amber' },
        { title: 'Using a shared device?', body: 'Signing out is recommended whenever other household members use this browser.' },
      ]}
      intro="You’ll need to sign in again to use HomePortal on this device."
      rootClass="homeportal-logout-prototype"
      surfaceLabel="Sign out"
      title="Sign out of HomePortal?"
    >
      <div className="auth-static__logout">
        <img alt="" src="/logo.png" />
        <div><strong>End this session</strong><p>Other signed-in devices will not be affected.</p></div>
      </div>
      <PrimaryButton>Sign out</PrimaryButton>
    </AuthSurface>
  )
}
