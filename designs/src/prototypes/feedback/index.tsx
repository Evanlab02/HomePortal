import type { PrototypeDefinition } from '../../engine/types/prototype'
import { FeedbackPrototype } from './prototype'
import '../../prototype-support/feedback/feedback.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'feedback',
    name: 'Feedback',
    description: 'Search, filter, inspect, and update submitted product feedback.',
    status: 'in-progress',
    updatedAt: '2026-08-10',
    tag: 'Feedback',
  },
  Component: FeedbackPrototype,
}

export default prototype
