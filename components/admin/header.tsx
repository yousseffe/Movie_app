"use client"

import Link from "next/link"
import { Bell, Home, Maximize, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"

export function AdminHeader() {
  const pathname = usePathname()

  // Extract the current page name from the pathname
  const getPageName = () => {
    const path = pathname.split("/").filter(Boolean)
    if (path.length === 1 && path[0] === "admin") return "Dashboard"
    if (path.length > 1) {
      return path[1].charAt(0).toUpperCase() + path[1].slice(1)
    }
    return ""
  }

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" asChild className="mr-2 md:hidden">
          <Link href="/admin">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{getPageName()}</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-64 rounded-full bg-background pl-8 md:w-80" />
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 md:hidden">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="flex-1 rounded-full bg-background" />
      </div>
    </header>
  )
}

