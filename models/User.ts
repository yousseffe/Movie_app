import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "user"
  isVerified: boolean
  verificationToken: string
  verificationTokenExpiry: Date
  resetPasswordToken: string
  resetPasswordTokenExpiry: Date
  createdAt: Date
  updatedAt: Date
  profilePicture: string
  watchlist: mongoose.Types.ObjectId[]
  allowedMovies: string[] // Add this field to track which movies the user has access to
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  profilePicture: { type: String, default: "" },
  watchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  allowedMovies: [{ type: String }], 
})

// Create text index for search
UserSchema.index({ name: "text", email: "text" })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

