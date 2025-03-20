import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export default async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached database connection")
    return cached.conn
  }

  if (!cached.promise) {
    console.log("Connecting to MongoDB...")
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    throw e
  }

  return cached.conn
}

