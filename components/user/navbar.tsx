"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { SearchDialog } from "@/components/search-dialog"
import { useSession } from "next-auth/react"

export function UserNavbar() {
  const pathname = usePathname()
  // const [isSearchOpen, setIsSearchOpen] = useState(false)
  // const [notifications, setNotifications] = useState([])
  const { data: session } = useSession()

  const routes = [
    {
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Movies",
      href: "/movies",
      active: pathname === "/movies",
    },
    
  ]

  

  


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-sidebar text-sidebar-foreground">
        <div className="container flex h-16 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-sidebar text-sidebar-foreground">
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="text-xl font-bold">V</span>
                </div>
                <span className="text-xl font-bold">Vidoe</span>
              </Link>
              <div className="mt-8 flex flex-col gap-4">
                {routes.map((route) => (
                  <Button
                    key={route.href}
                    asChild
                    variant={route.active ? "secondary" : "ghost"}
                    className="justify-start"
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-xl font-bold">V</span>
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">Vidoe</span>
          </Link>
          <div className="flex items-center gap-2 md:ml-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={route.active ? "secondary" : "ghost"}
                className="hidden md:flex"
              >
                <Link href={route.href}>{route.label}</Link>
              </Button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button> */}

            
              

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/watchlist">Watchlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} /> */}
    </>
  )
}

