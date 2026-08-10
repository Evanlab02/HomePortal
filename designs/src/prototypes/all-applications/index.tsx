import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AllApplicationsPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'all-applications',
    name: 'All applications',
    description: 'The authenticated landing page and shared navigation shell for applications a user can access.',
    status: 'ready',
    updatedAt: '2026-08-10',
    tag: 'Home Portal Home',
    relatedTasks: [{ identifier: 'EVA-4' }],
  },
  states: [
    { id: 'loaded', label: 'Loaded' },
    { id: 'preview', label: 'Preview mode' },
    { id: 'loading', label: 'Loading' },
    { id: 'error', label: 'Error' },
  ],
  Component: AllApplicationsPrototype,
}

export default prototype
