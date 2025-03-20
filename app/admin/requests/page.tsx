import { getMovieRequests } from "@/app/actions/movie-request"
import { RequestList } from "@/components/admin/request-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminRequestsPage() {
  const requests = await getMovieRequests()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
      </div>

      <RequestList requests={requests} />
    </div>
  )
}

