import type { PrototypeDefinition } from '../../engine/types/prototype'
import { MfaChallengePrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'mfa-challenge',
    name: 'MFA challenge',
    description: 'The authenticator-code check shown after valid account credentials.',
    status: 'ready',
    updatedAt: '2026-08-09',
    tag: 'MFA',
  },
  Component: MfaChallengePrototype,
}

export default prototype
