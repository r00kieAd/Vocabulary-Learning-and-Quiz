import { Component, type ReactNode } from "react"
import DisplayError from "./display_error"

type Props = {
  children: ReactNode
  fallback?: React.ComponentType<{ errorMessage?: string }>
}

type State = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: import("react").ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DisplayError
      return <Fallback errorMessage={this.state.error.message} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
