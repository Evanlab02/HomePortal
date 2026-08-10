import type { PrototypeDefinition } from '../../engine/types/prototype'
import { SubmitFeedbackPrototype } from './prototype'
import '../../prototype-support/feedback/feedback.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'submit-feedback',
    name: 'Submit feedback',
    description: 'A form for reporting bugs, requesting features, and sharing other product feedback.',
    status: 'in-progress',
    updatedAt: '2026-08-10',
    tag: 'Feedback',
  },
  Component: SubmitFeedbackPrototype,
}

export default prototype
