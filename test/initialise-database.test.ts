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
