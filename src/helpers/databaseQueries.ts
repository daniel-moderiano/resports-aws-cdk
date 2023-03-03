import { Channel, Database, Table, User } from "@/types";

// GENERAL QUERIES

export const selectAllFromTable = async function (
  database: Database,
  tableName: Table
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

// COMPOUND/ADVANCED QUERIES

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

export const safelyRemoveSavedChannel = async (
  database: Database,
  userId: string,
  channelId: string
) => {
  // Must remove the saved channel first, otherwise it will trigger a false positive during filtering in the next step
  const deletedResult = await deleteSavedChannel(database, userId, channelId);

  const channelsSafeToDelete = await filterByAssociatedSavedChannels(database, [
    channelId,
  ]);

  if (channelsSafeToDelete.length === 1) {
    await deleteChannel(database, channelId);
  }

  return deletedResult;
};

export const removeAllUserSavedChannels = async (
  database: Database,
  userId: string
) => {
  type ChannelReturnType = {
    channel_id: string;
  };

  const result = await selectSavedChannelsByUserId(database, userId);

  const userSavedChannels = result.rows.map(
    (channel: ChannelReturnType) => channel.channel_id
  );

  for (let i = 0; i < userSavedChannels.length; i++) {
    await safelyRemoveSavedChannel(database, userId, userSavedChannels[i]);
  }

  return;
};
