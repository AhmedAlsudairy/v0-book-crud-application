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

// GET /api/books - Get all books
export async function GET() {
  try {
    const books = await db.getAllBooks()
    console.log("[v0] API: Fetched books from database:", books)
    console.log("[v0] API: Number of books:", books.length)
    return NextResponse.json({ success: true, data: books }, { headers: corsHeaders })
  } catch (error) {
    console.error("[v0] API: Error fetching books:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500, headers: corsHeaders })
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] API POST: Received request body:", body)

    const { title, author, publicationYear, publishingHouse } = body

    // Validation
    if (!title || !author || !publicationYear || !publishingHouse) {
      console.log("[v0] API POST: Validation failed - missing fields")
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400, headers: corsHeaders },
      )
    }

    console.log("[v0] API POST: Creating book with data:", { title, author, publicationYear, publishingHouse })

    const newBook = await db.createBook({
      title,
      author,
      publicationYear: Number.parseInt(publicationYear),
      publishingHouse,
    })

    console.log("[v0] API POST: Book created successfully:", newBook)
    return NextResponse.json({ success: true, data: newBook }, { status: 201, headers: corsHeaders })
  } catch (error) {
    console.error("[v0] API POST: Error creating book:", error)
    return NextResponse.json({ success: false, error: "Failed to create book" }, { status: 500, headers: corsHeaders })
  }
}
