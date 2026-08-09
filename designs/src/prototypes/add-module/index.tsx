import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AddModulePrototype } from './prototype'
import '../../prototype-support/custom-modules/custom-modules.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'add-module',
    name: 'Add module',
    description: 'Create a custom module and its initial Docker Compose file.',
    status: 're-review',
    updatedAt: '2026-08-09',
    tag: 'Custom Modules Editor',
  },
  Component: AddModulePrototype,
}

export default prototype
