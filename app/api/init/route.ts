import { NextResponse } from "next/server"
import  connectToDatabase  from "@/lib/mongodb"
import User from "@/models/User"
import Genre from "@/models/Genre"
import Language from "@/models/Language"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    await connectToDatabase()

    // Check if admin user exists
    const adminExists = await User.findOne({ role: "admin" })

    if (!adminExists) {
      // Create admin user
      const hashedPassword = await hash("admin123", 10)
      const admin = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      })
      await admin.save()

      // Create some initial genres
      const genres = [
        {
          nameEnglish: "Action",
          nameArabic: "أكشن",
          status: true,
        },
        {
          nameEnglish: "Comedy",
          nameArabic: "كوميدي",
          status: true,
        },
        {
          nameEnglish: "Drama",
          nameArabic: "دراما",
          status: true,
        },
        {
          nameEnglish: "Horror",
          nameArabic: "رعب",
          status: true,
        },
        {
          nameEnglish: "Science Fiction",
          nameArabic: "خيال علمي",
          status: true,
        },
      ]

      await Genre.insertMany(genres)

      // Create some initial languages
      const languages = [
        { name: "English", code: "en" },
        { name: "Spanish", code: "es" },
        { name: "French", code: "fr" },
        { name: "German", code: "de" },
        { name: "Japanese", code: "ja" },
      ]

      await Language.insertMany(languages)

      return NextResponse.json({
        success: true,
        message: "Database initialized with admin user, genres, and languages",
        adminEmail: "admin@example.com",
        adminPassword: "admin123",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database already initialized",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
  }
}

