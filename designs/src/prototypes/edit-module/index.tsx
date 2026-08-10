import type { PrototypeDefinition } from '../../engine/types/prototype'
import { EditModulePrototype } from './prototype'
import '../../prototype-support/custom-modules/custom-modules.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'edit-module',
    name: 'Edit module',
    description: 'Edit a module Docker Compose file with Monaco Editor.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tag: 'Custom Modules Editor',
  },
  Component: EditModulePrototype,
}

export default prototype
