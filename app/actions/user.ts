"use server"

import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import bcrypt from "bcryptjs"

export async function updateProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const phone = formData.get("phone") as string
    const bio = formData.get("bio") as string

    // Handle avatar upload
    const avatarFile = formData.get("avatar") as File
    let avatarUrl

    if (avatarFile && avatarFile.size > 0) {
      const result = await uploadImage(avatarFile, "avatars")
      avatarUrl = result.url

      // Delete old avatar if it exists
      const user = await User.findById(session.user.id)
      if (user.avatar) {
        const publicId = user.avatar.split("/").slice(-1)[0].split(".")[0]
        await deleteImage(`movie-app/avatars/${publicId}`)
      }
    }

    // Update user
    const updateData: any = {
      name,
      username,
      phone,
      bio,
    }

    if (avatarUrl) {
      updateData.avatar = avatarUrl
    }

    const updatedUser = await User.findByIdAndUpdate(session.user.id, updateData, { new: true })

    revalidatePath("/profile")

    return { success: true, data: JSON.parse(JSON.stringify(updatedUser)) }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "Failed to update profile" }
  }
}

export async function changePassword(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match" }
    }

    const user = await User.findById(session.user.id)

    if (!user) {
      return { error: "User not found" }
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return { error: "Current password is incorrect" }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    user.password = hashedPassword
    await user.save()

    revalidatePath("/settings/change-password")

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { error: "Failed to change password" }
  }
}