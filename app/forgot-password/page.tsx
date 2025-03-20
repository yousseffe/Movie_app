import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forgot Password | Vidoe",
  description: "Reset your Vidoe account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
        <Link href="/" className="mb-4 flex items-center text-2xl font-bold text-primary">
          <span className="sr-only">Vidoe</span>
          <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="text-xl font-bold">V</span>
          </div>
          Vidoe
        </Link>
        <div className="mx-auto flex w-full max-w-md justify-center">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

