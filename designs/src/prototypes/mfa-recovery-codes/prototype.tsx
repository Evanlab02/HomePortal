import { AuthSurface, PrimaryButton } from '../../prototype-support/auth/AuthSurface'

const codes = ['ALDER-7Q4F', 'BRICK-2N8K', 'CEDAR-9T3M', 'DELTA-5W6P', 'EMBER-8C2R', 'FIELD-4H7V']

export function MfaRecoveryCodesPrototype() {
  return (
    <AuthSurface
      area="account"
      context={[]}
      intro="Save these one-time codes somewhere separate from your authenticator device."
      rootClass="homeportal-mfa-recovery-codes-prototype"
      surfaceLabel="Account security"
      title="Save your recovery codes"
    >
      <div className="auth-static__recovery-codes">
        {codes.map((code) => <code key={code}>{code}</code>)}
      </div>
      <label className="auth-static__check auth-static__check--spaced"><input type="checkbox" /><span>I have saved these codes somewhere safe.</span></label>
      <PrimaryButton>Finish setup</PrimaryButton>
    </AuthSurface>
  )
}
