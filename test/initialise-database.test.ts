import { testPool } from "../config/database";
import { dropExistingTables } from "../helpers/initdb";

afterAll(async () => {
  await testPool.end();
});

it("returns JSON response", async () => {
  await dropExistingTables(testPool);
  const response = await testPool.query(
    "SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
  );

  expect(response.rowCount).toBe(0);
});
