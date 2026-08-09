import type { PrototypeDefinition } from '../../engine/types/prototype'
import { ChangePasswordPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'change-password',
    name: 'Change password',
    description: 'The authenticated form for changing an account password.',
    status: 'ready',
    updatedAt: '2026-08-09',
    tag: 'Account & Security',
  },
  Component: ChangePasswordPrototype,
}

export default prototype
