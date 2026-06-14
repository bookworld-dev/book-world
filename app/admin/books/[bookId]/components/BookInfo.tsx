import { Book } from "@/app/lib/types";

type BookInfoProps = {
  book: Book
}

const BookInfo = ({ book }: BookInfoProps) => {
  return (
    <div className="admin-section">
      <div className="admin-book-header">
        {book.coverUrl && (
          <img className="admin-cover" src={book.coverUrl} alt={book.title} />
        )}
        <div className="admin-book-meta">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
        </div>
      </div>
    </div>
  )
}

export default BookInfo;
