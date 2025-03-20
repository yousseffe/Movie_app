"use client"
import { getMovie } from "@/app/actions/movie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pencil, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function MovieDetailsPage() {
  const [movie, setMovie] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const result = await getMovie(id)
        if (result.success) {
          setMovie(result.data)
          // Set the first video as active if available
          if (result.data?.videos?.length > 0) {
            setActiveVideo(result.data.videos[0].url)
          }
        } else {
          setError(result.error || "Failed to fetch movie")
        }
      } catch (error) {
        setError("Failed to fetch movie")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const formatBudget = (budget: number) => {
    if (!budget) return "N/A"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(budget)
  }

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
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      ) : !movie ? (
        <div className="p-4 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-md">
          <p>No movie found.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/movies">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">{movie.titleEnglish}</h2>
            <div className="ml-2">
              <span className="text-xl text-muted-foreground font-medium">{movie.titleArabic}</span>
            </div>
            <Button className="ml-auto" asChild>
              <Link href={`/admin/movies/edit/${movie._id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative h-80 w-60 overflow-hidden rounded-md">
                      <Image
                        src={movie.poster || "/placeholder.svg?height=600&width=400"}
                        alt={movie.titleEnglish}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-bold">{movie.titleEnglish}</h3>
                      <p className="text-muted-foreground">{movie.year}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Movie Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                      <dd>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            movie.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {movie.status?.charAt(0).toUpperCase() + movie.status?.slice(1) || "N/A"}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                      <dd>{movie.year || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
                      <dd>{formatBudget(movie.budget)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                      <dd>{formatDate(movie.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                      <dd>{formatDate(movie.updatedAt)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <Image
                      src={movie.cover || "/placeholder.svg?height=600&width=1200"}
                      alt={movie.titleEnglish}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Movie Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {movie.genres && movie.genres.length > 0 ? (
                            movie.genres.map((genre, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold"
                              >
                                {genre.nameEnglish || genre}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground">No genres specified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">English Plot</h3>
                        <p className="text-muted-foreground">{movie.plotEnglish || "No plot available"}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Arabic Plot</h3>
                        <p className="text-muted-foreground">{movie.plotArabic || "No plot available"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media">
                  <Card>
                    <CardHeader>
                      <CardTitle>Media</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                poster={movie.cover || "/placeholder.svg?height=600&width=1200"}
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
                          {movie.videos && movie.videos.length > 0 ? (
                            movie.videos.map((video) => {
                              const videoInfo = getVideoType(video.url)
                              return (
                                <div
                                  key={video._id}
                                  className="flex items-center justify-between rounded-md border p-4"
                                >
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
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

