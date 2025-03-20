import type React from "react"
import { UserNavbar } from "@/components/user/navbar"
import { UserFooter } from "@/components/user/footer"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserNavbar />
      <main className="flex-1">{children}</main>
      <UserFooter />
    </div>
  )
}

