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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    redirect(`/admin/locations/${locationId}`)
  }

  return (
    <>
      <h3>Browse by location</h3>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label>Type</label>
          <select className="admin-select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>country</option>
            <option>state</option>
          </select>
        </div>
        {level === 'state' && (
          <div className="admin-field">
            <label htmlFor="parent-select">Parent country</label>
            <select className="admin-select" id="parent-select" value={parentId} onChange={handleParentChange}>
              <option>-</option>
              {parentOptions()}
            </select>
          </div>
        )}
        <div className="admin-field">
          <label htmlFor="location-select">Location</label>
          <select className="admin-select" id="location-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            <option>-</option>
            {locationOptions()}
          </select>
        </div>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={!locationId}>Go</button>
      </form>
    </>
  );
};

export default LocationLookup;
