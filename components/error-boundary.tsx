"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4">
          <Card className="w-full max-w-lg border-destructive bg-destructive/10 text-destructive">
            <CardHeader className="flex flex-row items-center space-x-3">
              <AlertTriangle className="h-8 w-8" />
              <CardTitle className="text-2xl font-bold">Something went wrong!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">We're sorry, but an unexpected error occurred. Please try refreshing the page.</p>
              {this.state.error && (
                <div className="rounded-md bg-destructive/20 p-3 text-sm font-mono text-destructive-foreground">
                  <p className="font-semibold">Error Message:</p>
                  <pre className="whitespace-pre-wrap break-all">{this.state.error.message}</pre>
                </div>
              )}
              {this.state.errorInfo && (
                <details className="mt-4 text-sm text-destructive-foreground">
                  <summary className="cursor-pointer font-semibold">Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all p-2 rounded-md bg-destructive/20">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
