"use client"
import { searchBooks } from "@/app/lib/api/book.api";
import { Book } from "@/app/lib/types";
import { useState } from "react";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [bookResults, setBookResults] = useState<Book[]>([]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchBooks(query).then(setBookResults);
  }

  return (
    <>
      <h3>Search for book:</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={query}
          onChange={handleQueryChange}
          aria-label="book-query"
          required
        />
        <button type="submit">Search</button>
      </form>
      {
        bookResults.map(bookResult => 
          <li key={bookResult.id}>
            <a href={`/admin/books/${bookResult.id}`}>
              <span className="book-title">{bookResult.title}</span> by <span className="book-author">{bookResult.author}</span>
            </a>
          </li>
        )
      }
    </>
  );
};

export default BookSearch;