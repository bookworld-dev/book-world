import { Book } from "@/app/lib/types";
import { generateCoverUrl } from "@/app/lib/utils/cover";

type BookInfoProps = {
  book: Book
}

const BookInfo = ({ book }: BookInfoProps) => {
  return (
    <div className="admin-section">
      <div className="admin-book-header">
        <img className="admin-cover" src={generateCoverUrl(book.id)} alt={book.title} />
        <div className="admin-book-meta">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
        </div>
      </div>
    </div>
  )
}

export default BookInfo;
