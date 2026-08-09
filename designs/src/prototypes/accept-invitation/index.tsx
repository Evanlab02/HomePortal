import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AcceptInvitationPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'accept-invitation',
    name: 'Accept invitation',
    description: 'The direct-link landing page for a valid household invitation.',
    status: 'ready',
    updatedAt: '2026-08-09',
    tag: 'Authentication',
  },
  states: [
    { id: 'new-user', label: 'New user' },
    { id: 'email-mismatch', label: 'Wrong signed-in account' },
  ],
  Component: AcceptInvitationPrototype,
}

export default prototype
