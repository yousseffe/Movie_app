import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getMovie } from "@/app/actions/movie"
import { notFound } from "next/navigation"
import { addToWatchlist } from "@/app/actions/watchlist"
import { getMovies } from "@/app/actions/movie"
import VideoPlayer from "@/components/video-player"

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const result = await getMovie(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const movie = result.data

  // Get related movies (in a real app, you would have a recommendation algorithm)
  const relatedMoviesResult = await getMovies({
    limit: 5,
    status: "published",
  })

  const relatedMovies = relatedMoviesResult.success
    ? relatedMoviesResult.data.filter((m) => m._id !== movie._id).slice(0, 3)
    : []

  return (
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
          <Image
            src={movie.cover || "/placeholder.svg?height=600&width=1200"}
            alt={movie.titleEnglish}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-60" /> */}
        </div>
        <div className="container relative -mt-40 z-10">
          <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-lg border">
                <Image
                  src={movie.poster || "/placeholder.svg?height=600&width=400"}
                  alt={movie.titleEnglish}
                  width={300}
                  height={450}
                  className="h-auto w-full"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {movie.titleEnglish} ({movie.year})
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>{movie.genres.map((g) => g.name).join(", ")}</span>
              </div>
              <p className="text-muted-foreground">{movie.plotEnglish}</p>
              <div className="flex flex-wrap gap-3">
                <form
                  action={async () => {
                    "use server"
                    await addToWatchlist(movie._id)
                  }}
                >
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Watchlist
                  </Button>
                </form>
              </div>
              <div className="pt-4">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-24 font-medium">Budget:</span>
                    <span>{movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container py-12">
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4">
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
          </TabsContent>
          <TabsContent value="videos" className="space-y-4">
            <VideoPlayer
              videos={movie.videos || []}
              movieCover={movie.cover || "/placeholder.svg?height=600&width=1200"}
            />
          </TabsContent>
        </Tabs>

        {/* Related Movies */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Related Movies</h2>
            <Link href="/movies" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedMovies.map((relatedMovie) => (
              <Link key={relatedMovie._id.toString()} href={`/movies/${relatedMovie._id}`}>
                <div className="overflow-hidden rounded-lg transition-all hover:shadow-md">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={relatedMovie.poster || "/placeholder.svg?height=300&width=200"}
                      alt={relatedMovie.titleEnglish}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium line-clamp-1">{relatedMovie.titleEnglish}</h3>
                    <p className="text-sm text-muted-foreground">{relatedMovie.year}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

