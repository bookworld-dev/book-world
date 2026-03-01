import { Book } from "@/app/lib/types";

type BookInfoProps = {
  book: Book
}

const BookInfo = ({ book }: BookInfoProps) => {
  return (
    <div>
      <h1>{book.title}</h1>
      <h2>by {book.author}</h2>
    </div>
  )
}

export default BookInfo;