"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookMarked } from "lucide-react"
import type { Book } from "@/lib/db"

export default function UpdateBookPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publicationYear: "",
    publishingHouse: "",
  })

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${id}`)
      const data = await response.json()

      if (data.success) {
        const book: Book = data.data
        setFormData({
          title: book.title,
          author: book.author,
          publicationYear: book.publicationYear.toString(),
          publishingHouse: book.publishingHouse,
        })
      } else {
        setError("Book not found")
      }
    } catch (err) {
      setError("Failed to fetch book details")
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/")
      } else {
        setError(data.error || "Failed to update book")
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
            ) : error && !formData.title ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => router.push("/")}>Return to Library</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <BookMarked className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Update Book</CardTitle>
                      <CardDescription>Edit the details of the book</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter book title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        name="author"
                        type="text"
                        placeholder="Enter author name"
                        value={formData.author}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publicationYear">Publication Year *</Label>
                      <Input
                        id="publicationYear"
                        name="publicationYear"
                        type="number"
                        placeholder="Enter publication year"
                        value={formData.publicationYear}
                        onChange={handleChange}
                        min="1000"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publishingHouse">Publishing House *</Label>
                      <Input
                        id="publishingHouse"
                        name="publishingHouse"
                        type="text"
                        placeholder="Enter publishing house"
                        value={formData.publishingHouse}
                        onChange={handleChange}
                        required
                      />
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
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Updating Book..." : "Update Book"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
