import type { PrototypeDefinition } from '../../engine/types/prototype'
import { MfaRecoveryCodesPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'mfa-recovery-codes',
    name: 'MFA recovery codes',
    description: 'The one-time recovery-code handoff shown after authenticator setup.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tags: ['Auth', 'Account settings', 'MFA'],
  },
  Component: MfaRecoveryCodesPrototype,
}

export default prototype
