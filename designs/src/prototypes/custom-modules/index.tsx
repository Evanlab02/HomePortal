import type { PrototypeDefinition } from '../../engine/types/prototype'
import { CustomModulesPrototype } from './prototype'
import '../../prototype-support/custom-modules/custom-modules.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'custom-modules',
    name: 'Custom modules',
    description: 'Search, edit, and remove Docker Compose modules stored under custom paths.',
    status: 're-review',
    updatedAt: '2026-08-09',
    tag: 'Custom Modules Editor',
  },
  states: [
    { id: 'all-applied', label: 'All changes applied' },
    { id: 'changes-pending', label: 'Changes pending' },
  ],
  Component: CustomModulesPrototype,
}

export default prototype
