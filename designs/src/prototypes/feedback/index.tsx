import type { PrototypeDefinition } from '../../engine/types/prototype'
import { FeedbackPrototype } from './prototype'
import '../../prototype-support/feedback/feedback.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'feedback',
    name: 'Feedback',
    description: 'Search, filter, inspect, and update submitted product feedback.',
    status: 'ready',
    updatedAt: '2026-08-10',
    tag: 'Feedback',
    relatedTasks: [{ identifier: 'EVA-7' }],
  },
  states: [
    { id: 'list', label: 'List view' },
    { id: 'details', label: 'Feedback details' },
  ],
  Component: FeedbackPrototype,
}

export default prototype
