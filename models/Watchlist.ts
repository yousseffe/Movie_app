import mongoose, { Schema, type Document } from "mongoose"

export interface IWatchlistItem extends Document {
  user: mongoose.Types.ObjectId
  movie: mongoose.Types.ObjectId
  status: "want_to_watch" | "watching" | "watched" | "dropped"
  addedAt: Date
  updatedAt: Date
}

const WatchlistSchema = new Schema<IWatchlistItem>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  status: {
    type: String,
    enum: ["want_to_watch", "watching", "watched", "dropped"],
    default: "want_to_watch",
  },
  addedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create a compound index to ensure a user can only have a movie once in their watchlist
WatchlistSchema.index({ user: 1, movie: 1 }, { unique: true })

export default mongoose.models.Watchlist || mongoose.model<IWatchlistItem>("Watchlist", WatchlistSchema)

