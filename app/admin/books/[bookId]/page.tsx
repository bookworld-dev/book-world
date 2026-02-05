import { getBookById } from "@/app/api/books/book.controller";
import { getLocationsByBookId } from "@/app/api/locations/location.controller";

type BookPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

const BookPage = async ({ params }: BookPageProps) => {
  const { bookId } = await params;
  const book = await getBookById(bookId);
  const locations = await getLocationsByBookId(book.id);

  return (
    <main>
      <h1>Book {JSON.stringify(book)}</h1>
      <h1>Book locations {JSON.stringify(locations)}</h1>
    </main>
  );
};

export default BookPage;