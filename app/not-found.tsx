import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Frown, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center p-4">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center justify-center gap-4">
          <Frown className="w-16 h-16 text-red-400" />
          <CardTitle className="text-4xl font-bold">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-300">Oops! The page you're looking for doesn't exist.</p>
          <p className="text-md text-gray-400">
            It might have been moved, deleted, or you might have typed the address incorrectly.
          </p>
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
