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

  const handleDeleteClick = (locationId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteLocation(locationId);
  }

  return (
    <div className="admin-section">
      <h3>Locations</h3>
      <ul className="admin-location-list">
        {locations.map((location) => (
          <li className="admin-location-item" key={location.code}>
            <span>
              {location.name}
              <span className="admin-location-code">{location.code}</span>
            </span>
            <button className="admin-btn-danger" onClick={handleDeleteClick(location.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookLocations
