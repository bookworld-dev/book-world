"use client";
import { deleteBookLocation } from "@/app/lib/api/book.api";
import { Location } from "@/app/lib/types";
import { useRouter } from "next/navigation";

type BookLocationsProps = {
  bookId: string;
  locations: Location[];
}

const BookLocations = ({ bookId, locations }: BookLocationsProps) => {
  const router = useRouter();
  const deleteLocation = (locationId: string) => {
    deleteBookLocation(bookId, locationId)
      .then(() => router.refresh())
  }

  const handleDeleteClick = (locationId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    deleteLocation(locationId);
  }

  return (
    <div>
      <p>Locations:</p>
      <ul>
        {locations.map((location) => (
          <li key={location.code}>
            {location.name} ({location.code}) |
            &nbsp;<a href="" onClick={handleDeleteClick(location.id)}>delete</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookLocations