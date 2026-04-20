"use client";
import { getLocations } from "@/app/lib/api/location.api";
import { Location } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

const LocationLookup = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState<string>();
  const [level, setLevel] = useState<string>('country');
  const [parentId, setParentId] = useState<string>();

  useEffect(() => {
    getLocations(true).then(setLocations);
  }, [])

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId(undefined);
    setParentId(e.target.value);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    redirect(`/admin/locations/${locationId}`)
  }

  return (
    <>
      <h3>Find books by location:</h3>
      <form onSubmit={handleSubmit}>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option>country</option>
          <option>state</option>
        </select>
        {
          level === 'state' &&
          <div>
            <label htmlFor="parent-select">Parent country:</label>
            <select id="parent-select" value={parentId}  onChange={handleParentChange}>
              <option>-</option>
              { parentOptions() }
            </select>
          </div>
        }
        <select id="location-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
          <option>-</option>
          { locationOptions() }
        </select>
        <button type="submit">Go</button>
      </form>
    </>
  );
};

export default LocationLookup;