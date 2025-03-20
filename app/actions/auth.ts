"use server"

import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sendWelcomeEmail } from "@/lib/email"
import crypto from "crypto"

interface RegisterState {
  error: string
  success: boolean
}

export async function register(
  state: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  try {
    await connectToDatabase()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Form data received:", { name, email, password: "***" })

    if (!name || !email || !password) {
      return { error: "All fields are required", success: false }
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long", success: false }
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { error: "User with this email already exists", success: false }
    }

    const hashedPassword = await hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      verificationToken,
      verificationTokenExpiry,
      createdAt: new Date(),
      updatedAt: new Date(),
      profilePicture: "",
      watchlist: [],
    })

    await newUser.save()

    // Try to send welcome email with verification link, but don't block registration if it fails
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`
      await sendWelcomeEmail(email, name, verificationUrl)
      // await sendWelcomeEmail(email, name, verificationToken)
    } catch (emailError) {
      console.error("Welcome email error:", emailError)
    }

    revalidatePath("/")
    return { error: "", success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user. Please try again.", success: false }
  }
}

export async function verifyEmail(token: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return { error: "Invalid or expired verification token" }
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined

    await user.save()

    return { success: true }
  } catch (error) {
    console.error("Email verification error:", error)
    return { error: "Failed to verify email. Please try again." }
  }
}
