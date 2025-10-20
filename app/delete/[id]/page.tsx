"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import type { Book } from "@/lib/db"

export default function DeleteBookPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${id}`)
      const data = await response.json()

      if (data.success) {
        setBook(data.data)
      } else {
        setError("Book not found")
      }
    } catch (err) {
      setError("Failed to fetch book details")
    } finally {
      setFetching(false)
    }
  }

  const handleDelete = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        router.push("/")
      } else {
        setError(data.error || "Failed to delete book")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>

          <div className="max-w-2xl mx-auto">
            {fetching ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Loading book details...</p>
                </CardContent>
              </Card>
            ) : error && !book ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => router.push("/")}>Return to Library</Button>
                </CardContent>
              </Card>
            ) : book ? (
              <Card className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Delete Book</CardTitle>
                      <CardDescription>This action cannot be undone</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-semibold">{book.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Author</p>
                      <p className="font-semibold">{book.author}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Publication Year</p>
                        <p className="font-semibold">{book.publicationYear}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Publishing House</p>
                        <p className="font-semibold">{book.publishingHouse}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                      Are you sure you want to delete this book? This action cannot be undone.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/")} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Deleting..." : "Delete Book"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
