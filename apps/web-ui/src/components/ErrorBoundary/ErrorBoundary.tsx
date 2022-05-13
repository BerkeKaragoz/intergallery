import React, { ErrorInfo } from "react";

type Props = {
  children?: React.ReactNode;
};

type State = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing your window.</p>
          <p>
            <code>{this.state.error && this.state.error.toString()}</code>
          </p>
          <details>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export type { State as ErrorBoundaryState };
export type { Props as ErrorBoundaryProps };
export default ErrorBoundary;
