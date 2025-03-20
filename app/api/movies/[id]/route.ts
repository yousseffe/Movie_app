import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Movie from "@/models/Movie"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const movie = await Movie.findById(params.id)
      .populate("genres")
      .populate("director")
      .populate("writers")
      .populate("cast")
      .populate("language")
      .populate("quality")

    if (!movie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: movie })
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch movie" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await req.json()
    const movie = await Movie.findByIdAndUpdate(params.id, data, { new: true })

    if (!movie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: movie })
  } catch (error) {
    console.error("Error updating movie:", error)
    return NextResponse.json({ success: false, error: "Failed to update movie" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const movie = await Movie.findByIdAndDelete(params.id)

    if (!movie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting movie:", error)
    return NextResponse.json({ success: false, error: "Failed to delete movie" }, { status: 500 })
  }
}

