"use client"
import { searchBooks } from "@/app/lib/api/book.api";
import { Book } from "@/app/lib/types";
import Link from "next/link";
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
      <h3>Search books</h3>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <input
            className="admin-input"
            type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={handleQueryChange}
            aria-label="book-query"
            required
          />
        </div>
        <button className="admin-btn admin-btn-primary" type="submit">Search</button>
      </form>
      {bookResults.length > 0 && (
        <div className="admin-results">
          {bookResults.map(bookResult =>
            <Link className="admin-result-item" key={bookResult.id} href={`/admin/books/${bookResult.id}`}>
              <span className="book-title">{bookResult.title}</span>
              {' '}by{' '}
              <span className="book-author">{bookResult.author}</span>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default BookSearch;
