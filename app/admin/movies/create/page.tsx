"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, Trash2, Film, LinkIcon } from "lucide-react"
import { createMovie } from "@/app/actions/movie"
import { getGenres } from "@/app/actions/genre"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { log } from "console"

export default function CreateMoviePage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [genres, setGenres] = useState<any[]>([])
  const [videos, setVideos] = useState<
    Array<{
      title: string
      url: string
      file: File | null
      filePreview: string | null
      isTrailer: boolean
    }>
  >([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes] = await Promise.all([getGenres()])
        if (genresRes.success) setGenres(genresRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Poster image must be less than 5MB")
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
        setError("Cover image must be less than 5MB")
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
        setError("Video file must be less than 100MB")
        return
      }
      console.log("file", file)
      const updatedVideos = [...videos]
      updatedVideos[index] = {
        ...updatedVideos[index],
        file,
        url: "", // Clear URL if file is uploaded
      }
      // Set the state with the file first
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add files to formData
      if (posterFile) formData.append("poster", posterFile)
      if (coverFile) formData.append("cover", coverFile)

      // Add arrays as JSON strings
      formData.append("genres", JSON.stringify(formData.getAll("genres")))

      // Process videos - prepare data for server
      const videosData = videos.map((video, index) => {

        // If video has a file, add it to formData with index
        if (video.file) {
          console.log("video.file", video.file)
          formData.append(`videoFile-${index}`, video.file)
          return {
            title: video.title,
            isTrailer: video.isTrailer,
            fileIndex: index,
          }
        } else {
          // Otherwise just use the URL
          return {
            title: video.title,
            url: video.url,
            isTrailer: video.isTrailer,
          }
        }
      })

      formData.append("videos", JSON.stringify(videosData))

      const result = await createMovie(formData)
      console.log("result", result)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/admin/movies")
      }
    } catch (error) {
      setError("Failed to create movie")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Create Movie</h2>
        <Button type="submit" form="create-movie-form" disabled={loading}>
          {loading ? "Creating..." : "Create Movie"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="create-movie-form" onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEnglish">English Name</Label>
              <Input id="titleEnglish" name="titleEnglish" placeholder="Enter English Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleArabic">Arabic Name</Label>
              <Input id="titleArabic" name="titleArabic" placeholder="Enter Arabic Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year of Release</Label>
              <Select name="year" required>
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
                {genres.map((genre) => (
                  <div key={genre._id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`genre-${genre._id}`}
                      name="genres"
                      value={genre._id}
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
              <Input id="budget" name="budget" type="number" placeholder="Enter budget" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" required>
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
                name="plotEnglish"
                placeholder="Enter English Plot"
                className="min-h-[150px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotArabic">Arabic Plot</Label>
              <Textarea
                id="plotArabic"
                name="plotArabic"
                placeholder="Enter Arabic Plot"
                className="min-h-[150px]"
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
                <Button type="button" variant="outline" onClick={addVideo} className="flex items-center gap-1">
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
                            />
                            <Label htmlFor={`is-trailer-${index}`} className="text-sm font-normal">
                              Trailer
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Tabs defaultValue="url" className="w-full">
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
                              disabled={!!video.file}
                              required={!video.file}
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="upload" className="mt-2">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-24 w-40 overflow-hidden rounded-md border bg-muted">
                                {/* {video.filePreview ? (
                                  <div className="h-full w-full flex items-center justify-center bg-black">
                                    <Film className="h-8 w-8 text-white" />
                                    <span className="text-xs text-white ml-2">Video Preview</span>
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )} */}
                                {video.filePreview && (
                                  <video width="200" height="150" controls>
                                    <source src={video.filePreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </div>
                              <div>
                                <Input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoUpload(index, e)}
                                  className="hidden"
                                  id={`video-upload-${index}`}
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

