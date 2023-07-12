import { ChannelDocument, UserDocument } from "@/types";
import mongoose, { Schema } from "mongoose";

const ChannelSchema = new Schema(
  {
    _id: { type: String, required: true }, // This will be the YouTube or Twitch ID
    platform: { type: String, enum: ["youtube", "twitch"], required: true },
  },
  {
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
  }
);

const UserSchema = new Schema(
  {
    _id: { type: String, required: true }, // This will be the Auth0 ID
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, required: true },
    saved_channels: [{ type: String, ref: "Channel" }], // An array of references to Channel documents
  },
  {
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
  }
);

export const ChannelModel = mongoose.model<ChannelDocument>(
  "Channel",
  ChannelSchema
);
export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
