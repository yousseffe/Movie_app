import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Genre from "@/models/Genre"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const genres = await Genre.find({}).sort({ nameEnglish: 1 })

    return NextResponse.json(genres)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await req.json()

    const genre = new Genre(data)
    await genre.save()

    return NextResponse.json(genre, { status: 201 })
  } catch (error: any) {
    console.error("Error creating genre:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Genre already exists" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create genre" }, { status: 500 })
  }
}

