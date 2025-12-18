import { beforeAll, afterAll, beforeEach } from 'vitest';
import { clearDatabase, startTestDb, stopTestDb } from './testDB.setup';

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

beforeEach(async () => {
  await clearDatabase();
});