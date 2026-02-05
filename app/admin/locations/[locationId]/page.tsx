import { getBooksByLocationId } from "@/app/api/books/book.controller";
import { getLocationById } from "@/app/api/locations/location.controller";

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
      <h1>Location {JSON.stringify(location)}</h1>
      <h1>Location books {JSON.stringify(books)}</h1>
    </main>
  );
};

export default LocationPage;