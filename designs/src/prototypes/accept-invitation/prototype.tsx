import type { PrototypeComponentProps } from '../../engine/types/prototype'
import { AuthSurface, Field, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

function InvitationDetails() {
  return (
    <div className="auth-static__slip">
      <strong>HomePortal household</strong>
      <dl>
        <div><dt>Sent to</dt><dd>you@example.com</dd></div>
        <div><dt>Invited by</dt><dd>Household administrator</dd></div>
      </dl>
    </div>
  )
}

export function AcceptInvitationPrototype({ prototypeState = 'new-user' }: PrototypeComponentProps) {
  const isEmailMismatch = prototypeState === 'email-mismatch'

  const title = isEmailMismatch ? 'This invite is for another account' : 'You’ve been invited'
  const intro = isEmailMismatch
    ? 'You’re signed in with an email address that does not match this invitation.'
    : 'Create your account to join the household.'

  return (
    <AuthSurface
      context={[]}
      intro={intro}
      rootClass="homeportal-accept-invitation-prototype"
      surfaceLabel="Household invitation"
      title={title}
    >
      {isEmailMismatch ? (
        <>
          <div className="auth-static__notice auth-static__notice--danger" role="alert">
            <strong>Signed in as evan@example.com</strong>
            <p>Log out of this account before using the invitation sent to you@example.com.</p>
          </div>
          <InvitationDetails />
          <PrimaryButton>Log out of this account</PrimaryButton>
        </>
      ) : (
        <>
          <InvitationDetails />
          <div className="auth-static__form">
            <Field autoComplete="new-password" hint="Use at least 8 characters." label="Password" name="invitation-password" type="password" />
            <Field autoComplete="new-password" label="Confirm password" name="invitation-confirm-password" type="password" />
            <PrimaryButton>Create account and accept</PrimaryButton>
          </div>
        </>
      )}
    </AuthSurface>
  )
}
