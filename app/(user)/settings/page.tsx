"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Bell, Moon, Shield, User } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Moon className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="johndoe" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" disabled={isLoading} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="english" disabled={isLoading}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5" disabled={isLoading}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
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

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Vidoe looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="rounded-md border-2 border-primary p-1">
                        <div className="h-24 w-40 rounded bg-background">
                          <div className="h-8 rounded-t bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="theme-light"
                          name="theme"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="rounded-md border-2 border-muted p-1">
                        <div className="h-24 w-40 rounded bg-black">
                          <div className="h-8 rounded-t bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="theme-dark"
                          name="theme"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="rounded-md border-2 border-muted p-1">
                        <div className="h-24 w-40 rounded bg-gradient-to-b from-background to-black">
                          <div className="h-8 rounded-t bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="theme-system"
                          name="theme"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Font Size</h3>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="font-small"
                        name="font-size"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="font-small" className="text-sm">
                        Small
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="font-medium"
                        name="font-size"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="font-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="font-large"
                        name="font-size"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="font-large" className="text-lg">
                        Large
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="font-xl"
                        name="font-size"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="font-xl" className="text-xl">
                        Extra Large
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accent Color</h3>
                  <div className="grid gap-4 sm:grid-cols-5">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-red-500"></div>
                      <input
                        type="radio"
                        id="color-red"
                        name="accent-color"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <Label htmlFor="color-red">Red</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                      <input
                        type="radio"
                        id="color-blue"
                        name="accent-color"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="color-blue">Blue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-green-500"></div>
                      <input
                        type="radio"
                        id="color-green"
                        name="accent-color"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="color-green">Green</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-purple-500"></div>
                      <input
                        type="radio"
                        id="color-purple"
                        name="accent-color"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="color-purple">Purple</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-orange-500"></div>
                      <input
                        type="radio"
                        id="color-orange"
                        name="accent-color"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="color-orange">Orange</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-new-movies" className="font-medium">
                          New Movie Releases
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new movies are added.
                        </p>
                      </div>
                      <Switch id="email-new-movies" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-recommendations" className="font-medium">
                          Movie Recommendations
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive personalized movie recommendations.</p>
                      </div>
                      <Switch id="email-recommendations" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-account" className="font-medium">
                          Account Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about your account.</p>
                      </div>
                      <Switch id="email-account" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-newsletter" className="font-medium">
                          Newsletter
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive our monthly newsletter.</p>
                      </div>
                      <Switch id="email-newsletter" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-new-movies" className="font-medium">
                          New Movie Releases
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new movies are added.
                        </p>
                      </div>
                      <Switch id="app-new-movies" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-recommendations" className="font-medium">
                          Movie Recommendations
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive personalized movie recommendations.</p>
                      </div>
                      <Switch id="app-recommendations" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-account" className="font-medium">
                          Account Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about your account.</p>
                      </div>
                      <Switch id="app-account" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Change your password</p>
                      <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
                    </div>
                    <Button asChild>
                      <Link href="/settings/change-password">Change Password</Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Add an extra layer of security</p>
                      <p className="text-sm text-muted-foreground">
                        Protect your account with two-factor authentication.
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Active Sessions</h3>
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Windows • Chrome • New York, USA</p>
                        </div>
                        <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
                          Active Now
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Previous Session</p>
                          <p className="text-sm text-muted-foreground">Mac OS • Safari • New York, USA</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delete Account</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Permanently delete your account</p>
                      <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

