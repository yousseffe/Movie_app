"use server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getMovies } from "@/app/actions/movie"
import { getGenres } from "@/app/actions/genre"
import { SortSelector } from "@/components/sort-selector"

const ITEMS_PER_PAGE = 12 // Define how many movies to show per page

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get filter options
  const result = await getGenres()
  const genres = result.data
  // Get movies with filters
  const genreFilter = searchParams?.genre as string | string[]
  const yearFilter = searchParams?.year as string
  const searchFilter = searchParams?.search as string
  const sortFilter = (searchParams?.sort as string) || "newest" // Default sort is newest
  const page = Number(searchParams?.page) || 1 // Current page for pagination

  // Process genre filter (handle both single and multiple selections)
  const genreQuery = genreFilter
    ? Array.isArray(genreFilter)
      ? { genre: { $in: genreFilter } }
      : { genre: genreFilter }
    : {}

  // Process year filter (skip if "all" is selected)
  const yearQuery = yearFilter && yearFilter !== "all" ? { year: yearFilter } : {}

  // Process search filter
  const searchQuery = searchFilter ? { search: searchFilter } : {}

  // Process sort filter
  const sortQuery = sortFilter === "oldest" ? { sort: "oldest" } : { sort: "newest" }

  // Get total count for pagination
  const countResult = await getMovies({
    status: "published",
    ...genreQuery,
    ...yearQuery,
    ...searchQuery,
    count: true,
  })

  const totalMovies = countResult.success ? countResult.data : 0

  // Get paginated movies
  const moviesResult = await getMovies({
    status: "published",
    ...genreQuery,
    ...yearQuery,
    ...searchQuery,
    ...sortQuery,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const movies = moviesResult.success ? moviesResult.data : []
  const hasMoreMovies = totalMovies > page * ITEMS_PER_PAGE

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <form action="/movies" method="get">
              <Input
                type="search"
                name="search"
                placeholder="Search movies..."
                className="w-full pl-10 sm:w-[300px]"
                defaultValue={searchFilter || ""}
              />
              {/* Preserve existing filters when searching */}
              {sortFilter && <input type="hidden" name="sort" value={sortFilter} />}
              {yearFilter && yearFilter !== "all" && <input type="hidden" name="year" value={yearFilter} />}
              {genreFilter &&
                Array.isArray(genreFilter) &&
                genreFilter.map((g) => <input key={g} type="hidden" name="genre" value={g} />)}
              {genreFilter && !Array.isArray(genreFilter) && <input type="hidden" name="genre" value={genreFilter} />}
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Filters */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Filter By</h2>
              <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
                <Link href="/movies">
                  <Filter className="h-4 w-4" />
                  <span>Reset</span>
                </Link>
              </Button>
            </div>

            <form action="/movies" method="get" className="mt-4 space-y-4">
              {/* Genre Filter */}
              <div>
                <h3 className="mb-2 font-medium">Genre</h3>
                <div className="space-y-2">
                  {genres.map((genre) => {
                    const genreId = genre._id.toString()
                    const isChecked = Array.isArray(genreFilter)
                      ? genreFilter.includes(genreId)
                      : genreFilter === genreId

                    return (
                      <div key={genreId} className="flex items-center space-x-2">
                        <Checkbox id={`genre-${genreId}`} name="genre" value={genreId} defaultChecked={isChecked} />
                        <Label htmlFor={`genre-${genreId}`} className="text-sm font-normal">
                          {genre.nameEnglish}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="pt-2">
                <h3 className="mb-2 font-medium">Year</h3>
                <Select name="year" defaultValue={yearFilter || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preserve sort when applying filters */}
              {sortFilter && <input type="hidden" name="sort" value={sortFilter} />}

              {/* Preserve search when applying filters */}
              {searchFilter && <input type="hidden" name="search" value={searchFilter} />}

              <Button type="submit" className="w-full mt-4">
                Apply Filters
              </Button>
            </form>
          </div>

          {/* Movies Grid */}
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{movies.length}</span>  results
              </div>
              <form id="sortForm" action="/movies" method="get" className="contents">
                {/* Preserve existing filters when sorting */}
                {searchFilter && <input type="hidden" name="search" value={searchFilter} />}
                {yearFilter && yearFilter !== "all" && <input type="hidden" name="year" value={yearFilter} />}
                {genreFilter &&
                  Array.isArray(genreFilter) &&
                  genreFilter.map((g) => <input key={g} type="hidden" name="genre" value={g} />)}
                {genreFilter && !Array.isArray(genreFilter) && <input type="hidden" name="genre" value={genreFilter} />}
                {page > 1 && <input type="hidden" name="page" value={page.toString()} />}

                {/* Replace the Select component with our Client Component */}
                <SortSelector defaultValue={sortFilter || "newest"} />
              </form>
            </div>

            {movies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No movies found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {movies.map((movie: any) => (
                  <Link key={movie._id.toString()} href={`/movies/${movie._id}`}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={movie.poster || "/placeholder.svg?height=400&width=300"}
                          alt={movie.titleEnglish}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                          {movie.rating || "N/A"}
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium line-clamp-1">{movie.titleEnglish}</h3>
                        <p className="text-sm text-muted-foreground">{movie.year}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {movie.genres.slice(0, 2).map((genre: any) => (
                            <span
                              key={genre._id.toString()}
                              className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]"
                            >
                              {genre.name}
                            </span>
                          ))}
                          {movie.genres.length > 2 && (
                            <span className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                              +{movie.genres.length - 2}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Only show Load More button if there are more movies to load */}
            {hasMoreMovies && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="gap-1" asChild>
                  <Link
                    href={{
                      pathname: "/movies",
                      query: {
                        ...(searchFilter && { search: searchFilter }),
                        ...(sortFilter && { sort: sortFilter }),
                        ...(yearFilter && yearFilter !== "all" && { year: yearFilter }),
                        ...(genreFilter && { genre: genreFilter }),
                        page: page + 1,
                      },
                    }}
                  >
                    Load More
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

