import dbConnect from "./mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function initializeDatabase() {
  try {
    await dbConnect()

    // Check if admin user exists
    const adminExists = await User.findOne({ role: "admin" })

    if (!adminExists) {
      console.log("Creating admin user...")

      // Create default admin user
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      })

      console.log("Admin user created successfully")
    }

    // You can add more initialization logic here
    // Such as creating default genres, qualities, etc.
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

