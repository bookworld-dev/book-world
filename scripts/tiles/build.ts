import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';
import { customRegions, NaturalEarthProps } from './customRegions.ts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Feature = { type: 'Feature'; properties: NaturalEarthProps; geometry: unknown };
type FeatureCollection = { type: 'FeatureCollection'; features: Feature[] };

const NATURAL_EARTH_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson';
const NATURAL_EARTH_SHA256 = '22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5';
const CACHE_PATH = path.join(__dirname, '.cache/ne_10m_admin_1_states_provinces.geojson');
const OUTPUT_PATH = path.join(__dirname, '.build/regions.geojsonl');
const SEED_PATH = path.join(__dirname, '../data/locations.json');

const CUSTOM_REGION_ORDER = 0;
const NATURAL_EARTH_ORDER = 1;

const loadNaturalEarth = async (): Promise<FeatureCollection> => {
  if (!fs.existsSync(CACHE_PATH)) {
    console.log(`Downloading ${NATURAL_EARTH_URL}`);
    const res = await fetch(NATURAL_EARTH_URL);
    if (!res.ok) throw new Error(`Download failed with ${res.status}`);
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, Buffer.from(await res.arrayBuffer()));
  }

  const data = fs.readFileSync(CACHE_PATH);
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  if (hash !== NATURAL_EARTH_SHA256) {
    throw new Error(`Unexpected checksum for ${CACHE_PATH}, delete it and run again`);
  }

  return JSON.parse(data.toString());
}

const runMapshaper = async (commands: string, input: FeatureCollection): Promise<FeatureCollection> => {
  const output = await mapshaper.applyCommands(
    `-i input.json ${commands} -o output.json format=geojson geojson-type=FeatureCollection precision=0.00001`,
    { 'input.json': input }
  );

  return JSON.parse(String(output['output.json']));
}

const toRegion = (feature: Feature, code: unknown, name: unknown, order: number): Feature => ({
  type: 'Feature',
  geometry: feature.geometry,
  properties: { iso_3166_2: code, name, draw_order: order },
});

const checkSeededStatesExist = (regions: Feature[]) => {
  const seed: { level: string; code: string }[] = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
  const codes = new Set(regions.map(r => r.properties.iso_3166_2));
  const missing = seed.filter(l => l.level === 'state' && !codes.has(l.code)).map(l => l.code);

  if (missing.length > 0) {
    throw new Error(`Seeded locations with no shape on the map: ${missing.join(', ')}`);
  }
}

const build = async () => {
  const naturalEarth = await loadNaturalEarth();

  const simplified = await runMapshaper('-simplify interval=200 keep-shapes', naturalEarth);

  const regions = simplified.features.map(f => toRegion(f, f.properties.iso_3166_2, f.properties.name, NATURAL_EARTH_ORDER));

  for (const custom of customRegions) {
    const parts = simplified.features.filter(f => custom.includes(f.properties));
    if (parts.length === 0) throw new Error(`Custom region ${custom.code} matched no features`);

    const dissolved = await runMapshaper('-dissolve', { type: 'FeatureCollection', features: parts });
    regions.push(...dissolved.features.map(f => toRegion(f, custom.code, custom.name, CUSTOM_REGION_ORDER)));
  }

  checkSeededStatesExist(regions);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, regions.map(r => JSON.stringify(r)).join('\n') + '\n');

  const sizeMb = fs.statSync(OUTPUT_PATH).size / 1e6;
  console.log(`Wrote ${regions.length} regions to ${OUTPUT_PATH} (${sizeMb.toFixed(1)} MB)`);
}

build();
