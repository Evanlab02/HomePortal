import type { PrototypeDefinition } from '../../engine/types/prototype'
import { MfaEnrollmentPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'mfa-enrollment',
    name: 'MFA enrollment',
    description: 'Optional authenticator setup from an authenticated account settings area.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tag: 'MFA',
  },
  Component: MfaEnrollmentPrototype,
}

export default prototype
