import { AuthSurface, Field, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function RegisterPrototype() {
  return (
    <AuthSurface
      context={[
        { title: 'Invited already?', body: 'Open the invitation link you received instead of starting from this page.' },
      ]}
      rootClass="homeportal-register-prototype"
      surfaceLabel="Register account"
      title="Create your account"
    >
      <div className="auth-static__form">
        <Field autoComplete="email" label="Email address" name="email" placeholder="you@example.com" type="email" />
        <Field autoComplete="new-password" hint="Use at least 8 characters." label="Password" name="password" type="password" />
        <Field autoComplete="new-password" label="Confirm password" name="confirm-password" type="password" />
        <PrimaryButton>Create account</PrimaryButton>
      </div>
    </AuthSurface>
  )
}
