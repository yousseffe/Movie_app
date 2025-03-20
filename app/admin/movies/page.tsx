"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { getMovies, deleteMovie, getMovies2 } from "@/app/actions/movie"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { IMovie } from "@/models/Movie" // Import the movie type

export default function MoviesPage() {
  const [movies, setMovies] = useState<IMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await getMovies2()
        if (result.success) {
          setMovies(result.data)
        } else {
          setError(result.error || "Failed to fetch movies")
        }
      } catch (error) {
        setError("Failed to fetch movies")
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return

    try {
      const result = await deleteMovie(id)
      if (result.success) {
        setMovies(movies.filter((movie) => movie._id !== id))
      } else {
        setError(result.error || "Failed to delete movie")
      }
    } catch (error) {
      setError("Failed to delete movie")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/admin/movies/create">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Movies</CardTitle>
          <CardDescription>Add, edit or remove movies from your collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Title (English)
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title (Arabic)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Year</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {movies.map((movie) => (
                  <tr
                    key={movie._id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{movie.titleEnglish}</td>
                    <td className="p-4 align-middle">{movie.titleArabic}</td>
                    <td className="p-4 align-middle">{movie.year}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          movie.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {movie.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                          asChild
                        >
                          <Link href={`/admin/movies/${movie._id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                          asChild
                        >
                          <Link href={`/admin/movies/edit/${movie._id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                          onClick={() => handleDelete(movie._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

