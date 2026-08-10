import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AddApplicationPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'add-application',
    name: 'Add application',
    description: 'Add a custom application or review the upcoming third-party application mode.',
    status: 'in-progress',
    updatedAt: '2026-08-09',
    tag: 'Application Manager',
  },
  Component: AddApplicationPrototype,
}

export default prototype
