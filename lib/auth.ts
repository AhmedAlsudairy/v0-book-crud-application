// Simple authentication utilities
// In a real app, use proper authentication like NextAuth.js

export interface User {
  username: string
  password: string
}

// Mock user database
const users: User[] = [
  { username: "admin", password: "admin123" },
  { username: "librarian", password: "library123" },
]

export const auth = {
  // Validate user credentials
  validateUser: (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password)
    return user ? { username: user.username } : null
  },
}
