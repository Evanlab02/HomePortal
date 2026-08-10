import type { PrototypeDefinition } from '../../engine/types/prototype'
import { EditProfilePrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'edit-profile',
    name: 'Edit profile',
    description: 'The authenticated profile details form and route to password management.',
    status: 'ready',
    updatedAt: '2026-08-10',
    tag: 'Account & Security',
    relatedTasks: [{ identifier: 'EVA-6' }],
  },
  Component: EditProfilePrototype,
}

export default prototype
