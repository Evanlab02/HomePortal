import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function MfaChallengePrototype() {
  return (
    <AuthSurface
      context={[
        { title: 'Authenticator code', body: 'Use the current code from the authenticator connected to this account.', accent: 'amber' },
        { title: 'Recovery codes', body: 'A saved recovery code can be used when the authenticator is unavailable.' },
      ]}
      intro="Enter the current code from your authenticator app."
      rootClass="homeportal-mfa-challenge-prototype"
      surfaceLabel="Security check"
      title="One more check"
    >
      <div className="auth-static__form">
        <label className="auth-static__field">
          <span>6-digit code<em>Required</em></span>
          <input aria-label="6-digit authenticator code" autoComplete="one-time-code" className="auth-static__code" inputMode="numeric" maxLength={6} placeholder="000000" />
        </label>
        <PrimaryButton>Verify and continue</PrimaryButton>
      </div>
      <p className="auth-static__support"><strong>Use a recovery code</strong> if your authenticator is unavailable.</p>
    </AuthSurface>
  )
}
