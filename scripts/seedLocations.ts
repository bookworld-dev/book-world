import 'dotenv/config';
import { getDb } from '../app/lib/db.ts';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


type CountryFeature = {
  properties: {
    ISO_A2: string;
    ISO_A2_EH: string;
    NAME: string;
    adm1_code?: string;
  };
};

type RegionFeature = {
  properties: {
    iso_a2: string;
    name: string;
    iso_3166_2: string;
  };
};

type CountryRow = {
    id: string;
    level: string;
    code: string;
    name: string;
    parent_id: string;
}

const extractCode = (feature: CountryFeature): string => {
  let code = feature.properties.ISO_A2;
  if (code && code !== '-99') return code;
  return feature.properties.ISO_A2_EH;
}

const seedCountries = async (): Promise<CountryRow[]> => {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data/countries.geojson'),
      'utf-8'
    )
  );

  const countries = [];

  for (const feature of data.features as CountryFeature[]) {
    const code = extractCode(feature);
    if (!code || code === '-99') {
      continue;
    }

    const result = await getDb().query(
      `
        INSERT INTO locations (level, code, name, parent_id)
        VALUES ('country', $1, $2, NULL)
        RETURNING *
      `,
      [code, feature.properties.NAME]
    );
    countries.push(result.rows[0]);
  }

  return countries;
};

const seedAdmin1 = async (countries: CountryRow[]) => {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data/admin1.geojson'),
      'utf-8'
    )
  );

  for (const feature of data.features as RegionFeature[]) {
    const code = feature.properties.iso_3166_2;
    if (code.includes('-99')) continue;
    try {
      const parentId = countries.filter(country => country.code === feature.properties.iso_a2)[0].id;
      await getDb().query(
        `
          INSERT INTO locations (level, code, name, parent_id)
          VALUES ('state', $1, $2, $3)
        `,
        [code, feature.properties.name, parentId]
      );
    } catch (e) {
    }
  }
}

const main = async () => {
  const countries = await seedCountries();
  await seedAdmin1(countries)
}

main();