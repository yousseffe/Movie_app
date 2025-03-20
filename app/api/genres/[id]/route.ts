import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Genre from "@/models/Genre"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const genre = await Genre.findById(params.id)

    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 })
    }

    return NextResponse.json(genre)
  } catch (error) {
    console.error("Error fetching genre:", error)
    return NextResponse.json({ error: "Failed to fetch genre" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()

    const genre = await Genre.findByIdAndUpdate(params.id, data, { new: true })

    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 })
    }

    return NextResponse.json(genre)
  } catch (error) {
    console.error("Error updating genre:", error)
    return NextResponse.json({ error: "Failed to update genre" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const genre = await Genre.findByIdAndDelete(params.id)

    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Genre deleted successfully" })
  } catch (error) {
    console.error("Error deleting genre:", error)
    return NextResponse.json({ error: "Failed to delete genre" }, { status: 500 })
  }
}

