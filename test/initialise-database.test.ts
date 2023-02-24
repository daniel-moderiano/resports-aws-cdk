import { testPool } from "../config/database";
import { createNewTables, dropExistingTables } from "../helpers/initdb";

// Reset the database to baseline empty tables
beforeAll(async () => {
  await dropExistingTables(testPool);
  await createNewTables(testPool);
});

afterAll(async () => {
  await testPool.end();
});

// Returns all user created tables
const queryForAllTables =
  "SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'";

it("resets/initialises correctly with 3 new tables", async () => {
  const result = await testPool.query(queryForAllTables);
  expect(result.rowCount).toBe(3);
});

it("correctly removes all tables", async () => {
  await dropExistingTables(testPool);
  const result = await testPool.query(queryForAllTables);
  expect(result.rowCount).toBe(0);
});

it("correctly recreates all tables", async () => {
  await createNewTables(testPool);
  const result = await testPool.query(queryForAllTables);
  expect(result.rowCount).toBe(3);
});
