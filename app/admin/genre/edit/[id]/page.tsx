"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getGenre, updateGenre } from "@/app/actions/genre"

export default function EditGenrePage({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = use(params);
  const id = paramsData.id;
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(true)
  const [nameEnglish, setNameEnglish] = useState("")
  const [nameArabic, setNameArabic] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchGenre = async () => {
      const result = await getGenre(id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        router.push("/admin/genre")
        return
      }

      const genre = result.data
      setNameEnglish(genre.nameEnglish)
      setNameArabic(genre.nameArabic || "")
      setStatus(genre.status)
      setIsInitialLoading(false)
    }

    fetchGenre()
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("status", status.toString())

    const result = await updateGenre(id, formData)

    setIsLoading(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Genre has been updated successfully.",
    })
    router.push("/admin/genre")
  }

  if (isInitialLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Edit Genre</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Genre Information</CardTitle>
            <CardDescription>Edit the genre information. Genres are used to categorize movies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nameEnglish">Name (English)</Label>
              <Input
                id="nameEnglish"
                name="nameEnglish"
                value={nameEnglish}
                onChange={(e) => setNameEnglish(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameArabic">Name (Arabic)</Label>
              <Input
                id="nameArabic"
                name="nameArabic"
                value={nameArabic}
                onChange={(e) => setNameArabic(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="status" checked={status} onCheckedChange={setStatus} disabled={isLoading} />
              <Label htmlFor="status">Active</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/genre">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
