import { upsertUser, deleteUser } from "@/helpers/dbQueryFunctions";
import { UserModel } from "@/models";

// Critical to ensure proper database setup and teardown
import "./mongoTestSetup";

describe("MongoDB User Helper Functions", () => {
  const testUser = {
    _id: "testUser",
    email: "testEmail@test.com",
    email_verified: true,
  };

  beforeEach(async () => {
    const newUser = await upsertUser(testUser);
    if (newUser === null) {
      throw new Error("Error inserting test channel during setup");
    }
  });

  it("should upsert a user", async () => {
    const newUser = await upsertUser({
      _id: "testUser2",
      email: "testEmail2@test.com",
      email_verified: true,
    });

    expect(newUser).toHaveProperty("_id", "testUser2");
    expect(newUser).toHaveProperty("email", "testEmail2@test.com");
    expect(newUser).toHaveProperty("email_verified", true);
  });

  it("should update an existing user", async () => {
    const updatedUser = await upsertUser({
      _id: "testUser",
      email: "updatedEmail@test.com",
      email_verified: false,
    });

    expect(updatedUser).toHaveProperty("_id", "testUser");
    expect(updatedUser).toHaveProperty("email", "updatedEmail@test.com");
    expect(updatedUser).toHaveProperty("email_verified", false);
  });

  it("should delete a user", async () => {
    const deletedUser = await deleteUser(testUser._id);

    expect(deletedUser).toHaveProperty("_id", "testUser");
    expect(deletedUser).toHaveProperty("email", "testEmail@test.com");
    expect(deletedUser).toHaveProperty("email_verified", true);

    const findDeleted = await UserModel.findById(testUser._id);
    expect(findDeleted).toBeNull();
  });

  it("should not delete a non-existing user", async () => {
    const deletedUser = await deleteUser("nonExistentId");

    expect(deletedUser).toBeNull();
  });
});
