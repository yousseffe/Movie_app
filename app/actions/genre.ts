"use server"

import connectToDatabase from "@/lib/mongodb"
import Genre from "@/models/Genre"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { generatePrimeSync } from "node:crypto"

export async function createGenre(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const nameEnglish = formData.get("nameEnglish") as string
    const nameArabic = formData.get("nameArabic") as string
    const status = formData.get("status") === "on" || formData.get("status") === "true"
    console.log("Form Data Values:", { nameEnglish, nameArabic, status })
    if (!nameEnglish) {
      return { error: "Name in English is required" }
    }
    console.log("Creating genre")
    const genre = new Genre({
      nameEnglish,
      nameArabic,
      status,
    })
    console.log("Genre:", genre)
    await genre.save()
    console.log("Genre saved")
    revalidatePath("/admin/genre")

    return { success: true, data: JSON.parse(JSON.stringify(genre)) }
  } catch (error: any) {
    console.error("Error creating genre:", error)

    if (error.code === 11000) {
      return { error: "Genre already exists" }
    }

    return { error: "Failed to create genre" }
  }
}

export async function updateGenre(id: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const nameEnglish = formData.get("nameEnglish") as string
    const nameArabic = formData.get("nameArabic") as string
    const status = formData.get("status") === "on" || formData.get("status") === "true"

    if (!nameEnglish) {
      return { error: "Name in English is required" }
    }

    const genre = await Genre.findByIdAndUpdate(
      id,
      {
        nameEnglish,
        nameArabic,
        status,
      },
      { new: true },
    )

    if (!genre) {
      return { error: "Genre not found" }
    }

    revalidatePath("/admin/genre")

    return { success: true, data: JSON.parse(JSON.stringify(genre)) }
  } catch (error) {
    console.error("Error updating genre:", error)
    return { error: "Failed to update genre" }
  }
}

export async function deleteGenre(id: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const genre = await Genre.findByIdAndDelete(id)

    if (!genre) {
      return { error: "Genre not found" }
    }

    revalidatePath("/admin/genre")

    return { success: true }
  } catch (error) {
    console.error("Error deleting genre:", error)
    return { error: "Failed to delete genre" }
  }
}

export async function getGenres() {
  try {
    await connectToDatabase()

    const genres = await Genre.find({}).sort({ nameEnglish: 1 })
    return { success: true, data: JSON.parse(JSON.stringify(genres)) }
  } catch (error) {
    console.error("Error fetching genres:", error)
    return { error: "Failed to fetch genres" }
  }
}

export async function getGenre(id: string) {
  try {
    await connectToDatabase()

    const genre = await Genre.findById(id)

    if (!genre) {
      return { error: "Genre not found" }
    }

    return { success: true, data: genre }
  } catch (error) {
    console.error("Error fetching genre:", error)
    return { error: "Failed to fetch genre" }
  }
}

