import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

export function AcceptInvitationPrototype() {
  return (
    <AuthSurface
      context={[
        { title: 'A direct invitation', body: 'This page is reached from the unique link sent by a household member.', accent: 'amber' },
        { title: 'Review before accepting', body: 'The invitation identifies the household and the email address it was sent to.' },
      ]}
      intro="Review the household invitation before connecting it to your account."
      rootClass="homeportal-accept-invitation-prototype"
      surfaceLabel="Household invitation"
      title="You’ve been invited"
    >
      <div className="auth-static__slip">
        <strong>HomePortal household</strong>
        <dl>
          <div><dt>Sent to</dt><dd>you@example.com</dd></div>
          <div><dt>Invited by</dt><dd>Household administrator</dd></div>
        </dl>
      </div>
      <PrimaryButton>Accept invitation</PrimaryButton>
      <p className="auth-static__support">Already have an account? <strong>You’ll confirm it after accepting.</strong></p>
    </AuthSurface>
  )
}
