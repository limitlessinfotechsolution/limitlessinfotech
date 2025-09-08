import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldOff } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <ShieldOff className="mb-6 h-24 w-24 text-destructive" />
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Unauthorized Access</h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        You do not have the necessary permissions to view this page. Please contact your administrator if you believe
        this is an error.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild className="btn-gradient">
          <Link href="/">Go to Homepage</Link>
        </Button>
        <Button asChild variant="outline" className="btn-outline-primary bg-transparent">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
