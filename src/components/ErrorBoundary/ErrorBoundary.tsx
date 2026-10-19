import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="mx-auto flex min-h-96 max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p>We couldn’t load this page. Please try again.</p>
          <button
            type="button"
            className="rounded bg-accent px-5 py-3 text-text"
            onClick={() => this.setState({ failed: false })}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
