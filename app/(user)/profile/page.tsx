"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Film, Settings, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  // Sample watchlist data
  const watchlist = [
    { id: 1, title: "Inception", year: 2010, image: "/placeholder.svg?height=100&width=70" },
    { id: 2, title: "The Dark Knight", year: 2008, image: "/placeholder.svg?height=100&width=70" },
    { id: 3, title: "Interstellar", year: 2014, image: "/placeholder.svg?height=100&width=70" },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive/10"
                      >
                        Remove Avatar
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="johndoe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Movie enthusiast and critic. I love watching sci-fi and thriller movies."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist">
            <Card>
              <CardHeader>
                <CardTitle>Your Watchlist</CardTitle>
                <CardDescription>Movies you've added to your watchlist.</CardDescription>
              </CardHeader>
              <CardContent>
                {watchlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Film className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Your watchlist is empty</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Start adding movies to your watchlist to keep track of what you want to watch.
                    </p>
                    <Button className="mt-4" asChild>
                      <a href="/movies">Browse Movies</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {watchlist.map((movie) => (
                      <div key={movie.id} className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="h-[70px] w-[50px] flex-shrink-0 overflow-hidden rounded">
                          <img
                            src={movie.image || "/placeholder.svg"}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground">{movie.year}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="new-movies"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="new-movies">New movie releases</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="recommendations"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="recommendations">Movie recommendations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="account-updates"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="account-updates">Account updates</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Password</h3>
                  <Button variant="outline" asChild>
                    <Link href="/settings/change-password">Change Password</Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Language</h3>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="english"
                  >
                    <option value="english">English</option>
                    <option value="arabic">Arabic</option>
                    <option value="french">French</option>
                    <option value="spanish">Spanish</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

