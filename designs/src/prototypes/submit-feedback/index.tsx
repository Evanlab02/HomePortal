import type { PrototypeDefinition } from '../../engine/types/prototype'
import { SubmitFeedbackPrototype } from './prototype'
import '../../prototype-support/feedback/feedback.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'submit-feedback',
    name: 'Submit feedback',
    description: 'A form for reporting bugs, requesting features, and sharing other product feedback.',
    status: 'ready',
    updatedAt: '2026-08-10',
    tag: 'Feedback',
    relatedTasks: [{ identifier: 'EVA-7' }],
  },
  Component: SubmitFeedbackPrototype,
}

export default prototype
