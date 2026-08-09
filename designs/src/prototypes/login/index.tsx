import type { PrototypeDefinition } from '../../engine/types/prototype'
import { LoginPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'login',
    name: 'Sign in',
    description: 'The default arrival page for an existing HomePortal account.',
    status: 'ready',
    updatedAt: '2026-08-09',
    tag: 'Authentication',
  },
  Component: LoginPrototype,
}

export default prototype
