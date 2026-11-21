# Book World

## Run locally

You need Node 20+, Postgres, and the gcloud CLI with access to the `bookworld-283512` project:

```
gcloud auth login
gcloud auth application-default login
```

### Environment

Create a `.env` in the repo root:

```
DATABASE_URL=postgresql://localhost/book_world
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_COVER_STORAGE_URL=https://storage.googleapis.com/bookworld-283512-covers
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALLOWED_EMAILS=
```

- `NEXT_PUBLIC_MAPBOX_TOKEN`, `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in Secret Manager under the same names, e.g. `gcloud secrets versions access latest --secret=NEXT_PUBLIC_MAPBOX_TOKEN --project=bookworld-283512`
- `AUTH_SECRET` can be any random string, e.g. from `openssl rand -base64 32`
- `ALLOWED_EMAILS` is a comma-separated list of the Google accounts allowed into `/admin`
- Cover uploads go to the production bucket unless you set `COVER_IMAGES_BUCKET`

### Database

Create the database, run the migrations and seed all selectable locations (countries and states/regions). It starts with no books.

```
createdb book_world
for f in migrations/*.sql; do psql book_world -f "$f"; done
npx tsx scripts/seedLocations.ts
```

### Start

```
npm run dev
```

## Map regions tileset

The zoomed-in regions layer is a Mapbox tileset built from Natural Earth's states/provinces, plus the custom regions in `scripts/tiles/customRegions.ts`. The build fails if any seeded state has no shape.

```
npm run tiles:build
npm run tiles:publish -- dev
```

Publishing needs `MAPBOX_TILESETS_TOKEN` (from your environment or `.env`), otherwise it reads it from GCP Secret Manager. Mapbox bills processing beyond 20 compute units (CU) a month, so the publish script refuses a recipe `maxzoom` above 5, skips publishing when nothing changed, and stops once 15 CU have been used this month. Only publish `prod` from `main`.

The app uses the prod tileset (`ewansheldon.regions`) by default. To see the dev one locally, add `NEXT_PUBLIC_MAPBOX_REGIONS_TILESET=ewansheldon.regions-dev` to your `.env`.

## Run tests

You need to run Docker first, to use test DB containers.

```
npm test
```

## API routes

See the list of API routes [here](./app//api/README.md):