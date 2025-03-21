import mongoose, { Schema, type Document } from "mongoose"

export interface IMovieRequest extends Document {
  title: string
  description: string
  movie: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  status: string
  adminResponse: string
  createdAt: Date
  updatedAt: Date
}

const MovieRequestSchema = new Schema<IMovieRequest>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    movie: { type : Schema.Types.ObjectId , ref : "Movie" , required : true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminResponse: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.MovieRequest || mongoose.model<IMovieRequest>("MovieRequest", MovieRequestSchema)