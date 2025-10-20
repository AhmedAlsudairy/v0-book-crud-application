// In-memory database for books
// This can be replaced with a real database later

export interface Book {
  id: string
  title: string
  author: string
  publicationYear: number
  publishingHouse: string
  createdAt: string
  updatedAt: string
}

// In-memory storage
const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    publishingHouse: "Charles Scribner's Sons",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    publicationYear: 1949,
    publishingHouse: "Secker & Warburg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publicationYear: 1960,
    publishingHouse: "J. B. Lippincott & Co.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const db = {
  // Get all books
  getAllBooks: () => {
    return books
  },

  // Get book by ID
  getBookById: (id: string) => {
    return books.find((book) => book.id === id)
  },

  // Create new book
  createBook: (bookData: Omit<Book, "id" | "createdAt" | "updatedAt">) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    books.push(newBook)
    return newBook
  },

  // Update book
  updateBook: (id: string, bookData: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>) => {
    const index = books.findIndex((book) => book.id === id)
    if (index === -1) return null

    books[index] = {
      ...books[index],
      ...bookData,
      updatedAt: new Date().toISOString(),
    }
    return books[index]
  },

  // Delete book
  deleteBook: (id: string) => {
    const index = books.findIndex((book) => book.id === id)
    if (index === -1) return false

    books.splice(index, 1)
    return true
  },
}
