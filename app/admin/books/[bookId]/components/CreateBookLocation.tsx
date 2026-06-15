"use client";
import { createBookLocation } from "@/app/lib/api/book.api";
import { Book, Location, LocationLevel } from "@/app/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateBookLocationProps = {
  locations: Location[];
  book: Book;
}

const CreateBookLocation = ({ locations, book }: CreateBookLocationProps) => {
  const router = useRouter();
  const [ level, setLevel ] = useState<LocationLevel>('country');
  const [ parentId, setParentId ] = useState<string>("");
  const [ locationId, setLocationId ] = useState<string>("");

  const validLocation = () => {
    return (locationId && level === 'country') ||
      (locationId && parentId);
  }

  const resetBookLocationForm = () => {
    setLevel('country');
    setParentId("");
    setLocationId("");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validLocation()) {
      const bookLocation = { bookId: book.id, locationId: locationId! };
      createBookLocation(bookLocation).then(() => {
        router.refresh();
        resetBookLocationForm();
      });
    }
  }

  const parentOptions = () => {
    return locations.filter(l => l.level === 'country')
      .map(l => (
        <option key={l.code} value={l.id}>{l.name}</option>
      ));
  }

  const locationOptions = () => {
    return locations.filter((l) => {
      if (level === 'country') return l.level === level;
      return l.level === level && l.parentId === parentId
    }).map(l => (
      <option key={l.code} value={l.id}>{l.name}</option>
    ));
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId("");
    setLevel(e.target.value as LocationLevel);
  }

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId("");
    setParentId(e.target.value);
  }

  return (
    <div className="admin-section">
      <h3>Add location</h3>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="level-select">Type</label>
          <select className="admin-select" id="level-select" value={level} onChange={handleLevelChange}>
            <option>country</option>
            <option>state</option>
          </select>
        </div>
        {level === 'state' && (
          <div className="admin-field">
            <label htmlFor="parent-select">Parent country</label>
            <select className="admin-select" id="parent-select" value={parentId} onChange={handleParentChange}>
              {parentOptions()}
            </select>
          </div>
        )}
        <div className="admin-field">
          <label htmlFor="location-select">Location</label>
          <select className="admin-select" id="location-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            <option value="">-</option>
            {locationOptions()}
          </select>
        </div>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={!validLocation()}>
          Add
        </button>
      </form>
    </div>
  )
}

export default CreateBookLocation;
