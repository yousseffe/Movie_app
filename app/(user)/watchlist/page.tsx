"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Plus, Trash2, Clock, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getWatchlist, removeFromWatchlist, updateWatchlistStatus } from "@/app/actions/watchlist"

export default function WatchlistPage() {
  const { toast } = useToast()
  const [watchlist, setWatchlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true)
      const result = await getWatchlist()
      if (result.success) {
        setWatchlist(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load watchlist",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }

    fetchWatchlist()
  }, [toast])

  const handleRemove = async (id) => {
    const result = await removeFromWatchlist(id)
    if (result.success) {
      setWatchlist(watchlist.filter((item) => item.movie._id !== id))
      toast({
        title: "Removed from watchlist",
        description: "The movie has been removed from your watchlist.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to remove from watchlist",
        variant: "destructive",
      })
    }
  }

  const handleChangeStatus = async (id, status) => {
    const result = await updateWatchlistStatus(id, status)
    if (result.success) {
      setWatchlist(watchlist.map((item) => (item.movie._id === id ? { ...item, status } : item)))
      toast({
        title: "Status updated",
        description: `The movie has been moved to ${status}.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const getItemsByStatus = (status) => {
    return watchlist.filter((item) => item.status === status)
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Watchlist</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({watchlist.length})</TabsTrigger>
            <TabsTrigger value="watchlist">Want to Watch ({getItemsByStatus("watchlist").length})</TabsTrigger>
            <TabsTrigger value="watching">Currently Watching ({getItemsByStatus("watching").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({getItemsByStatus("completed").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Plus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Your watchlist is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start adding movies to your watchlist to keep track of what you want to watch.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/movies">Browse Movies</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {watchlist.map((item) => (
                  <WatchlistCard
                    key={item._id}
                    item={item}
                    onRemove={handleRemove}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist">
            {getItemsByStatus("watchlist").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Plus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No movies in this category</h3>
                <p className="mt-2 text-sm text-muted-foreground">Add movies to your "Want to Watch" list.</p>
                <Button className="mt-4" asChild>
                  <Link href="/movies">Browse Movies</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {getItemsByStatus("watchlist").map((item) => (
                  <WatchlistCard
                    key={item._id}
                    item={item}
                    onRemove={handleRemove}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watching">
            {getItemsByStatus("watching").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No movies in this category</h3>
                <p className="mt-2 text-sm text-muted-foreground">Move movies to your "Currently Watching" list.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {getItemsByStatus("watching").map((item) => (
                  <WatchlistCard
                    key={item._id}
                    item={item}
                    onRemove={handleRemove}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {getItemsByStatus("completed").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Check className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No movies in this category</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Mark movies as "Completed" when you finish watching them.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {getItemsByStatus("completed").map((item) => (
                  <WatchlistCard
                    key={item._id}
                    item={item}
                    onRemove={handleRemove}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function WatchlistCard({ item, onRemove, onChangeStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const movie = item.movie

  return (
    <Card className="overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="space-y-2">
            <Button size="sm" className="w-full gap-1" asChild>
              <Link href={`/movies/${movie._id}`}>
                <Play className="h-4 w-4" /> Watch Now
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                Status
              </Button>
              <Button size="sm" variant="destructive" className="aspect-square p-0" onClick={() => onRemove(movie._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {isMenuOpen && (
              <div className="bg-card rounded-md border shadow-md p-1 space-y-1">
                <Button
                  size="sm"
                  variant={item.status === "watchlist" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onChangeStatus(movie._id, "watchlist")
                    setIsMenuOpen(false)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Want to Watch
                </Button>
                <Button
                  size="sm"
                  variant={item.status === "watching" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onChangeStatus(movie._id, "watching")
                    setIsMenuOpen(false)
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" /> Currently Watching
                </Button>
                <Button
                  size="sm"
                  variant={item.status === "completed" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onChangeStatus(movie._id, "completed")
                    setIsMenuOpen(false)
                  }}
                >
                  <Check className="h-4 w-4 mr-2" /> Completed
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-1">{movie.titleEnglish}</h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{movie.year}</p>
          <div className="text-xs px-2 py-0.5 rounded-full bg-muted">
            {item.status === "watchlist" && "Want to Watch"}
            {item.status === "watching" && "Watching"}
            {item.status === "completed" && "Completed"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

