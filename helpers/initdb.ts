import { Client } from "pg";

export const dropExistingTables = async (database: Client) => {
  // Saved channels table connects the other tables, and must be dropped first
  await database.query("DROP TABLE IF EXISTS saved_channels;");
  await database.query("DROP TABLE IF EXISTS channels;");
  await database.query("DROP TABLE IF EXISTS users;");
};

export const createNewTables = async (database: Client) => {
  await database.query(`
      CREATE TABLE IF NOT EXISTS channels (
        channel_id TEXT NOT NULL PRIMARY KEY,
        platform TEXT NOT NULL
      );
    `);

  await database.query(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT UNIQUE NOT NULL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL
      );
    `);

  await database.query(`
      CREATE TABLE IF NOT EXISTS saved_channels (
        username TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        PRIMARY KEY (username, channel_id),
        FOREIGN KEY (username)
          REFERENCES users (username),
        FOREIGN KEY (channel_id)
          REFERENCES channels (channel_id)
      );
    `);
};
