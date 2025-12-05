"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

interface CartErrorFallbackProps {
  onRetry: () => void
}

export function CartErrorFallback({ onRetry }: CartErrorFallbackProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          Cart Error
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-gray-600 mb-4">There was an issue loading your cart. This might be due to:</p>
        <ul className="text-sm text-gray-500 mb-6 text-left max-w-md mx-auto">
          <li>• Database connection issues</li>
          <li>• Missing environment variables</li>
          <li>• Database tables not created yet</li>
        </ul>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}
