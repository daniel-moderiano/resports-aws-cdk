import { UserDocument } from "@/types";
import mongoose, { Schema } from "mongoose";

const SavedChannelSchema = new Schema(
  {
    channel_id: { type: String, required: true }, // This will be the YouTube or Twitch ID
    platform: { type: String, enum: ["youtube", "twitch"], required: true },
  },
  { _id: false }
); // prevent MongoDB from creating an _id for each subdocument

const UserSchema = new Schema(
  {
    _id: { type: String, required: true }, // This will be the Auth0 ID
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, required: true },
    saved_channels: [SavedChannelSchema],
  },
  {
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
  }
);

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
