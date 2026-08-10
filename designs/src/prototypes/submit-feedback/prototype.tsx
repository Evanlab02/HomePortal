import { ArrowRight, MessageSquarePlus } from 'lucide-react'
import { AuthenticatedAppShell } from '../../prototype-support/authenticated/AuthenticatedAppShell'

export function SubmitFeedbackPrototype() {
  return (
    <AuthenticatedAppShell>
      <div className="feedback-form-page">
        <header><span><MessageSquarePlus aria-hidden="true" /></span><div><h1>Submit feedback</h1><p>Report a problem, suggest an improvement, or tell us what would make HomePortal more useful.</p></div></header>
        <form>
          <label><span>Feedback type</span><select defaultValue="" required><option disabled value="">Choose a type</option><option>Bug report</option><option>Feature request</option><option>Improvement</option><option>Other</option></select></label>
          <label><span>Title</span><input maxLength={120} placeholder="Summarise your feedback" required /></label>
          <label><span>Details</span><textarea aria-describedby="feedback-details-hint" placeholder="What happened, what did you expect, or what would you like to see?" required rows={5} /><small id="feedback-details-hint">Include enough context for someone else to understand the request.</small></label>
          <footer><a href="/prototypes/feedback" target="_top">View all feedback</a><button type="button">Submit feedback<ArrowRight aria-hidden="true" /></button></footer>
        </form>
      </div>
    </AuthenticatedAppShell>
  )
}
