"use server"

import connectToDatabase from "@/lib/mongodb"
import Movie from "@/models/Movie"

export async function searchMovies(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, data: [] }
    }

    await connectToDatabase()

    const movies = await Movie.find(
      {
        $text: { $search: query },
        status: "published",
      },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .populate("genres")
      .populate("director")
      .populate("language")
      .populate("quality")

    return { success: true, data: JSON.parse(JSON.stringify(movies)) }
  } catch (error) {
    console.error("Error searching movies:", error)
    return { error: "Failed to search movies" }
  }
}



export async function getSearchResults(query: string) {
  try {
    const [moviesResult] = await Promise.all([searchMovies(query)])

    return {
      success: true,
      data: {
        movies: moviesResult.data || [],
      },
    }
  } catch (error) {
    console.error("Error getting search results:", error)
    return { error: "Failed to get search results" }
  }
}
