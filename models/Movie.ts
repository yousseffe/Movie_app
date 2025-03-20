import mongoose, { Schema, type Document } from "mongoose"

export interface IMovie extends Document {
  titleEnglish: string
  titleArabic: string
  year: number
  budget?: number
  plotEnglish: string
  plotArabic: string
  genres: mongoose.Types.ObjectId[]
  poster?: string
  cover?: string
  videos:Array<{
    url:string,
    quality:string,
    type:string
  }>
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
}

const MovieSchema = new Schema<IMovie>({
  titleEnglish: { type: String, required: true },
  titleArabic: { type: String, required: true },
  year: { type: Number, required: true },
  budget: { type: Number },
  plotEnglish: { type: String, required: true },
  plotArabic: { type: String, required: true },
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  poster: { type: String },
  cover: { type: String },
  videos: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      isTrailer: { type: Boolean, default: false },
    },
  ],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create text index for search
MovieSchema.index({ titleEnglish: "text", titleArabic: "text", plotEnglish: "text", plotArabic: "text" })

export default mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema)

