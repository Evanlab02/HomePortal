import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function MfaEnrollmentPrototype() {
  return (
    <AuthSurface
      area="account"
      context={[]}
      intro="Connect an authenticator app to add a second check when you sign in."
      rootClass="homeportal-mfa-enrollment-prototype"
      surfaceLabel="Account security"
      title="Add an authenticator"
    >
      <div className="auth-static__qr-layout">
        <div className="auth-static__qr"><img alt="Example QR code for authenticator setup" src="/qr-placeholder.svg" /></div>
        <div><strong>Scan with your authenticator app</strong><p>Or enter this setup key manually:</p><code className="auth-static__setup-key">HP-7K4M-9Q2D-6W8R</code></div>
      </div>
      <div className="auth-static__form">
        <div className="auth-static__field">
          <label htmlFor="enrollment-code">6-digit verification code<em>Required</em></label>
          <input
            autoComplete="one-time-code"
            className="auth-static__code"
            id="enrollment-code"
            inputMode="numeric"
            maxLength={6}
            name="enrollment-code"
            pattern="[0-9]{6}"
            placeholder="000000"
            required
          />
          <small>Enter the current code from your authenticator app.</small>
        </div>
        <PrimaryButton>Verify and enable MFA</PrimaryButton>
      </div>
    </AuthSurface>
  )
}
