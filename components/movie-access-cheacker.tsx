"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { requestMovie } from "@/app/actions/movie-request"
import { useRouter } from "next/navigation"
import { checkMovieAccess } from "@/app/actions/movie-request"

interface MovieAccessCheckerProps {
  movieId: string
  children: React.ReactNode
}

export default function MovieAccessChecker({ movieId, children }: MovieAccessCheckerProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true)
        const result = await checkMovieAccess(movieId)
        setHasAccess(result.hasAccess)
      } catch (error) {
        console.error("Error checking access:", error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [movieId])

  const handleRequestAccess = async () => {
    setIsRequesting(true)
    try {
      const result = await requestMovie(movieId)
      if (result.success) {
        toast({
          title: "Request Submitted",
          description: "Your request has been submitted successfully.",
          variant: "success",
        })
      } else {
        toast({
          title: "Request Failed",
          description: result.error || "Failed to submit request. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRequesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="border rounded-lg p-8 text-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-muted p-3">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Premium Content</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This content requires special access. Request access to watch the full movie.
          </p>
          <Button onClick={handleRequestAccess} disabled={isRequesting} className="gap-2 mt-2">
            <Plus className="h-4 w-4" />
            {isRequesting ? "Submitting Request..." : "Request Access"}
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

