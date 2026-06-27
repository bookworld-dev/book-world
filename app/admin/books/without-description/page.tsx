export const dynamic = 'force-dynamic';

import { getBooksWithoutDescription } from "@/app/api/books/book.controller";
import Link from "next/link";

const BooksWithoutDescriptionPage = async () => {
  const books = await getBooksWithoutDescription();

  return (
    <div className="admin-section">
      <h1>Books without descriptions</h1>
      {books.length === 0 ? (
        <p>All books have descriptions.</p>
      ) : (
        <div className="admin-results">
          {books.map(book => (
            <Link key={book.id} className="admin-result-item" href={`/admin/books/${book.id}`}>
              <span>{book.title}</span>
              <span style={{ color: '#888', fontSize: '13px' }}> — {book.author}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksWithoutDescriptionPage;
