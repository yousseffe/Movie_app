"use server"

import connectToDatabase from "@/lib/mongodb"
import Watchlist from "@/models/Watchlist"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

export async function addToWatchlist(movieId: string, status: "watchlist" | "watching" | "completed" = "watchlist") {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    // Check if movie is already in watchlist
    const existingItem = await Watchlist.findOne({
      user: session.user.id,
      movie: movieId,
    })

    if (existingItem) {
      // Update status if it exists
      existingItem.status = status
      await existingItem.save()
    } else {
      // Create new watchlist item
      const watchlistItem = new Watchlist({
        user: session.user.id,
        movie: movieId,
        status,
      })

      await watchlistItem.save()
    }

    revalidatePath("/watchlist")

    return { success: true }
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return { error: "Failed to add to watchlist" }
  }
}

export async function removeFromWatchlist(movieId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    await Watchlist.findOneAndDelete({
      user: session.user.id,
      movie: movieId,
    })

    revalidatePath("/watchlist")

    return { success: true }
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return { error: "Failed to remove from watchlist" }
  }
}

export async function updateWatchlistStatus(movieId: string, status: "watchlist" | "watching" | "completed") {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const watchlistItem = await Watchlist.findOne({
      user: session.user.id,
      movie: movieId,
    })

    if (!watchlistItem) {
      return { error: "Movie not found in watchlist" }
    }

    watchlistItem.status = status
    await watchlistItem.save()

    revalidatePath("/watchlist")

    return { success: true }
  } catch (error) {
    console.error("Error updating watchlist status:", error)
    return { error: "Failed to update watchlist status" }
  }
}

export async function getWatchlist() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    const watchlist = await Watchlist.find({ user: session.user.id })
      .populate({
        path: "movie",
        populate: [{ path: "genres" }, { path: "director" }, { path: "language" }, { path: "quality" }],
      })
      .sort({ updatedAt: -1 })

    return { success: true, data: JSON.parse(JSON.stringify(watchlist)) }
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return { error: "Failed to fetch watchlist" }
  }
}

