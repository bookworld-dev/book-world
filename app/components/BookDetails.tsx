"use client";

import { useEffect, useState } from 'react';
import { Book } from '@/app/lib/types';
import { getRandomBookByLocation } from '@/app/lib/api/book.api';
import { generateCoverUrl } from '@/app/lib/utils/cover';

type Props = {
  locationCode: string;
  onClose: () => void;
};

export default function BookDetails({ locationCode, onClose }: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBook(null);
    setError(false);
    getRandomBookByLocation(locationCode)
      .then(setBook)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [locationCode]);

  return (
    <div className="book-panel">
      <button className="book-panel-close" onClick={onClose}>×</button>
      {loading && <p>Loading...</p>}
      {error && <p>No books found here.</p>}
      {book && (
        <>
          <img className="book-panel-cover" src={generateCoverUrl(book.id)} alt={book.title} />
          <p className="book-title">{book.title}</p>
          <p className="book-author">{book.author}</p>
          {book.description && <p className="book-description">{book.description}</p>}
        </>
      )}
    </div>
  );
}
