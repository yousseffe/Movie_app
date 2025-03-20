"use server"

import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import MovieRequest from "@/models/MovieRequest"
import User from "@/models/User"

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
    console.log("session", session)
    await connectToDatabase()
    console.log("connected to database")
    const requests = await MovieRequest.find().populate("user").sort({ createdAt: -1 })
    console.log("requests", requests)
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
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const request = await MovieRequest.findById(id)

    if (!request) {
      return { error: "Request not found" }
    }

    // Update the request status and admin response
    request.status = data.status
    request.adminResponse = data.adminResponse
    await request.save()

    // If the request is approved and has a movieId, update the user's permissions
    if (data.status === "approved" && request.movieId) {
      // Find the user
      const user = await User.findById(request.user)

      if (user) {
        // Add the movie to the user's allowedMovies array if it doesn't already exist
        if (!user.allowedMovies) {
          user.allowedMovies = []
        }

        if (!user.allowedMovies.includes(request.movieId)) {
          user.allowedMovies.push(request.movieId)
          await user.save()
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update movie request:", error)
    return { error: "Failed to update request" }
  }
}

export async function requestMovie(movieId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "You must be logged in to request movie access" }
    }

    await connectToDatabase()

    // Check if user already has a pending request for this movie
    const existingRequest = await MovieRequest.findOne({
      user: session.user.id,
      movieId,
      status: "pending",
    })

    if (existingRequest) {
      return { error: "You already have a pending request for this movie" }
    }

    // Check if user already has an approved request for this movie
    const approvedRequest = await MovieRequest.findOne({
      user: session.user.id,
      movieId,
      status: "approved",
    })

    if (approvedRequest) {
      return { error: "You already have access to this movie" }
    }

    const request = new MovieRequest({
      title: "Request for full movie access",
      description: `User has requested access to the full movie with ID: ${movieId}`,
      user: session.user.id,
      movieId,
      status: "pending",
    })

    await request.save()

    return { success: true }
  } catch (error) {
    console.error("Movie request error:", error)
    return { error: "Failed to submit request. Please try again." }
  }
}

export async function checkMovieAccess(movieId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { hasAccess: false }
    }

    await connectToDatabase()

    // Check if the user is an admin (admins have access to all movies)
    if (session.user.role === "admin") {
      return { hasAccess: true }
    }

    // Check if the user has an approved request for this movie
    const user = await User.findById(session.user.id)

    if (!user) {
      return { hasAccess: false }
    }

    // Check if the movie is in the user's allowedMovies array
    const hasAccess = user.allowedMovies && user.allowedMovies.includes(movieId)

    return { hasAccess }
  } catch (error) {
    console.error("Error checking movie access:", error)
    return { hasAccess: false }
  }
}

