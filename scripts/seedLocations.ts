import 'dotenv/config';
import { getDb } from '../app/lib/db.ts';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Location } from '@/app/lib/types.ts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type NewLocationRow = {
  level: string;
  code: string;
  name: string;
}

type CountryRow = NewLocationRow & { id: string; }

const saveCountry = async (country: NewLocationRow) => {
  const result = await getDb().query(
    `
    INSERT INTO locations (level, code, name)
    VALUES ($1,$2,$3)
    RETURNING *
    `, [country.level, country.code, country.name]
  );

  return result.rows[0];
}

const saveRegions = async (states: NewLocationRow[], parentId: string) => {
  for (const state of states) {
    await getDb().query(
      `
      INSERT INTO locations (level, code, name, parent_id)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `, [state.level, state.code, state.name, parentId]
    );
  }
}

const seedLocations = async () => {
  const data: NewLocationRow[] = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data/locations.json'),
      'utf-8'
    )
  );
  
  const countries = data.filter(l => l.level === 'country');

  for (const country of countries) {
    const countryRow: CountryRow = await saveCountry(country)

    const countryRegions = data.filter(l => l.level !== 'country' && l.code.split('-')[0] === country.code);
    await saveRegions(countryRegions, countryRow.id);
  }
}

const main = async () => {
  await seedLocations();
}

main();