import { getDb } from "@/app/lib/db";
import { Location, LocationLevel } from "@/app/lib/types";

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

export const getLocations = async(): Promise<Location[]> => {
  const result = await getDb().query(
    `SELECT id, level, code, name, parent_id
     FROM locations`
  );

  return result.rows.map(toLocation);
}