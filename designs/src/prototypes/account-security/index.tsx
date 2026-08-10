import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AccountSecurityPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'account-security',
    name: 'Account & security',
    description: 'A single account surface for profile details, password changes, and multi-factor authentication.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tag: 'Account & Security',
  },
  states: [
    { id: 'mfa-enabled', label: 'MFA enabled' },
    { id: 'mfa-disabled', label: 'MFA disabled' },
  ],
  Component: AccountSecurityPrototype,
}

export default prototype
