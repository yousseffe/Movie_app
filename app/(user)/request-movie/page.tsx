"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { createMovieRequest } from "@/app/actions/movie-request"

const requestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Please provide more details about the movie"),
})

export default function RequestMoviePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof requestSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createMovieRequest(data)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        form.reset()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Request a Movie</h1>
        <p className="text-muted-foreground">
          Can't find the movie you're looking for? Request it here and we'll try to add it to our collection.
        </p>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Your movie request has been submitted successfully! We'll review it and get back to you soon.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Movie Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the movie title" {...field} />
                </FormControl>
                <FormDescription>Please provide the exact title of the movie you're requesting.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about the movie (year, director, actors, etc.)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The more details you provide, the easier it will be for us to find the movie.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

