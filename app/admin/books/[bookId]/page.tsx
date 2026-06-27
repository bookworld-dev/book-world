import { getBookById } from "@/app/api/books/book.controller";
import { getLocations, getLocationsByBookId } from "@/app/api/locations/location.controller";
import BookInfo from "./components/BookInfo";
import BookDescription from "./components/BookDescription";
import BookLocations from "./components/BookLocations";
import CreateBookLocation from "./components/CreateBookLocation";

type BookPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

const BookPage = async ({ params }: BookPageProps) => {
  const { bookId } = await params;
  const book = await getBookById(bookId);
  const bookLocations = await getLocationsByBookId(book.id);
  const allLocations = await getLocations(null);

  return (
    <>
      <BookInfo book={book} />
      <BookDescription bookId={book.id} initialDescription={book.description} />
      <BookLocations bookId={book.id} locations={bookLocations} />
      <CreateBookLocation book={book} locations={allLocations} />
    </>
  );
};

export default BookPage;
