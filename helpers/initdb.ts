import { Client, Pool } from "pg";

export const dropExistingTables = async (database: Client | Pool) => {
  // Saved channels table connects the other tables, and must be dropped first
  await database.query("DROP TABLE IF EXISTS saved_channels;");
  await database.query("DROP TABLE IF EXISTS channels;");
  await database.query("DROP TABLE IF EXISTS users;");
};

export const createNewTables = async (database: Client | Pool) => {
  await database.query(`
      CREATE TABLE IF NOT EXISTS channels (
        channel_id TEXT NOT NULL PRIMARY KEY,
        platform TEXT NOT NULL
      );
    `);

  await database.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT UNIQUE NOT NULL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        email_verified BOOLEAN NOT NULL
      );
    `);

  await database.query(`
      CREATE TABLE IF NOT EXISTS saved_channels (
        user_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        PRIMARY KEY (user_id, channel_id),
        FOREIGN KEY (user_id)
          REFERENCES users (user_id),
        FOREIGN KEY (channel_id)
          REFERENCES channels (channel_id)
      );
    `);
};
