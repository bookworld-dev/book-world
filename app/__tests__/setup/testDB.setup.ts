import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { closeDb } from '@/app/lib/db';

let container: StartedPostgreSqlContainer;
let pool: Pool;

export const startTestDb = async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('book_world_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const migration = fs.readFileSync(
    path.resolve(__dirname, '../../../migrations/001_create_books.sql'),
    'utf-8'
  );

  await pool.query(migration);

  return pool;
};

export const stopTestDb = async () => {
  await closeDb();
  await pool?.end();
  await container?.stop();
};

export const clearDatabase = async () => {
  const pool = getTestPool();

  await pool.query(`
    TRUNCATE TABLE
      books
    RESTART IDENTITY
    CASCADE
  `);
}

export const getTestPool = () => pool;