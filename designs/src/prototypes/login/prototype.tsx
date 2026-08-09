import { AuthSurface, Field, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function LoginPrototype() {
  return (
    <AuthSurface
      context={[
        { title: 'Shared device?', body: 'Leave “Remember this device” clear on devices used by other people.' },
      ]}
      intro="Sign in to continue to your household’s HomePortal."
      rootClass="homeportal-login-prototype"
      surfaceLabel="Sign in"
      title="Welcome home"
    >
      <div className="auth-static__form">
        <Field autoComplete="email" label="Email address" name="email" placeholder="you@example.com" type="email" />
        <Field autoComplete="current-password" label="Password" name="password" type="password" />
        <label className="auth-static__check"><input type="checkbox" /><span>Remember this device</span></label>
        <PrimaryButton>Sign in</PrimaryButton>
      </div>
      <p className="auth-static__support">New to HomePortal? <strong>Create an account from the registration page.</strong></p>
    </AuthSurface>
  )
}
