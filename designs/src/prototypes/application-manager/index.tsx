import type { PrototypeDefinition } from '../../engine/types/prototype'
import { ApplicationManagerPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'application-manager',
    name: 'Application manager',
    description: 'Search, filter, inspect, edit, and remove applications registered with HomePortal.',
    status: 'ready',
    updatedAt: '2026-08-09',
    tag: 'Application Manager',
  },
  states: [
    { id: 'loaded', label: 'Loaded' },
    { id: 'loading', label: 'Loading' },
  ],
  Component: ApplicationManagerPrototype,
}

export default prototype
