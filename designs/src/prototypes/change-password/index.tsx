import type { PrototypeDefinition } from '../../engine/types/prototype'
import { ChangePasswordPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'change-password',
    name: 'Change password',
    description: 'The authenticated form for changing an account password.',
    status: 'ready',
    updatedAt: '2026-08-10',
    tag: 'Account & Security',
    relatedTasks: [{ identifier: 'EVA-6' }],
  },
  Component: ChangePasswordPrototype,
}

export default prototype
