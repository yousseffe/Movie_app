"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { verifyEmail } from "@/app/actions/auth"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. Please request a new verification email.")
      return
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token)
        if (result.success) {
          setStatus("success")
          setMessage("Your email has been successfully verified!")
        } else {
          setStatus("error")
          setMessage(result.error || "Verification failed. Please try again.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    verify()
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Email Verification</h1>

          <div className="mt-6">
            {status === "loading" && (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Verifying your email...</p>
              </div>
            )}

            {status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-600">{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="mt-6">
            {status === "success" && (
              <Button className="w-full" onClick={() => router.push("/login")}>
                Go to Login
              </Button>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/resend-verification">Resend Verification Email</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

