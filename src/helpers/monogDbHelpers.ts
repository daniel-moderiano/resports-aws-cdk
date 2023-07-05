import { ChannelModel, UserModel } from "@/models";
import { SavedChannel } from "@/types";
import { Document } from "mongoose";

// Mongo document types
interface ChannelDocument extends Document {
  _id: string;
  platform: string;
}

interface UserDocument extends Document {
  _id: string;
  email: string;
  email_verified: boolean;
  saved_channels: SavedChannel[];
}

export interface SavedChannelDocument extends Document {
  channel_id: string;
}

export const insertChannel = async (channel: {
  _id: string;
  platform: string;
}): Promise<ChannelDocument | null> => {
  return ChannelModel.findOneAndUpdate({ _id: channel._id }, channel, {
    upsert: true,
    new: true,
  });
};

export const deleteChannel = async (
  channelId: string
): Promise<ChannelDocument | null> => {
  return ChannelModel.findByIdAndDelete(channelId);
};

// USER TABLE QUERIES

export const upsertUser = async (user: {
  _id: string;
  email: string;
  email_verified: boolean;
}): Promise<UserDocument | null> => {
  return UserModel.findOneAndUpdate({ _id: user._id }, user, {
    upsert: true,
    new: true,
  });
};

export const deleteUser = async (
  userId: string
): Promise<UserDocument | null> => {
  return UserModel.findByIdAndDelete(userId);
};

// SAVED CHANNELS TABLE QUERIES

export const selectSavedChannelsByUserId = async (
  userId: string
): Promise<SavedChannelDocument[] | null> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    return null;
  }
  return user.savedChannels;
};

export const insertSavedChannel = async (userId: string, channelId: string) => {
  return UserModel.updateOne(
    { _id: userId },
    { $addToSet: { savedChannels: { channel_id: channelId } } }
  );
};

export const deleteSavedChannel = async (userId: string, channelId: string) => {
  return UserModel.updateOne(
    { _id: userId },
    { $pull: { savedChannels: { channel_id: channelId } } }
  );
};

// // COMPOUND/ADVANCED QUERIES

// export const filterByAssociatedSavedChannels = async (channelIds: string[]): Promise<string[]> => {
//   const channelsWithNoAssociatedSavedChannel: string[] = [];
//   for (let i = 0; i < channelIds.length; i++) {
//     const result = await selectSavedChannelsByChannelId(channelIds[i]);
//     if (!result || result.length === 0) {
//       channelsWithNoAssociatedSavedChannel.push(channelIds[i]);
//     }
//   }

//   return channelsWithNoAssociatedSavedChannel;
// };

// export const safelyRemoveSavedChannel = async (userId: string, channelId: string) => {
//   await deleteSavedChannel(userId, channelId);

//   const channelsSafeToDelete = await filterByAssociatedSavedChannels([channelId]);

//   if (channelsSafeToDelete.length === 1) {
//     await deleteChannel(channelId);
//   }

//   return;
// };

// export const removeAllUserSavedChannels = async (userId: string) => {
//   const user = await UserModel.findById(userId);
//   if (!user) throw new Error('User not found');

//   for (let i = 0; i < user.savedChannels.length; i++) {
//     await safelyRemoveSavedChannel(userId, user.savedChannels[i].channel_id);
//   }
// };
