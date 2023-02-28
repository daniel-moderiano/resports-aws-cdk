import { testPool } from "../config/database";
import {
  deleteSavedChannel,
  deleteUser,
  filterByAssociatedSavedChannels,
  insertChannel,
  insertSavedChannel,
  safelyRemoveSavedChannel,
  selectAllFromTable,
  selectSavedChannelByUserAndChannel,
  selectSavedChannelsByChannelId,
  selectSavedChannelsByUserId,
  upsertUser,
} from "../helpers/databaseQueries";
import { createNewTables, dropExistingTables } from "../helpers/initdb";
import { Channel, SavedChannel, User } from "../types";

// Reset the database to baseline empty tables
beforeAll(async () => {
  await dropExistingTables(testPool);
  await createNewTables(testPool);
});

afterAll(async () => {
  await testPool.end();
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

const testChannel: Channel = {
  channel_id: "1234",
  platform: "twitch",
};

const testSavedChannel: SavedChannel = {
  user_id: "1132424242",
  channel_id: "1234",
};

const secondChannel: Channel = {
  channel_id: "5678",
  platform: "youtube",
};

const secondUser: User = {
  user_id: "6543754732",
  email: "example@gmail.com",
  email_verified: true,
};

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
  beforeAll(async () => {
    await dropExistingTables(testPool);
    await createNewTables(testPool);

    // Inserting saved channels requires existing foreign keys for user and channel IDs
    await insertChannel(testPool, testChannel);
    await upsertUser(testPool, testUser);
  });

  it("inserts a new saved channel into the table", async () => {
    await insertSavedChannel(
      testPool,
      testSavedChannel.user_id,
      testSavedChannel.channel_id
    );

    const result = await testPool.query("SELECT * FROM saved_channels");
    expect(result.rows).toEqual([testSavedChannel]);
  });

  it("selects a single channel from the table using composite key", async () => {
    const result = await selectSavedChannelByUserAndChannel(
      testPool,
      testSavedChannel.user_id,
      testSavedChannel.channel_id
    );

    expect(result.rows).toEqual([testSavedChannel]);
  });

  it("selects a single channel from the table using channel ID", async () => {
    const result = await selectSavedChannelsByChannelId(
      testPool,
      testSavedChannel.channel_id
    );

    expect(result.rows).toEqual([testSavedChannel]);
  });

  it("does not insert duplicate saved channels", async () => {
    await insertSavedChannel(
      testPool,
      testSavedChannel.user_id,
      testSavedChannel.channel_id
    );

    const result = await testPool.query("SELECT * FROM saved_channels");
    expect(result.rowCount).toEqual(1);
  });

  it("inserts new saved channel when user_id is unique but channel_id is not", async () => {
    // Insert a unique user
    await upsertUser(testPool, secondUser);

    await insertSavedChannel(
      testPool,
      secondUser.user_id,
      testChannel.channel_id
    );

    const result = await selectSavedChannelByUserAndChannel(
      testPool,
      secondUser.user_id,
      testChannel.channel_id
    );

    expect(result.rowCount).toBe(1);
  });

  it("inserts new saved channel when channel_id is unique but user_id is not", async () => {
    // Insert a unique channel
    await insertChannel(testPool, secondChannel);

    await insertSavedChannel(
      testPool,
      testUser.user_id,
      secondChannel.channel_id
    );

    const result = await selectSavedChannelByUserAndChannel(
      testPool,
      testUser.user_id,
      secondChannel.channel_id
    );

    expect(result.rowCount).toBe(1);
  });

  it("selects all saved channels belonging to a single user", async () => {
    const result = await selectSavedChannelsByUserId(
      testPool,
      testUser.user_id
    );

    expect(result.rows).toEqual([
      { channel_id: testChannel.channel_id },
      { channel_id: secondChannel.channel_id },
    ]);
  });

  it("deletes a saved channel", async () => {
    const result = await deleteSavedChannel(
      testPool,
      secondUser.user_id,
      testChannel.channel_id
    );

    expect(result.rowCount).toBe(1);
  });
});

describe("Compound and advanced queries", () => {
  beforeAll(async () => {
    await dropExistingTables(testPool);
    await createNewTables(testPool);

    // Inserting saved channels requires existing foreign keys for user and channel IDs
    await insertChannel(testPool, testChannel);
    await upsertUser(testPool, testUser);
  });

  it("returns a single channel ID that does not exist in the saved channels table", async () => {
    const result = await filterByAssociatedSavedChannels(testPool, [
      secondChannel.channel_id,
    ]);

    expect(result).toEqual([secondChannel.channel_id]);
  });

  it("filters out a single channel ID that still exists in the saved channels table", async () => {
    await insertSavedChannel(
      testPool,
      testSavedChannel.user_id,
      testSavedChannel.channel_id
    );

    const result = await filterByAssociatedSavedChannels(testPool, [
      testSavedChannel.channel_id,
    ]);

    expect(result).toEqual([]);
  });

  it("handles a mixed input of channel IDs", async () => {
    await insertSavedChannel(
      testPool,
      testSavedChannel.user_id,
      testSavedChannel.channel_id
    );

    const result = await filterByAssociatedSavedChannels(testPool, [
      testSavedChannel.channel_id,
      secondChannel.channel_id,
    ]);

    expect(result).toEqual([secondChannel.channel_id]);
  });

  it("removes saved channel and safely removes associated channel", async () => {
    await safelyRemoveSavedChannel(
      testPool,
      testSavedChannel.user_id,
      testSavedChannel.channel_id
    );

    const channelsResult = await selectAllFromTable(testPool, "channels");
    const savedChannelsResult = await selectAllFromTable(
      testPool,
      "saved_channels"
    );

    expect(channelsResult.rowCount).toBe(0);
    expect(savedChannelsResult.rowCount).toBe(0);
  });

  it("removes saved channel but leaves channel intact when it is referenced in other saved channels", async () => {
    await upsertUser(testPool, testUser);
    await upsertUser(testPool, secondUser);
    await insertChannel(testPool, testChannel);

    await insertSavedChannel(
      testPool,
      testUser.user_id,
      testChannel.channel_id
    );

    await insertSavedChannel(
      testPool,
      secondUser.user_id,
      testChannel.channel_id
    );

    await safelyRemoveSavedChannel(
      testPool,
      testUser.user_id,
      testChannel.channel_id
    );

    const channelsResult = await selectAllFromTable(testPool, "channels");
    const savedChannelsResult = await selectSavedChannelByUserAndChannel(
      testPool,
      testUser.user_id,
      testChannel.channel_id
    );

    expect(channelsResult.rowCount).toBe(1);
    expect(savedChannelsResult.rowCount).toBe(0);
  });
});
