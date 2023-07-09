import { ChannelModel, PopulatedUserDocument, UserModel } from "@/models";
import { ChannelDocument, UserDocument } from "@/models";
import { Document } from "mongoose";
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

export const addSavedChannelForUser = async (
  userId: string,
  channelId: string
): Promise<PopulatedUserDocument> => {
  const channel = await ChannelModel.findById(channelId);
  if (!channel) {
    throw new Error("Channel does not exist");
  }

  const user = (await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { saved_channels: channelId } },
    { new: true }
  ).populate("saved_channels")) as PopulatedUserDocument | null;

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllSavedChannelsForUser = async (
  userId: string
): Promise<ChannelDocument[]> => {
  const user = (await UserModel.findById(userId).populate(
    "saved_channels"
  )) as PopulatedUserDocument | null;
  return user ? user.saved_channels : [];
};

// Function to remove the channel from a user's saved channels
export const removeSavedChannel = async (userId: string, channelId: string) => {
  return UserModel.updateOne(
    { _id: userId },
    { $pull: { saved_channels: channelId } }
  );
};

export const removeOrphanChannel = async (channelId: string) => {
  // Check if any other users still have this channel in their saved channels
  const user = await UserModel.findOne({ saved_channels: channelId });

  // If no user has this channel in their saved channels, delete the channel
  if (!user) {
    await ChannelModel.findByIdAndDelete(channelId);
  }
};
