import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    // Update user verification status
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined
    await user.save()

    // Redirect to login page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    )
  }
} 