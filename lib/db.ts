import { neon } from "@neondatabase/serverless"

export interface Book {
  id: string
  title: string
  author: string
  publicationYear: number
  publishingHouse: string
  createdAt: string
  updatedAt: string
}

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!)

let isInitialized = false

async function initializeDatabase() {
  if (isInitialized) return

  try {
    // Check if table exists and create it if it doesn't
    await sql`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        publication_year INTEGER NOT NULL,
        publishing_house VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    isInitialized = true
    console.log("[v0] Database initialized successfully")
  } catch (error) {
    console.error("[v0] Failed to initialize database:", error)
    throw error
  }
}

export const db = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    await initializeDatabase()

    const books = await sql`
      SELECT * FROM books 
      ORDER BY created_at DESC
    `
    return books.map((book) => ({
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      publicationYear: book.publication_year,
      publishingHouse: book.publishing_house,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
    }))
  },

  // Get book by ID
  getBookById: async (id: string): Promise<Book | null> => {
    await initializeDatabase()

    const books = await sql`
      SELECT * FROM books 
      WHERE id = ${id}
    `

    if (books.length === 0) return null

    const book = books[0]
    return {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      publicationYear: book.publication_year,
      publishingHouse: book.publishing_house,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
    }
  },

  // Create new book
  createBook: async (bookData: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book> => {
    await initializeDatabase()

    const books = await sql`
      INSERT INTO books (title, author, publication_year, publishing_house)
      VALUES (${bookData.title}, ${bookData.author}, ${bookData.publicationYear}, ${bookData.publishingHouse})
      RETURNING *
    `

    const book = books[0]
    return {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      publicationYear: book.publication_year,
      publishingHouse: book.publishing_house,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
    }
  },

  // Update book
  updateBook: async (
    id: string,
    bookData: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Book | null> => {
    await initializeDatabase()

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (bookData.title !== undefined) {
      updates.push(`title = $${paramIndex++}`)
      values.push(bookData.title)
    }
    if (bookData.author !== undefined) {
      updates.push(`author = $${paramIndex++}`)
      values.push(bookData.author)
    }
    if (bookData.publicationYear !== undefined) {
      updates.push(`publication_year = $${paramIndex++}`)
      values.push(bookData.publicationYear)
    }
    if (bookData.publishingHouse !== undefined) {
      updates.push(`publishing_house = $${paramIndex++}`)
      values.push(bookData.publishingHouse)
    }

    if (updates.length === 0) {
      return db.getBookById(id)
    }

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const query = `
      UPDATE books 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const books = await sql(query, values)

    if (books.length === 0) return null

    const book = books[0]
    return {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      publicationYear: book.publication_year,
      publishingHouse: book.publishing_house,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
    }
  },

  // Delete book
  deleteBook: async (id: string): Promise<boolean> => {
    await initializeDatabase()

    const result = await sql`
      DELETE FROM books 
      WHERE id = ${id}
      RETURNING id
    `

    return result.length > 0
  },
}
