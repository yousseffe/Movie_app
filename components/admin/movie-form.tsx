"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, Trash } from "lucide-react"
import { createMovie, updateMovie } from "@/app/actions/movie"
import { uploadImage } from "@/lib/cloudinary"
import { useToast } from "@/hooks/use-toast"

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  releaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  rating: z.number().min(0).max(10, "Rating must be between 0 and 10"),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  language: z.string().min(1, "Language is required"),
  director: z.string().min(1, "Director is required"),
  cast: z.string().min(1, "Cast is required"),
  trailer: z.string().url("Trailer must be a valid URL").optional().or(z.literal("")),
  videos: z
    .array(
      z.object({
        title: z.string().min(1, "Video title is required"),
        url: z.string().url("Video URL must be a valid URL"),
        isTrailer: z.boolean().default(false),
      }),
    )
    .optional(),
})

type MovieFormValues = z.infer<typeof movieSchema>

interface MovieFormProps {
  movie?: any
  genres: any[]
  languages: any[]
}

export function MovieForm({ movie, genres, languages }: MovieFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [backdropFile, setBackdropFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>(movie?.poster || "")
  const [backdropPreview, setBackdropPreview] = useState<string>(movie?.backdrop || "")
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: movie
      ? {
          ...movie,
          releaseDate: new Date(movie.releaseDate).toISOString().split("T")[0],
          genres: movie.genres.map((g: any) => g._id || g),
          language: movie.language._id || movie.language,
          videos: movie.videos || [],
        }
      : {
          title: "",
          description: "",
          releaseDate: "",
          duration: 90,
          rating: 0,
          genres: [],
          language: "",
          director: "",
          cast: "",
          trailer: "",
          videos: [],
        },
  })

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control: form.control,
    name: "videos",
  })

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPosterFile(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  const handleBackdropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBackdropFile(file)
      setBackdropPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: MovieFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      let posterUrl = posterPreview
      let backdropUrl = backdropPreview

      if (posterFile) {
        const result = await uploadImage(posterFile)
        if (result.error) {
          throw new Error(result.error)
        }
        posterUrl = result.url
      }

      if (backdropFile) {
        const result = await uploadImage(backdropFile)
        if (result.error) {
          throw new Error(result.error)
        }
        backdropUrl = result.url
      }

      const movieData = {
        ...data,
        poster: posterUrl,
        backdrop: backdropUrl,
      }

      if (movie) {
        await updateMovie(movie._id, movieData)
        toast({
          title: "Movie updated",
          description: "The movie has been successfully updated.",
        })
      } else {
        await createMovie(movieData)
        toast({
          title: "Movie created",
          description: "The new movie has been successfully created.",
        })
      }

      router.push("/admin/movies")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the movie")
      toast({
        title: "Error",
        description: "Failed to save the movie. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Movie title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Movie description" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-10)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Director</FormLabel>
                <FormControl>
                  <Input placeholder="Movie director" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cast"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cast</FormLabel>
                <FormControl>
                  <Input placeholder="Main actors (comma separated)" {...field} />
                </FormControl>
                <FormDescription>Enter the main actors separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language._id} value={language._id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genres"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Genres</FormLabel>
                </div>
                <div className="space-y-2">
                  {genres.map((genre) => (
                    <FormField
                      key={genre._id}
                      control={form.control}
                      name="genres"
                      render={({ field }) => {
                        return (
                          <FormItem key={genre._id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(genre._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, genre._id])
                                    : field.onChange(field.value?.filter((value) => value !== genre._id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{genre.name}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="trailer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trailer URL</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/..." {...field} />
              </FormControl>
              <FormDescription>Enter the YouTube or other video platform URL for the trailer</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Poster Image</h3>
            <div className="mt-2 flex items-center gap-4">
              {posterPreview && (
                <div className="relative h-40 w-28 overflow-hidden rounded-md border">
                  <img
                    src={posterPreview || "/placeholder.svg"}
                    alt="Poster preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handlePosterChange} className="max-w-sm" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Backdrop Image</h3>
            <div className="mt-2 flex items-center gap-4">
              {backdropPreview && (
                <div className="relative h-28 w-48 overflow-hidden rounded-md border">
                  <img
                    src={backdropPreview || "/placeholder.svg"}
                    alt="Backdrop preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleBackdropChange} className="max-w-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Videos</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendVideo({ title: "", url: "", isTrailer: false })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </div>

          {videoFields.map((field, index) => (
            <div key={field.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Video {index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVideo(index)}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`videos.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Video title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`videos.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`videos.${index}.isTrailer`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>This is a trailer (visible to all users)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : movie ? (
            "Update Movie"
          ) : (
            "Create Movie"
          )}
        </Button>
      </form>
    </Form>
  )
}

