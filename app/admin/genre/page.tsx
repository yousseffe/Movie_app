import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { getGenres, deleteGenre } from "@/app/actions/genre"
import { revalidatePath } from "next/cache"
import  Genre  from "@/models/Genre"
export default async function GenrePage() {
  const result = await getGenres()
  const genres  = result.success ? result.data : []

  const handleDelete = async (id: string) => {
    "use server"
    await deleteGenre(id)
    revalidatePath("/admin/genre")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Genres</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/admin/genre/add">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Genres</CardTitle>
          <CardDescription>Add, edit or remove genres for movies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name English</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name Arabic</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {genres.map((genre) => (
                  <tr
                    key={genre._id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{genre.nameEnglish}</td>
                    <td className="p-4 align-middle">{genre.nameArabic}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          genre.status
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {genre.status ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                          asChild
                        >
                          <Link href={`/admin/genre/edit/${genre._id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Link>
                        </Button>
                        <form action={handleDelete.bind(null, genre._id)}>
                          <Button
                            variant="outline"
                            size="sm"
                            type="submit"
                            className="h-8 gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

