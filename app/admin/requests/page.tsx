"use client"
import { useEffect, useState } from "react"
import { getMovieRequests } from "@/app/actions/movie-request"
import { RequestList } from "@/components/admin/request-list"

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      setIsLoading(true)
      try {
        const data = await getMovieRequests()
        console.log(data)
        setRequests(data)
      } catch (error) {
        console.error("Failed to fetch requests:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Access Requests</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <RequestList requests={requests} />
      )}
    </div>
  )
}

