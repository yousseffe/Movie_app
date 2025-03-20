"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface VideoPlayerProps {
  videos: any[]
  movieCover: string
}

export default function VideoPlayer({ videos, movieCover }: VideoPlayerProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const getVideoType = (url: string) => {
    if (!url) return { type: "unknown", id: null, embedUrl: null, platform: "unknown" }

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch && youtubeMatch[1]) {
      return {
        type: "embed",
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
        platform: "youtube",
      }
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: "embed",
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        platform: "vimeo",
      }
    }

    // Dailymotion
    const dailymotionRegex = /(?:dailymotion\.com\/(?:video\/|embed\/video\/)|dai\.ly\/)([a-zA-Z0-9]+)/
    const dailymotionMatch = url.match(dailymotionRegex)
    if (dailymotionMatch && dailymotionMatch[1]) {
      return {
        type: "embed",
        id: dailymotionMatch[1],
        embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`,
        platform: "dailymotion",
      }
    }

    // Facebook Video
    const facebookRegex = /facebook\.com\/(?:watch\/\?v=|[^/]+\/videos\/)(\d+)/
    const facebookMatch = url.match(facebookRegex)
    if (facebookMatch && facebookMatch[1]) {
      return {
        type: "embed",
        id: facebookMatch[1],
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`,
        platform: "facebook",
      }
    }

    // Check if it's a direct video file
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".wmv", ".flv", ".mkv"]
    const isDirectVideo = videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))

    if (isDirectVideo) {
      return { type: "direct", id: null, embedUrl: null, platform: "direct" }
    }

    // For other URLs, try to embed them directly if they seem like they might be videos
    if (url.includes("player") || url.includes("embed") || url.includes("video")) {
      return { type: "embed", id: null, embedUrl: url, platform: "other" }
    }

    // Default fallback - try direct video
    return { type: "direct", id: null, embedUrl: null, platform: "unknown" }
  }

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case "youtube":
        return "YouTube"
      case "vimeo":
        return "Vimeo"
      case "dailymotion":
        return "Dailymotion"
      case "facebook":
        return "Facebook"
      case "direct":
        return "Direct Video"
      case "other":
        return "External Video"
      default:
        return "Video"
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "youtube":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "vimeo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "dailymotion":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
      case "facebook":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "direct":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="space-y-4">
      {activeVideo && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            {getVideoType(activeVideo).type === "embed" ? (
              <iframe
                src={getVideoType(activeVideo).embedUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            ) : (
              <video
                src={activeVideo}
                controls
                className="w-full h-full"
                poster={movieCover || "/placeholder.svg?height=600&width=1200"}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-2">Videos</h3>
        <div className="space-y-4">
          {videos && videos.length > 0 ? (
            videos.map((video) => {
              const videoInfo = getVideoType(video.url)
              return (
                <div key={video._id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <h4 className="font-medium">{video.title}</h4>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{video.url}</p>
                    <div className="flex gap-2 mt-1">
                      {video.isTrailer && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          Trailer
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPlatformColor(videoInfo.platform)}`}
                      >
                        {getPlatformLabel(videoInfo.platform)}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveVideo(video.url)}>
                    <Play className="h-4 w-4 mr-2" /> Preview
                  </Button>
                </div>
              )
            })
          ) : (
            <p className="text-muted-foreground">No videos available</p>
          )}
        </div>
      </div>
    </div>
  )
}

