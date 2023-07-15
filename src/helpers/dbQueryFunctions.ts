import { UserModel } from "@/models";
import { Channel, User } from "@/types";
import mongoose, { QueryOptions } from "mongoose";

/**
 * Upsert a user in the database.
 *
 * @param user User data to with which to upsert DB user with
 * @returns The upserted user document.
 */
export const upsertUser = async (user: Omit<User, "saved_channels">) => {
  return UserModel.findOneAndUpdate({ _id: user._id }, user, {
    upsert: true,
    new: true,
  });
};

/**
 * Delete a user from the database.
 *
 * @param userId - The ID of the user to delete.
 * @param session - Optional mongoose client session. Useful if
 * performing deletion as part of a transaction
 * @returns The deleted user document.
 */
export const deleteUser = async (
  userId: string,
  session: mongoose.mongo.ClientSession | null = null
) => {
  const options: QueryOptions = session ? { session } : {};
  return UserModel.findByIdAndDelete(userId, options);
};

/**
 * Add a saved channel for a user.
 *
 * @param userId - The ID of the user to add a channel for.
 * @param channel - The data of the channel to add.
 * @returns The user document after adding the channel.
 */
export const addSavedChannel = async (userId: string, channel: Channel) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const channelExists = user.saved_channels.some(
    (existingChannel) => existingChannel.channel_id === channel.channel_id
  );

  if (!channelExists) {
    user.saved_channels.push(channel);
    await user.save();
  }

  return user;
};

/**
 * Get all saved channels for a user.
 *
 * @param userId - The ID of the user to retrieve channels for.
 * @returns The saved channels of the user.
 */
export const getSavedChannels = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");
  return user.saved_channels;
};

/**
 * Remove a saved channel for a user.
 *
 * @param userId - The ID of the user to remove a channel for.
 * @param channelId - The ID of the channel to remove.
 * @returns The user document after removing the channel.
 */
export const deleteSavedChannel = async (userId: string, channelId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  user.saved_channels = user.saved_channels.filter(
    (channel) => channel.channel_id !== channelId
  );
  await user.save();

  return user;
};
