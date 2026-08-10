import type { PrototypeDefinition } from '../../engine/types/prototype'
import { EditProfilePrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'edit-profile',
    name: 'Edit profile',
    description: 'The authenticated profile details form and route to password management.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tag: 'Account & Security',
  },
  Component: EditProfilePrototype,
}

export default prototype
