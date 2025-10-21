import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/books - Get all books
export async function GET() {
  try {
    const books = await db.getAllBooks()
    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 })
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, publicationYear, publishingHouse } = body

    // Validation
    if (!title || !author || !publicationYear || !publishingHouse) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    const newBook = await db.createBook({
      title,
      author,
      publicationYear: Number.parseInt(publicationYear),
      publishingHouse,
    })

    return NextResponse.json({ success: true, data: newBook }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create book" }, { status: 500 })
  }
}
