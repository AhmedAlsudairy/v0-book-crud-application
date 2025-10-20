-- Create books table for library management system
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publication_year INTEGER NOT NULL,
  publishing_house VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on title for faster searches
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- Insert sample books
INSERT INTO books (title, author, publication_year, publishing_house) VALUES
  ('To Kill a Mockingbird', 'Harper Lee', 1960, 'J.B. Lippincott & Co.'),
  ('1984', 'George Orwell', 1949, 'Secker & Warburg'),
  ('Pride and Prejudice', 'Jane Austen', 1813, 'T. Egerton'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Charles Scribner''s Sons');
