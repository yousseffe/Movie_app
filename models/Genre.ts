import mongoose, { Schema, type Document } from "mongoose"

export interface IGenre extends Document {
  nameEnglish: string
  nameArabic: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}

const GenreSchema = new Schema<IGenre>({
  nameEnglish: { type: String, required: true, unique: true },
  nameArabic: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create text index for search
GenreSchema.index({ nameEnglish: "text", nameArabic: "text" })

export default mongoose.models.Genre || mongoose.model<IGenre>("Genre", GenreSchema)

