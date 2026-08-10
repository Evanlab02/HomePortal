import type { PrototypeDefinition } from '../../engine/types/prototype'
import { RegisterPrototype } from './prototype'
import '../../prototype-support/auth/auth-surface.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'register',
    name: 'Register account',
    description: 'Open account creation.',
    status: 'ready',
    updatedAt: '2026-08-10',
    tag: 'Authentication',
    relatedTasks: [{ identifier: 'EVA-5' }],
  },
  Component: RegisterPrototype,
}

export default prototype
