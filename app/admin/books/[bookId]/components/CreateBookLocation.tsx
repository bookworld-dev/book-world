"use client";
import { createBookLocation } from "@/app/lib/api/book.api";
import { Book, Location, LocationLevel } from "@/app/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateBookLocationProps = {
  locations: Location[];
  book: Book;
  refetch: () => {}
}

const CreateBookLocation = ({ locations, book }: CreateBookLocationProps) => {
  const router = useRouter();
  const [ level, setLevel ] = useState<LocationLevel>('country');
  const [ parentId, setParentId ] = useState<string>();
  const [ locationId, setLocationId ] = useState<string>();

  const validLocation = () => {
    return (locationId && level === 'country') || 
      (locationId && parentId);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validLocation()) {
      const bookLocation = { bookId: book.id, locationId: locationId! };
      createBookLocation(bookLocation).then(() => {
        router.refresh();
      });
    }
  }

  const parentOptions = () => {
    return locations.filter(l => l.level === 'country' )
      .map(l => {
        return (
          <option key={l.code} value={l.id}>
            {l.name}
          </option>
        )
      });
  }

  const locationOptions = () => {
    return locations.filter((l) => {
      if (level === 'country') return l.level === level;
      return l.level === level && l.parentId === parentId
    }).map(l => 
      <option key={l.code} value={l.id}>
        {l.name}
      </option>
    )
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId(undefined);
    setLevel(e.target.value as LocationLevel);
  }

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId(undefined);
    setParentId(e.target.value);
  }

  return (
    <div>
      <h3>Add new location:</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="level-select">Type:</label>
          <select id="level-select" value={level} onChange={handleLevelChange}>
            <option>country</option>
            <option>state</option>
          </select>
        </div>
        {
          level === 'state' &&
          <div>
            <label htmlFor="parent-select">Parent country:</label>
            <select id="parent-select" value={parentId}  onChange={handleParentChange}>
              { parentOptions() }
            </select>
          </div>
        }
        <div>
          <label htmlFor="location-select">Book location:</label>
          <select id="location-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            { locationOptions() }
          </select>
        </div>
        <button type="submit" disabled={!validLocation()}>Save</button>
      </form>
    </div>
  )
}

export default CreateBookLocation;