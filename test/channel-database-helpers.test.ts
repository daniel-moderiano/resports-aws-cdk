import { testPool } from "../config/database";
import { insertChannel } from "../helpers/databaseQueries";
import { createNewTables, dropExistingTables } from "../helpers/initdb";

// Reset the database to baseline empty tables
beforeAll(async () => {
  await dropExistingTables(testPool);
  await createNewTables(testPool);
});

afterAll(async () => {
  await testPool.end();
});

it("inserts a new channel into the table", async () => {
  await insertChannel(testPool, {
    channel_id: "1234",
    platform: "twitch",
  });

  const result = await testPool.query(
    "SELECT * FROM channels WHERE channel_id=$1",
    ["1234"]
  );
  expect(result.rows).toEqual([{ channel_id: "1234", platform: "twitch" }]);
});

it("does not insert the same channel twice", async () => {
  await insertChannel(testPool, {
    channel_id: "1234",
    platform: "twitch",
  });

  const result = await testPool.query("SELECT * FROM channels");
  expect(result.rowCount).toEqual(1);
});
