"use server"

import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import MovieRequest from "@/models/MovieRequest"

const requestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Please provide more details about the movie"),
})

export async function createMovieRequest(data: z.infer<typeof requestSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "You must be logged in to request a movie" }
    }

    const validatedData = requestSchema.parse(data)

    await connectToDatabase()

    const request = new MovieRequest({
      title: validatedData.title,
      description: validatedData.description,
      user: session.user.id,
    })

    await request.save()

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    console.error("Movie request error:", error)
    return { error: "Failed to submit request. Please try again." }
  }
}

export async function getMovieRequests() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const requests = await MovieRequest.find().populate("user", "name email").sort({ createdAt: -1 })

    return requests
  } catch (error) {
    console.error("Failed to fetch movie requests:", error)
    return []
  }
}

export async function updateMovieRequest(id: string, data: { status: string; adminResponse: string }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const request = await MovieRequest.findByIdAndUpdate(
      id,
      {
        status: data.status,
        adminResponse: data.adminResponse,
      },
      { new: true },
    )

    if (!request) {
      throw new Error("Request not found")
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update movie request:", error)
    throw error
  }
}

export async function requestMovie(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "You must be logged in to request a movie" }
    }

    const movieId = formData.get("movieId") as string

    await connectToDatabase()

    const request = new MovieRequest({
      title: "Request for full movie access",
      description: `User has requested access to the full movie with ID: ${movieId}`,
      user: session.user.id,
      movieId,
    })

    await request.save()

    return { success: true }
  } catch (error) {
    console.error("Movie request error:", error)
    return { error: "Failed to submit request. Please try again." }
  }
}

