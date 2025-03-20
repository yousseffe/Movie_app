"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Film, User, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { searchMovies } from "@/app/actions/search"

export function SearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const [people, setPeople] = useState([])
  const [activeTab, setActiveTab] = useState("movies")

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setMovies([])
        setPeople([])
        return
      }

      setIsLoading(true)

      if (activeTab === "movies" || activeTab === "all") {
        const moviesResult = await searchMovies(query)
        if (moviesResult.success) {
          setMovies(moviesResult.data)
        }
      }

      // if (activeTab === "people" || activeTab === "all") {
      //   const peopleResult = await searchPeople(query)
      //   if (peopleResult.success) {
      //     setPeople(peopleResult.data)
      //   }
      // }

      setIsLoading(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query, activeTab])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for movies, actors, directors..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <Tabs defaultValue="movies" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="movies" className="flex-1">
                Movies
              </TabsTrigger>
              {/* <TabsTrigger value="people" className="flex-1">
                People
              </TabsTrigger>
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger> */}
            </TabsList>

            <div className="mt-4 relative min-h-[300px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              <TabsContent value="movies" className="space-y-4">
                {movies.length === 0 ? (
                  <div className="text-center py-8">
                    <Film className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      {query.length < 2 ? "Type to search for movies" : "No movies found"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {movies.map((movie) => (
                      <Link
                        key={movie._id}
                        href={`/movies/${movie._id}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted"
                      >
                        <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={movie.poster || "/placeholder.svg?height=64&width=48"}
                            alt={movie.titleEnglish}
                            width={48}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{movie.titleEnglish}</h4>
                          <p className="text-sm text-muted-foreground">{movie.year}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {movie.genres.slice(0, 3).map((genre) => (
                              <span
                                key={genre._id}
                                className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* <TabsContent value="people" className="space-y-4">
                {people.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      {query.length < 2 ? "Type to search for people" : "No people found"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {people.map((person) => (
                      <Link
                        key={person._id}
                        href={`/people/${person._id}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={person.photo || "/placeholder.svg?height=64&width=64"}
                            alt={person.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{person.name}</h4>
                          <p className="text-sm text-muted-foreground">{person.role || "Actor"}</p>
                          {person.bio && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{person.bio}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-6">
                {movies.length === 0 && people.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      {query.length < 2 ? "Type to search" : "No results found"}
                    </p>
                  </div>
                ) : (
                  <>
                    {movies.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Movies</h3>
                          {movies.length > 3 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0"
                              onClick={() => setActiveTab("movies")}
                            >
                              View all
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4">
                          {movies.slice(0, 3).map((movie) => (
                            <Link
                              key={movie._id}
                              href={`/movies/${movie._id}`}
                              onClick={() => onOpenChange(false)}
                              className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted"
                            >
                              <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={movie.poster || "/placeholder.svg?height=64&width=48"}
                                  alt={movie.titleEnglish}
                                  width={48}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{movie.titleEnglish}</h4>
                                <p className="text-sm text-muted-foreground">{movie.year}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {people.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">People</h3>
                          {people.length > 3 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0"
                              onClick={() => setActiveTab("people")}
                            >
                              View all
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4">
                          {people.slice(0, 3).map((person) => (
                            <Link
                              key={person._id}
                              href={`/people/${person._id}`}
                              onClick={() => onOpenChange(false)}
                              className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted"
                            >
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                                <Image
                                  src={person.photo || "/placeholder.svg?height=64&width=64"}
                                  alt={person.name}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{person.name}</h4>
                                <p className="text-sm text-muted-foreground">{person.role || "Actor"}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent> */}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

