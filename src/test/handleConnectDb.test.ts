import { createErrorHttpResponse, handleDbConnection } from "@/helpers";
import { connectDb } from "@/config";

jest.mock("@/config/mongo");

describe("DB Handler", () => {
  it("should return null when connection to the database is successful", async () => {
    (connectDb as jest.Mock).mockResolvedValue(undefined);
    const result = await handleDbConnection();
    expect(result).toBeNull();
  });

  it("should return an error response when connection fails", async () => {
    (connectDb as jest.Mock).mockRejectedValue(new Error());
    const result = await handleDbConnection();
    expect(result).toEqual(
      createErrorHttpResponse(
        500,
        "An error occurred while attempting to connect to the database."
      )
    );
  });
});
