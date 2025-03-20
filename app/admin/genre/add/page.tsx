"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { createGenre } from "@/app/actions/genre"

export default function AddGenrePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("status", status.toString())

    const result = await createGenre(formData)

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
      description: "Genre has been added successfully.",
    })
    router.push("/admin/genre")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Add New Genre</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Genre Information</CardTitle>
            <CardDescription>Add a new genre to the system. Genres are used to categorize movies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nameEnglish">Name (English)</Label>
              <Input
                id="nameEnglish"
                name="nameEnglish"
                placeholder="Enter genre name in English"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameArabic">Name (Arabic)</Label>
              <Input
                id="nameArabic"
                name="nameArabic"
                placeholder="Enter genre name in Arabic"
                required
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
              {isLoading ? "Adding..." : "Add Genre"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

