"use client";
import { useEffect, useState } from "react";
import { getLocations } from "./lib/location.api";
import { Location } from "./lib/types";

const BookWorld = () => {
  const [populatedLocations, setPopulatedLocations] = useState<Location[]>([]);
  const getPopulatedLocations = async () => {
    const data = await getLocations(true);
    setPopulatedLocations(data);
  };

  useEffect(() => {
    getPopulatedLocations();
  }, []);

  return (
    <>
      <p>active location codes:</p>
      <p>{populatedLocations.map(location => location.code).join(', ')}</p>
    </>
  );
};

export default BookWorld;