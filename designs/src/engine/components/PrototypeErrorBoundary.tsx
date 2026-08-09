import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Icons } from './Icon'

interface Props {
  children: ReactNode
  prototypeName: string
}

interface State {
  error: Error | null
}

export class PrototypeErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Prototype "${this.props.prototypeName}" failed to render.`, error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="engine-failure" role="alert">
        <Icons.CircleAlert aria-hidden="true" />
        <h1>{this.props.prototypeName} stopped rendering</h1>
        <p>
          The failure is contained to this prototype. Return to the index or
          reload after fixing the error.
        </p>
        <pre>{this.state.error.message}</pre>
        <div className="engine-failure__actions">
          <a className="btn btn-neutral" href="/">
            Return to index
          </a>
          <button className="btn btn-ghost" type="button" onClick={() => location.reload()}>
            Reload prototype
          </button>
        </div>
      </main>
    )
  }
}
