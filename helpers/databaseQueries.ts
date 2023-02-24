import { Channel, Database } from "../types";

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
