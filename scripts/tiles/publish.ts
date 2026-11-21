import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'ewansheldon';
const TILESETS = { dev: 'regions-dev', prod: 'regions' } as const;
const SOURCE_PATH = path.join(__dirname, '.build/regions.geojsonl');
const RECIPE_PATH = path.join(__dirname, 'recipe.json');

const MAX_ZOOM_LIMIT = 5;
const MAX_SOURCE_MB = 100;
const MONTHLY_CU_LIMIT = 15;

type Target = keyof typeof TILESETS;
type Recipe = { version: number; layers: Record<string, { maxzoom: number; source?: string }> };
type Tileset = { id: string; description: string };
type Job = { stage: string; created: number; cu?: number; errors: unknown[]; warnings: unknown[] };

let token: string | undefined;

const getToken = () => {
  if (process.env.MAPBOX_TILESETS_TOKEN) return process.env.MAPBOX_TILESETS_TOKEN;

  return execFileSync(
    'gcloud',
    ['secrets', 'versions', 'access', 'latest', '--secret=MAPBOX_TILESETS_TOKEN', '--project=bookworld-283512'],
    { encoding: 'utf-8' }
  ).trim();
}

const api = async <T>(endpoint: string, init?: RequestInit): Promise<T> => {
  token ??= getToken();
  const url = new URL(`https://api.mapbox.com/tilesets/v1/${endpoint}`);
  url.searchParams.set('access_token', token);

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${url.pathname} failed with ${res.status}: ${await res.text()}`);
  }

  return (res.status === 204 ? undefined : await res.json()) as T;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const cuUsedThisMonth = async (tilesetIds: string[]) => {
  const now = new Date();
  const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  let total = 0;

  for (const id of tilesetIds) {
    const jobs = await api<Job[]>(`${id}/jobs?stage=success&limit=500`);
    total += jobs.filter(j => j.created >= monthStart).reduce((sum, j) => sum + (j.cu ?? 0), 0);
  }

  return total;
}

const confirm = async (question: string) => {
  if (process.argv.includes('--yes')) return true;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${question} [y/N] `);
  rl.close();

  return answer.trim().toLowerCase() === 'y';
}

const waitForJob = async (tilesetId: string, jobId: string) => {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 10_000));
    const job = await api<Job>(`${tilesetId}/jobs/${jobId}`);
    if (job.stage !== 'queued' && job.stage !== 'processing') return job;
    console.log(`  ${job.stage}...`);
  }
}

const publish = async () => {
  const target = process.argv[2] as Target;
  if (!(target in TILESETS)) throw new Error('Usage: npm run tiles:publish -- dev|prod [--yes]');

  const sourceId = TILESETS[target];
  const tilesetId = `${USERNAME}.${sourceId}`;

  const recipe: Recipe = JSON.parse(fs.readFileSync(RECIPE_PATH, 'utf-8'));
  for (const [name, layer] of Object.entries(recipe.layers)) {
    if (layer.maxzoom > MAX_ZOOM_LIMIT) {
      throw new Error(`Layer ${name} has maxzoom ${layer.maxzoom}, above the limit of ${MAX_ZOOM_LIMIT}`);
    }
    layer.source = `mapbox://tileset-source/${USERNAME}/${sourceId}`;
  }

  if (!fs.existsSync(SOURCE_PATH)) throw new Error('No tiles built yet, run npm run tiles:build first');
  const source = fs.readFileSync(SOURCE_PATH);
  if (source.length > MAX_SOURCE_MB * 1e6) {
    throw new Error(`Source is ${(source.length / 1e6).toFixed(1)} MB, above the limit of ${MAX_SOURCE_MB} MB`);
  }

  const fingerprint = crypto.createHash('sha256').update(source).update(JSON.stringify(recipe)).digest('hex').slice(0, 16);
  const description = `Built by book-world scripts/tiles (${fingerprint})`;

  const tilesets = await api<Tileset[]>(`${USERNAME}?type=vector&limit=500`);
  const existing = tilesets.find(t => t.id === tilesetId);
  if (existing?.description === description) {
    console.log(`${tilesetId} already has this build, nothing to publish`);
    return;
  }

  const regionTilesetIds = Object.values(TILESETS).map(id => `${USERNAME}.${id}`);
  const used = await cuUsedThisMonth(tilesets.map(t => t.id).filter(id => regionTilesetIds.includes(id)));
  console.log(`Region tilesets have used ${used.toFixed(2)} CU this month (20 free)`);
  if (used >= MONTHLY_CU_LIMIT) {
    throw new Error(`Refusing to publish, over the monthly limit of ${MONTHLY_CU_LIMIT} CU`);
  }

  if (!await confirm(`Publish ${tilesetId}?`)) return;

  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(source)]), 'regions.geojsonl');
  await api(`sources/${USERNAME}/${sourceId}`, { method: 'PUT', body: form });

  if (existing) {
    await api(`${tilesetId}/recipe`, json('PATCH', recipe));
  } else {
    await api(tilesetId, json('POST', { recipe, name: sourceId, private: true }));
  }

  const { jobId } = await api<{ jobId: string }>(`${tilesetId}/publish`, { method: 'POST' });
  console.log(`Publishing ${tilesetId} (job ${jobId})`);

  const job = await waitForJob(tilesetId, jobId);
  if (job.stage !== 'success') throw new Error(`Job ${job.stage}: ${JSON.stringify(job.errors)}`);
  if (job.warnings.length > 0) console.warn('Warnings:', JSON.stringify(job.warnings, null, 2));

  await api(tilesetId, json('PATCH', { description }));
  console.log(`Published ${tilesetId} using ${job.cu} CU`);
}

publish().catch(err => {
  console.error(err.message);
  process.exit(1);
});
