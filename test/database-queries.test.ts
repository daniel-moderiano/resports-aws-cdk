import { testPool } from "../config/database";
import {
  deleteUser,
  insertChannel,
  upsertUser,
} from "../helpers/databaseQueries";
import { createNewTables, dropExistingTables } from "../helpers/initdb";
import { Channel, User } from "../types";

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
});

describe("Users table queries", () => {
  beforeAll(async () => {
    await dropExistingTables(testPool);
    await createNewTables(testPool);
  });

  const testUser: User = {
    user_id: "1132424242",
    email: "test@gmail.com",
    email_verified: false,
  };

  const testUserUpdated: User = {
    ...testUser,
    email_verified: true,
  };

  it("inserts a new user into the table", async () => {
    await upsertUser(testPool, testUser);

    const result = await testPool.query(
      "SELECT * FROM users WHERE user_id=$1",
      [testUser.user_id]
    );
    expect(result.rows).toEqual([testUser]);
  });

  it("updates a user that already exists in the table", async () => {
    await upsertUser(testPool, testUserUpdated);

    const result = await testPool.query("SELECT * FROM users");

    expect(result.rows).toEqual([testUserUpdated]);
  });

  it("deletes an existing user", async () => {
    await deleteUser(testPool, testUser.user_id);

    const result = await testPool.query("SELECT * FROM channels");
    expect(result.rowCount).toEqual(0);
  });
});

describe("Saved_channels table queries", () => {
  // TODO
});
