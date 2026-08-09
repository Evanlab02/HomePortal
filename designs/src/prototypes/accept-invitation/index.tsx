import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AcceptInvitationPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'accept-invitation',
    name: 'Accept invitation',
    description: 'The direct-link landing page for a valid household invitation.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tags: ['Auth', 'Direct link'],
  },
  Component: AcceptInvitationPrototype,
}

export default prototype
