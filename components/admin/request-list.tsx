"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { updateMovieRequest } from "@/app/actions/movie-request"

interface RequestListProps {
  requests: any[]
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>
}

export function RequestList({ requests , setRefreshKey }: RequestListProps) {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [action, setAction] = useState<"approved" | "rejected" | null>(null)
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleAction = async () => {
    if (!selectedRequest || !action) return

    setIsSubmitting(true)

    try {
      console.log("selectedRequest", selectedRequest)
      await updateMovieRequest(selectedRequest._id, {
        status: action,
        adminResponse: response,
      })
      console.log("updated request")
      router.refresh()
      handleClose()
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to update request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedRequest(null)
    setAction(null)
    setResponse("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "approved":
        return <Badge variant="default">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell>{request.user?.name}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === "pending" ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedRequest(request)
                            setAction("approved")
                          }}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedRequest(request)
                            setAction("rejected")
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request)
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Approve Request" : action === "reject" ? "Reject Request" : "Request Details"}
            </DialogTitle>
            <DialogDescription>{selectedRequest?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="mt-1 text-sm text-muted-foreground">{selectedRequest?.description}</p>
            </div>

            {selectedRequest?.movieId && (
              <div>
                <h4 className="text-sm font-medium">Requested Movie</h4>
                <p className="mt-1 text-sm">
                  <a
                    href={`/movies/${selectedRequest.movieId}`}
                    target="_blank"
                    className="text-primary hover:underline"
                    rel="noreferrer"
                  >
                    View Movie
                  </a>
                </p>
              </div>
            )}

            {selectedRequest?.status !== "pending" && (
              <div>
                <h4 className="text-sm font-medium">Admin Response</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedRequest?.adminResponse || "No response provided"}
                </p>
              </div>
            )}

            {action && (
              <div>
                <h4 className="text-sm font-medium">Your Response</h4>
                <Textarea
                  placeholder="Provide a response to the user..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            {action ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant={action === "approved" ? "default" : "destructive"}
                  onClick={handleAction}
                  disabled={isSubmitting}
                >
                  {action === "approved" ? "Approved" : "Rejected"}
                </Button>
              </>
            ) : (
              <Button onClick={handleClose}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

