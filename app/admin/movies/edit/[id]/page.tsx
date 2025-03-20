"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, Trash2, LinkIcon, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getMovie, updateMovie } from "@/app/actions/movie"
import { getGenres } from "@/app/actions/genre"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function EditMoviePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [genresList, setGenresList] = useState<any[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const { id } = useParams()
  // Form state
  const [titleEnglish, setTitleEnglish] = useState("")
  const [titleArabic, setTitleArabic] = useState("")
  const [year, setYear] = useState("")
  const [budget, setBudget] = useState("")
  const [plotEnglish, setPlotEnglish] = useState("")
  const [plotArabic, setPlotArabic] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")

  // Video state
  const [videos, setVideos] = useState<
    Array<{
      _id?: string
      title: string
      url: string
      file: File | null
      filePreview: string | null
      isTrailer: boolean
    }>
  >([])

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch movie data
        const movieResult = await getMovie(id)
        if (!movieResult.success) {
          setError(movieResult.error || "Failed to fetch movie")
          return
        }

        const movie = movieResult.data
        setTitleEnglish(movie.titleEnglish || "")
        setTitleArabic(movie.titleArabic || "")
        setYear(movie.year?.toString() || "")
        setBudget(movie.budget?.toString() || "")
        setPlotEnglish(movie.plotEnglish || "")
        setPlotArabic(movie.plotArabic || "")
        setStatus(movie.status || "draft")
        setPosterPreview(movie.poster || null)
        setCoverPreview(movie.cover || null)

        // Set selected genres
        if (movie.genres && Array.isArray(movie.genres)) {
          setSelectedGenres(movie.genres.map((g: any) => g._id || g))
        }

        // Format videos
        if (movie.videos && Array.isArray(movie.videos)) {
          setVideos(
            movie.videos.map((video: any) => ({
              _id: video._id,
              title: video.title || "",
              url: video.url || "",
              file: null,
              filePreview: null,
              isTrailer: video.isTrailer || false,
            })),
          )
        }

        // Fetch genres
        const genresResult = await getGenres()
        if (genresResult.success) {
          setGenresList(genresResult.data)
        }
      } catch (error) {
        setError("Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Poster image must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setPosterFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPosterPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Cover image must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Video file must be less than 100MB",
          variant: "destructive",
        })
        return
      }

      const updatedVideos = [...videos]
      updatedVideos[index] = {
        ...updatedVideos[index],
        file,
        url: "", // Clear URL if file is uploaded
      }

      setVideos(updatedVideos)

      const reader = new FileReader()
      reader.onload = (e) => {
        setVideos((currentVideos) => {
          const newVideos = [...currentVideos]
          newVideos[index] = {
            ...newVideos[index],
            filePreview: e.target?.result as string,
          }
          return newVideos
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addVideo = () => {
    setVideos([
      ...videos,
      {
        title: "",
        url: "",
        file: null,
        filePreview: null,
        isTrailer: false,
      },
    ])
  }

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index))
  }

  const updateVideo = (index: number, field: string, value: string | boolean) => {
    const updatedVideos = [...videos]
    updatedVideos[index] = { ...updatedVideos[index], [field]: value }

    // If updating URL, clear file
    if (field === "url" && value) {
      updatedVideos[index].file = null
      updatedVideos[index].filePreview = null
    }

    setVideos(updatedVideos)
  }

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      // Add basic information
      formData.append("titleEnglish", titleEnglish)
      formData.append("titleArabic", titleArabic)
      formData.append("year", year)
      formData.append("budget", budget)
      formData.append("plotEnglish", plotEnglish)
      formData.append("plotArabic", plotArabic)
      formData.append("status", status)

      // Add genres
      formData.append("genres", JSON.stringify(selectedGenres))

      // Add files if they exist
      if (posterFile) formData.append("poster", posterFile)
      if (coverFile) formData.append("cover", coverFile)

      // Process videos
      const videosData = videos.map((video, index) => {
        // If video has a file, add it to formData with index
        if (video.file) {
          formData.append(`videoFile-${index}`, video.file)
          return {
            _id: video._id, // Keep original ID if it exists
            title: video.title,
            isTrailer: video.isTrailer,
            fileIndex: index,
          }
        } else {
          // Otherwise just use the URL
          return {
            _id: video._id, // Keep original ID if it exists
            title: video.title,
            url: video.url,
            isTrailer: video.isTrailer,
          }
        }
      })

      formData.append("videos", JSON.stringify(videosData))

      const result = await updateMovie(id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Movie has been updated successfully.",
        })
        router.push("/admin/movies")
      } else {
        setError(result.error || "Failed to update movie")
      }
    } catch (error) {
      setError("Failed to update movie")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !titleEnglish) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/movies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Movie: {titleEnglish}</h2>
        <Button className="ml-auto" type="submit" form="edit-movie-form" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="edit-movie-form" className="space-y-8" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEnglish">English Name</Label>
              <Input
                id="titleEnglish"
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
                placeholder="Enter English Name"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleArabic">Arabic Name</Label>
              <Input
                id="titleArabic"
                value={titleArabic}
                onChange={(e) => setTitleArabic(e.target.value)}
                placeholder="Enter Arabic Name"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year of Release</Label>
              <Select value={year} onValueChange={setYear} disabled={isLoading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genres">Genres</Label>
              <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                {genresList.map((genre) => (
                  <div key={genre._id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`genre-${genre._id}`}
                      checked={selectedGenres.includes(genre._id)}
                      onChange={() => toggleGenre(genre._id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`genre-${genre._id}`} className="text-sm font-normal">
                      {genre.nameEnglish}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter Budget"
                type="number"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "published") => setStatus(value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plot & Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plotEnglish">English Plot</Label>
              <Textarea
                id="plotEnglish"
                value={plotEnglish}
                onChange={(e) => setPlotEnglish(e.target.value)}
                placeholder="Enter English Plot"
                className="min-h-[150px]"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotArabic">Arabic Plot</Label>
              <Textarea
                id="plotArabic"
                value={plotArabic}
                onChange={(e) => setPlotArabic(e.target.value)}
                placeholder="Enter Arabic Plot"
                className="min-h-[150px]"
                disabled={isLoading}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label>Poster</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-40 w-32 overflow-hidden rounded-md border bg-muted">
                  {posterPreview ? (
                    <img
                      src={posterPreview || "/placeholder.svg"}
                      alt="Poster preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                    id="poster-upload"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="poster-upload"
                    className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Browse
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Cover</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-40 w-32 overflow-hidden rounded-md border bg-muted">
                  {coverPreview ? (
                    <img
                      src={coverPreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-upload"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="cover-upload"
                    className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Browse
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Movie Videos</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVideo}
                  className="flex items-center gap-1"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" /> Add Video
                </Button>
              </div>

              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div key={index} className="p-4 border rounded-md relative">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`video-title-${index}`}>Title</Label>
                        <Input
                          id={`video-title-${index}`}
                          value={video.title}
                          onChange={(e) => updateVideo(index, "title", e.target.value)}
                          placeholder="Enter video title"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 h-9 mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`is-trailer-${index}`}
                              checked={video.isTrailer}
                              onChange={(e) => updateVideo(index, "isTrailer", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                              disabled={isLoading}
                            />
                            <Label htmlFor={`is-trailer-${index}`} className="text-sm font-normal">
                              Trailer
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Tabs defaultValue={video.url ? "url" : "upload"} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="url" className="flex items-center gap-1">
                            <LinkIcon className="h-4 w-4" /> URL
                          </TabsTrigger>
                          <TabsTrigger value="upload" className="flex items-center gap-1">
                            <Upload className="h-4 w-4" /> Upload
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="url" className="mt-2">
                          <div className="space-y-2">
                            <Label htmlFor={`video-url-${index}`}>Video URL</Label>
                            <Input
                              id={`video-url-${index}`}
                              value={video.url}
                              onChange={(e) => updateVideo(index, "url", e.target.value)}
                              placeholder="Enter video URL"
                              disabled={isLoading || !!video.file}
                              required={!video.file}
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="upload" className="mt-2">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-24 w-40 overflow-hidden rounded-md border bg-muted">
                                {video.filePreview ? (
                                  <video width="200" height="150" controls>
                                    <source src={video.filePreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <Input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoUpload(index, e)}
                                  className="hidden"
                                  id={`video-upload-${index}`}
                                  disabled={isLoading}
                                />
                                <Label
                                  htmlFor={`video-upload-${index}`}
                                  className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                  Browse
                                </Label>
                                {video.file && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {video.file.name} ({(video.file.size / (1024 * 1024)).toFixed(2)} MB)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVideo(index)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {videos.length === 0 && (
                  <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                    No videos added. Click "Add Video" to add movie videos.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

