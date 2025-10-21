import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/books/:id - Get a single book
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const book = await db.getBookById(id)

    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch book" }, { status: 500 })
  }
}

// PUT /api/books/:id - Update a book
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, author, publicationYear, publishingHouse } = body

    const updatedBook = await db.updateBook(id, {
      title,
      author,
      publicationYear: publicationYear ? Number.parseInt(publicationYear) : undefined,
      publishingHouse,
    })

    if (!updatedBook) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedBook })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update book" }, { status: 500 })
  }
}

// DELETE /api/books/:id - Delete a book
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await db.deleteBook(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Book deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete book" }, { status: 500 })
  }
}
