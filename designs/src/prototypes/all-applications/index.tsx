import type { PrototypeDefinition } from '../../engine/types/prototype'
import { AllApplicationsPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'all-applications',
    name: 'All applications',
    description: 'The authenticated landing page and shared navigation shell for applications a user can access.',
    status: 'in-progress',
    updatedAt: '2026-08-10',
    tag: 'Home Portal Home',
  },
  states: [
    { id: 'loaded', label: 'Loaded' },
    { id: 'loading', label: 'Loading' },
    { id: 'error', label: 'Error' },
  ],
  Component: AllApplicationsPrototype,
}

export default prototype
