import { testPool } from "../config/database";
import {
  deleteChannel,
  insertChannel,
  selectAllFromTable,
} from "../helpers/databaseQueries";
import { createNewTables, dropExistingTables } from "../helpers/initdb";
import { Channel } from "../types";

// Reset the database to baseline empty tables
beforeAll(async () => {
  await dropExistingTables(testPool);
  await createNewTables(testPool);
});

afterAll(async () => {
  await testPool.end();
});

describe("Database initialisation", () => {
  beforeAll(async () => {
    await dropExistingTables(testPool);
    await createNewTables(testPool);
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
});

describe("Channel table queries", () => {
  beforeAll(async () => {
    await dropExistingTables(testPool);
    await createNewTables(testPool);
  });

  const testChannel: Channel = {
    channel_id: "1234",
    platform: "twitch",
  };

  it("inserts a new channel into the table", async () => {
    await insertChannel(testPool, testChannel);

    const result = await testPool.query(
      "SELECT * FROM channels WHERE channel_id=$1",
      ["1234"]
    );
    expect(result.rows).toEqual([testChannel]);
  });

  it("does not insert the same channel twice", async () => {
    await insertChannel(testPool, testChannel);

    const result = await testPool.query("SELECT * FROM channels");
    expect(result.rowCount).toEqual(1);
  });

  it("selects all rows from the table", async () => {
    const result = await selectAllFromTable(testPool, "channels");
    expect(result.rowCount).toEqual(1);
  });

  it("deletes an existing channel", async () => {
    await deleteChannel(testPool, "1234");

    const result = await testPool.query("SELECT * FROM channels");
    expect(result.rowCount).toEqual(0);
  });
});
