// app/error.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    console.error("[ErrorPage] Caught error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-destructive mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <div className="flex gap-4">
        <Button onClick={() => router.refresh()}>Refresh Page</Button>
        <Button variant="outline" onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
