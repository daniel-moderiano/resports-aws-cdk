import { Channel, Database, User } from "../types";

// GENERAL QUERIES

export const selectAllFromTable = async function (
  database: Database,
  tableName: string
) {
  return database.query(`SELECT * FROM ${tableName}`);
};

// CHANNEL TABLE QUERIES

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

// USER TABLE QUERIES

export const upsertUser = async (database: Database, user: User) => {
  return database.query(
    "INSERT INTO users (user_id, email, email_verified) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET email_verified = $3",
    [user.user_id, user.email, user.email_verified]
  );
};

export const deleteUser = async (database: Database, userId: string) => {
  return database.query("DELETE FROM users WHERE user_id=$1", [userId]);
};

// SAVED CHANNELS TABLE QUERIES

export const selectSavedChannelByUserAndChannel = async (
  database: Database,
  userId: string,
  channelId: string
) => {
  return database.query(
    "SELECT * FROM saved_channels WHERE user_id=$1 AND channel_id=$2",
    [userId, channelId]
  );
};

export const selectSavedChannelsByChannelId = async (
  database: Database,
  channelId: string
) => {
  return database.query("SELECT * FROM saved_channels WHERE channel_id=$1", [
    channelId,
  ]);
};

export const selectSavedChannelsByUserId = async (
  database: Database,
  userId: string
) => {
  return database.query(
    "SELECT channel_id FROM saved_channels WHERE user_id=$1",
    [userId]
  );
};

export const insertSavedChannel = async (
  database: Database,
  userId: string,
  channelId: string
) => {
  return database.query(
    "INSERT INTO saved_channels (user_id, channel_id) VALUES ($1, $2) ON CONFLICT (user_id, channel_id) DO NOTHING",
    [userId, channelId]
  );
};

export const deleteSavedChannel = async (
  database: Database,
  userId: string,
  channelId: string
) => {
  return database.query(
    "DELETE FROM saved_channels WHERE user_id=$1 AND channel_id=$2",
    [userId, channelId]
  );
};

// COMPOUND QUERIES

export const filterByAssociatedSavedChannels = async (
  database: Database,
  channelIds: string[]
) => {
  const channelsWithNoAssociatedSavedChannel: string[] = [];
  for (let i = 0; i < channelIds.length; i++) {
    const result = await selectSavedChannelsByChannelId(
      database,
      channelIds[i]
    );
    if (result.rowCount === 0) {
      channelsWithNoAssociatedSavedChannel.push(channelIds[i]);
    }
  }

  return channelsWithNoAssociatedSavedChannel;
};

// TODO: When deleting a saved channel, check if any other saved channels reference that channel_id of the deleted saved channel. If no other references exist, the channel should be deleted from the channels table

export const safelyRemoveSavedChannel = async (
  database: Database,
  userId: string,
  channelId: string
) => {
  return;
};

// TODO: When deleting a user, all of the user's saved channels should be deleted. For each channel deleted, we should check for any further saved channels referencing that channel_id, and if none exist, it should be removed.
