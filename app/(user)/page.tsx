import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Plus } from "lucide-react"

export default function HomePage() {
  // Sample featured movie
  const featuredMovie = {
    id: 1,
    title: "Inception",
    year: 2010,
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    image: "/placeholder.svg?height=600&width=1200",
    genres: ["Action", "Sci-Fi", "Thriller"],
  }

  // Sample trending movies
  const trendingMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      year: 2008,
      image: "/placeholder.svg?height=400&width=300",
      rating: 9.0,
    },
    {
      id: 2,
      title: "Parasite",
      year: 2019,
      image: "/placeholder.svg?height=400&width=300",
      rating: 8.6,
    },
    {
      id: 3,
      title: "Pulp Fiction",
      year: 1994,
      image: "/placeholder.svg?height=400&width=300",
      rating: 8.9,
    },
    {
      id: 4,
      title: "The Godfather",
      year: 1972,
      image: "/placeholder.svg?height=400&width=300",
      rating: 9.2,
    },
    {
      id: 5,
      title: "Interstellar",
      year: 2014,
      image: "/placeholder.svg?height=400&width=300",
      rating: 8.6,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src={featuredMovie.image || "/placeholder.svg"}
            alt={featuredMovie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-60" />
          <div className="container relative z-10 flex h-full flex-col justify-end pb-12 pt-24">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {featuredMovie.title} ({featuredMovie.year})
              </h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {featuredMovie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-lg text-muted-foreground">{featuredMovie.description}</p>
              <div className="mt-6 flex gap-4">
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Now
                </Button>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Trending Movies</h2>
          <Link href="/movies" className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trendingMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <Image
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                  {movie.rating}
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1">{movie.title}</h3>
                <p className="text-sm text-muted-foreground">{movie.year}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Genres Section */}
      <section className="bg-muted py-12">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Genre</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {["Action", "Comedy", "Drama", "Thriller", "Sci-Fi", "Horror"].map((genre) => (
              <Link
                key={genre}
                href={`/movies?genre=${genre.toLowerCase()}`}
                className="flex h-24 items-center justify-center rounded-lg bg-card p-4 text-center font-medium shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

