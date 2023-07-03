// // CHANNEL TABLE QUERIES

// export const insertChannel = async (channel: { _id: string; platform: string }): Promise<ChannelDocument | null> => {
//   return await ChannelModel.findOneAndUpdate({ _id: channel._id }, channel, { upsert: true, new: true });
// };

// export const deleteChannel = async (channelId: string): Promise<ChannelDocument | null> => {
//   return await ChannelModel.findByIdAndDelete(channelId);
// };

// // USER TABLE QUERIES

// export const upsertUser = async (user: { _id: string; email: string; email_verified: boolean }): Promise<UserDocument | null> => {
//   return await UserModel.findOneAndUpdate({ _id: user._id }, user, { upsert: true, new: true });
// };

// export const deleteUser = async (userId: string): Promise<UserDocument | null> => {
//   return await UserModel.findByIdAndDelete(userId);
// };

// // SAVED CHANNELS TABLE QUERIES

// export const selectSavedChannelByUserAndChannel = async (userId: string, channelId: string): Promise<UserDocument | null> => {
//   return await UserModel.findOne({ _id: userId, 'savedChannels.channel': channelId }, { 'savedChannels.$': 1 });
// };

// export const selectSavedChannelsByChannelId = async (channelId: string): Promise<UserDocument[] | null> => {
//   return await UserModel.find({ 'savedChannels.channel': channelId }, { 'savedChannels.$': 1 });
// };

// export const selectSavedChannelsByUserId = async (userId: string): Promise<SavedChannelDocument[] | undefined> => {
//   const user = await UserModel.findById(userId);
//   return user?.savedChannels;
// };

// export const insertSavedChannel = async (userId: string, channelId: string) => {
//   return await UserModel.updateOne({ _id: userId }, { $addToSet: { savedChannels: { channel: channelId } } });
// };

// export const deleteSavedChannel = async (userId: string, channelId: string) => {
//   return await UserModel.updateOne({ _id: userId }, { $pull: { savedChannels: { channel: channelId } } });
// };

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
