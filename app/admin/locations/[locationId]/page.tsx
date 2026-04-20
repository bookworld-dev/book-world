import { getBooksByLocationId } from "@/app/api/books/book.controller";
import { getLocationById } from "@/app/api/locations/location.controller";
import { Book } from "@/app/lib/types";
import Link from "next/link";

type LocationPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

const LocationPage = async ({ params }: LocationPageProps) => {
  const { locationId } = await params;
  const location = await getLocationById(locationId);
  const books = await getBooksByLocationId(location.id);

  return (
    <main>
      <h1>{location.name} ({location.code})</h1>
      <ul>
        {books.map((book: Book) => (
          <li key={book.id}>
            <Link href={`/admin/books/${book.id}`}><span className="book-title">{book.title}</span> by <span className="book-author">{book.author}</span></Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default LocationPage;