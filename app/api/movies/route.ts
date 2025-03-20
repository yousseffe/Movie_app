import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Movie from "@/models/Movie"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const limit = url.searchParams.get("limit") ? Number.parseInt(url.searchParams.get("limit")!) : undefined
    const status = url.searchParams.get("status") || "published"
    const genre = url.searchParams.get("genre")
    const search = url.searchParams.get("search")
    const language = url.searchParams.get("language")
    const quality = url.searchParams.get("quality")
    const year = url.searchParams.get("year")

    // Build query
    const query: any = {}

    // For public routes, only show published movies
    if (!url.pathname.includes("/admin")) {
      query.status = "published"
    } else if (status) {
      query.status = status
    }

    if (genre) {
      query.genres = genre
    }

    if (language) {
      query.language = language
    }

    if (quality) {
      query.quality = quality
    }

    if (year) {
      query.year = Number.parseInt(year)
    }

    if (search) {
      query.$text = { $search: search }
    }

    let moviesQuery = Movie.find(query)
      .populate("genres")
      .populate("director")
      .populate("language")
      .populate("quality")
      .sort({ createdAt: -1 })

    if (limit) {
      moviesQuery = moviesQuery.limit(limit)
    }

    const movies = await moviesQuery

    return NextResponse.json({ success: true, data: movies })
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch movies" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await req.json()
    const movie = new Movie(data)
    await movie.save()

    return NextResponse.json({ success: true, data: movie })
  } catch (error) {
    console.error("Error creating movie:", error)
    return NextResponse.json({ success: false, error: "Failed to create movie" }, { status: 500 })
  }
}

