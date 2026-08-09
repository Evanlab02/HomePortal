import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function MfaChallengePrototype() {
  return (
    <AuthSurface
      context={[]}
      intro="Enter the current code from your authenticator app."
      rootClass="homeportal-mfa-challenge-prototype"
      surfaceLabel="Security check"
      title="One more check"
    >
      <div className="auth-static__form">
        <div className="auth-static__field">
          <label htmlFor="authenticator-code">6-digit code</label>
          <input
            autoComplete="one-time-code"
            className="auth-static__code"
            id="authenticator-code"
            inputMode="numeric"
            maxLength={6}
            name="authenticator-code"
            pattern="[0-9]{6}"
            placeholder="000000"
            required
          />
        </div>
        <PrimaryButton>Verify and continue</PrimaryButton>
      </div>
      <p className="auth-static__support"><strong>Use a recovery code</strong> if your authenticator is unavailable.</p>
    </AuthSurface>
  )
}
