"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Film,
  Tag,
  Languages,
  MonitorPlay,
  Users,
  Menu,
  LogOut,
  Bell,
  BarChart2,
  DollarSign,
  FileText,
  Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },

    {
      label: "Genre",
      icon: Tag,
      href: "/admin/genre",
      active: pathname === "/admin/genre" || pathname.startsWith("/admin/genre/"),
    },

    {
      label: "Movies",
      icon: Film,
      href: "/admin/movies",
      active: pathname === "/admin/movies" || pathname.startsWith("/admin/movies/"),
    },

    {
      label: "Requests",
      icon: Bell,
      href: "/admin/requests",
      active: pathname === "/admin/requests",
    },
  ]

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-accent",
        collapsed ? "w-[70px]" : "w-[240px]",
        className,
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-accent">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && <span className="text-xl font-bold ml-2">Movies</span>}
          {collapsed && <span className="text-xl font-bold">M</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6 mt-2 px-2">
            <Link href="/admin/profile">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">A</AvatarFallback>
              </Avatar>
            </Link>
            {!collapsed && (
              <div className="ml-2">
                <Link href="/admin/profile" className="hover:underline">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-sidebar-muted-foreground">admin@example.com</p>
                </Link>
              </div>
            )}
          </div>
          <nav className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                  route.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center",
                )}
              >
                <route.icon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
                {!collapsed && <span>{route.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-sidebar-accent">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "p-2",
          )}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

