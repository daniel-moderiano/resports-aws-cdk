import { Channel, Database, User } from "../types";

export const selectAllFromTable = async function (
  database: Database,
  tableName: string
) {
  return database.query(`SELECT * FROM ${tableName}`);
};

export const insertChannel = async (database: Database, channel: Channel) => {
  return database.query(
    "INSERT INTO channels (channel_id, platform) VALUES ($1, $2) ON CONFLICT (channel_id) DO NOTHING",
    [channel.channel_id, channel.platform]
  );
};

export const deleteChannel = async (database: Database, channelId: string) => {
  return database.query("DELETE FROM channels WHERE channel_id=$1", [
    channelId,
  ]);
};

export const deleteUser = async (database: Database, userId: string) => {
  return database.query("DELETE FROM users WHERE user_id=$1", [userId]);
};

export const upsertUser = async (database: Database, user: User) => {
  return database.query(
    "INSERT INTO users (user_id, email, email_verified) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET email_verified = $3",
    [user.user_id, user.email, user.email_verified]
  );
};
