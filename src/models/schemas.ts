import mongoose, { Schema } from "mongoose";

const ChannelSchema = new Schema({
  _id: { type: String, required: true },
  platform: { type: String, required: true },
});

const SavedChannelSchema = new Schema({
  channel_id: { type: String, required: true, ref: "Channel" },
});

const UserSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  email_verified: { type: Boolean, required: true },
  savedChannels: [SavedChannelSchema],
});

export const ChannelModel = mongoose.model("Channel", ChannelSchema);
export const UserModel = mongoose.model("User", UserSchema);
