import { deleteBookLocation } from "@/app/api/books/book.controller";
import { Location } from "@/app/lib/types";
import { revalidatePath } from "next/cache";

type BookLocationsProps = {
  bookId: string;
  locations: Location[];
}

const BookLocations = ({ bookId, locations }: BookLocationsProps) => {
  const deleteLocation = async (locationId: string) => {
    "use server";
    await deleteBookLocation(bookId, locationId);
    revalidatePath(`/admin/books/${bookId}`);
  };

  return (
    <div>
      <p>Locations:</p>
      {locations.map((location) => (
        <div key={location.code}>
          {location.name} ({location.code})
          <form action={deleteLocation.bind(null, location.id)}>
            <button type="submit">Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default BookLocations