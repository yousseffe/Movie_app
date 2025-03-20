import mongoose, { Schema, type Document } from "mongoose"

export interface ILanguage extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

const LanguageSchema = new Schema<ILanguage>(
  {
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

// Create text index for search
LanguageSchema.index({ name: "text" })

export default mongoose.models.Language || mongoose.model<ILanguage>("Language", LanguageSchema) 