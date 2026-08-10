import type { PrototypeDefinition } from '../../engine/types/prototype'
import { LogoutPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'logout',
    name: 'Sign out confirmation',
    description: 'A deliberate confirmation before ending the current or all browser sessions.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tag: 'Authentication',
  },
  Component: LogoutPrototype,
}

export default prototype
