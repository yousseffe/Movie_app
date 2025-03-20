"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { Download, Users, Film, DollarSign, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,892</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+201 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Views</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48,293</div>
            <p className="text-xs text-muted-foreground">+18.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">+1.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown for the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart
                data={[
                  { name: "Jan", value: 12400 },
                  { name: "Feb", value: 14250 },
                  { name: "Mar", value: 15800 },
                  { name: "Apr", value: 16500 },
                  { name: "May", value: 17200 },
                  { name: "Jun", value: 19600 },
                  { name: "Jul", value: 20100 },
                  { name: "Aug", value: 21300 },
                  { name: "Sep", value: 22500 },
                  { name: "Oct", value: 23200 },
                  { name: "Nov", value: 24100 },
                  { name: "Dec", value: 24892 },
                ]}
              />
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Subscriber Growth</CardTitle>
                <CardDescription>New subscribers over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Jan", value: 45 },
                    { name: "Feb", value: 52 },
                    { name: "Mar", value: 61 },
                    { name: "Apr", value: 58 },
                    { name: "May", value: 63 },
                    { name: "Jun", value: 72 },
                    { name: "Jul", value: 85 },
                    { name: "Aug", value: 93 },
                    { name: "Sep", value: 112 },
                    { name: "Oct", value: 143 },
                    { name: "Nov", value: 189 },
                    { name: "Dec", value: 201 },
                  ]}
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Distribution by plan type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart
                  data={[
                    { name: "Basic", value: 210 },
                    { name: "Standard", value: 245 },
                    { name: "Premium", value: 118 },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Demographics</CardTitle>
              <CardDescription>Age and gender distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-4 text-sm font-medium">Age Distribution</h3>
                  <PieChart
                    data={[
                      { name: "18-24", value: 125 },
                      { name: "25-34", value: 234 },
                      { name: "35-44", value: 152 },
                      { name: "45-54", value: 42 },
                      { name: "55+", value: 20 },
                    ]}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-medium">Gender Distribution</h3>
                  <PieChart
                    data={[
                      { name: "Male", value: 312 },
                      { name: "Female", value: 248 },
                      { name: "Other", value: 13 },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Retention</CardTitle>
              <CardDescription>Monthly retention rates</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart
                data={[
                  { name: "Jan", value: 92 },
                  { name: "Feb", value: 91 },
                  { name: "Mar", value: 93 },
                  { name: "Apr", value: 94 },
                  { name: "May", value: 92 },
                  { name: "Jun", value: 95 },
                  { name: "Jul", value: 94 },
                  { name: "Aug", value: 93 },
                  { name: "Sep", value: 95 },
                  { name: "Oct", value: 96 },
                  { name: "Nov", value: 95 },
                  { name: "Dec", value: 97 },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Most viewed movies in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Inception", views: 4829, growth: 12.5 },
                  { title: "The Dark Knight", views: 3921, growth: 8.2 },
                  { title: "Interstellar", views: 3245, growth: 15.7 },
                  { title: "Parasite", views: 2987, growth: 21.3 },
                  { title: "The Godfather", views: 2654, growth: -2.1 },
                ].map((movie, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="font-medium">{i + 1}.</div>
                      <div>
                        <div className="font-medium">{movie.title}</div>
                        <div className="text-sm text-muted-foreground">{movie.views.toLocaleString()} views</div>
                      </div>
                    </div>
                    <div className={`text-sm ${movie.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {movie.growth >= 0 ? "+" : ""}
                      {movie.growth}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Content Engagement</CardTitle>
              <CardDescription>Average watch time and completion rate</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={[
                  { name: "Action", value: 72 },
                  { name: "Comedy", value: 65 },
                  { name: "Drama", value: 81 },
                  { name: "Sci-Fi", value: 78 },
                  { name: "Thriller", value: 74 },
                  { name: "Horror", value: 58 },
                  { name: "Romance", value: 69 },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Subscription Type</CardTitle>
              <CardDescription>Monthly revenue breakdown by plan</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={[
                  { name: "Basic", value: 6230 },
                  { name: "Standard", value: 12250 },
                  { name: "Premium", value: 6412 },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Projected revenue for the next 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart
                data={[
                  { name: "Jan", value: 24892 },
                  { name: "Feb", value: 26500 },
                  { name: "Mar", value: 28200 },
                  { name: "Apr", value: 30100 },
                  { name: "May", value: 32400 },
                  { name: "Jun", value: 35000 },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

