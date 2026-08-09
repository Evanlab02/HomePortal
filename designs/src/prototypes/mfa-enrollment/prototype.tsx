import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function MfaEnrollmentPrototype() {
  return (
    <AuthSurface
      area="account"
      context={[
        { title: 'Optional protection', body: 'Authenticator MFA can be added from account settings and removed later.', accent: 'amber' },
        { title: 'Keep recovery separate', body: 'Recovery codes should be saved somewhere other than the authenticator device.' },
      ]}
      intro="Connect an authenticator app to add a second check when you sign in."
      rootClass="homeportal-mfa-enrollment-prototype"
      surfaceLabel="Account security"
      title="Add an authenticator"
    >
      <div className="auth-static__qr-layout">
        <div className="auth-static__qr"><img alt="Example QR code for authenticator setup" src="/qr-placeholder.svg" /></div>
        <div><strong>Scan with your authenticator app</strong><p>Or enter this setup key manually:</p><code className="auth-static__setup-key">HP-7K4M-9Q2D-6W8R</code></div>
      </div>
      <PrimaryButton>Continue to confirmation</PrimaryButton>
    </AuthSurface>
  )
}
