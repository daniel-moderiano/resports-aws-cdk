import {
  addSavedChannelForUser,
  getAllSavedChannelsForUser,
  removeOrphanChannel,
  removeSavedChannel,
} from "@/helpers/monogDbHelpers";
import { UserModel, ChannelModel } from "@/models";

// Critical to ensure proper database setup and teardown
import "./mongoTestSetup";

describe("User and Channel helpers", () => {
  let user1Id: string;
  let channelId: string;

  beforeEach(async () => {
    // Create a new user and channel for each test
    const user1 = new UserModel({
      _id: "testUser1",
      email: "user1@example.com",
      email_verified: true,
    });
    const channel = new ChannelModel({
      _id: "testChannel1",
      platform: "youtube",
    });

    user1Id = user1._id;
    channelId = channel._id;

    await user1.save();
    await channel.save();
  });

  it("should add a saved channel for a user", async () => {
    const userWithNewChannel = await addSavedChannelForUser(user1Id, channelId);
    expect(userWithNewChannel.saved_channels[0]._id).toEqual(channelId);
  });

  it("should get all saved channels for a user", async () => {
    await addSavedChannelForUser(user1Id, channelId);
    const savedChannels = await getAllSavedChannelsForUser(user1Id);
    expect(savedChannels[0]._id).toEqual(channelId);
  });

  it("should remove a saved channel from a user", async () => {
    await addSavedChannelForUser(user1Id, channelId);
    await removeSavedChannel(user1Id, channelId);
    const savedChannels = await getAllSavedChannelsForUser(user1Id);
    expect(savedChannels).toHaveLength(0);
  });

  it("should remove an orphan channel", async () => {
    await addSavedChannelForUser(user1Id, channelId);
    await removeSavedChannel(user1Id, channelId);
    await removeOrphanChannel(channelId);
    const channel = await ChannelModel.findById(channelId);
    expect(channel).toBeNull();
  });

  it("should not remove an channel if it is not orphaned", async () => {
    await addSavedChannelForUser(user1Id, channelId);
    await removeOrphanChannel(channelId);
    const channel = await ChannelModel.findById(channelId);
    expect(channel).not.toBeNull();
  });
});
