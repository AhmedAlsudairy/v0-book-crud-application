import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET /api/books/:id - Get a single book
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const book = await db.getBookById(id)

    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json({ success: true, data: book }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch book" }, { status: 500, headers: corsHeaders })
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
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json({ success: true, data: updatedBook }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update book" }, { status: 500, headers: corsHeaders })
  }
}

// DELETE /api/books/:id - Delete a book
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await db.deleteBook(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json({ success: true, message: "Book deleted successfully" }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete book" }, { status: 500, headers: corsHeaders })
  }
}
