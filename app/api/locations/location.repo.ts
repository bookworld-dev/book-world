import { getDb } from "@/app/lib/db";
import { Location, LocationLevel } from "@/app/lib/types";
import { LocationNotFoundError } from "./location.errors";

type LocationDBRow = {
  id: number;
  level: LocationLevel;
  code: string;
  name: string;
  parent_id: number | null;
};

const toLocation = (row: LocationDBRow): Location => {
  return {
    id: row.id.toString(),
    level: row.level,
    code: row.code,
    name: row.name,
    parentId: row.parent_id === null
      ? null
      : row.parent_id.toString()
  }
}

export const getAllLocations = async (): Promise<Location[]> => {
  const result = await getDb().query(
    `
    SELECT id, level, code, name, parent_id
     FROM locations
    `
  );

  return result.rows.map(toLocation);
}

export const getLocationByCode = async (code: string): Promise<Location> => {
  const result = await getDb().query(
    `
    SELECT id, level, code, name, parent_id
     FROM locations
     WHERE code = $1
    `, [code]
  );

  if (result.rows.length <= 0) throw new LocationNotFoundError();
  return toLocation(result.rows[0]);
}

export const getPopulatedLocations = async (): Promise<Location[]> => {
  const result = await getDb().query(
    `
    SELECT l.id, l.level, l.code, l.name, l.parent_id
    FROM locations l
    WHERE EXISTS (
      SELECT 1
      FROM book_locations bl
      WHERE bl.location_id = l.id
    );
    `
  );

  return result.rows.map(toLocation);
}