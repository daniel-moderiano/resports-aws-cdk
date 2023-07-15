import { connectDb } from "@/config";
import { createErrorHttpResponse } from ".";

/**
 * Abstracts the common DB connection operation in lambda handlers.
 *
 * @example
 * ```ts
 * const errorResponse = await handleDbConnection();
 * if (errorResponse) return errorResponse;
 * // Continue with lambda logic if connection was successful...
 * ```
 */
export const handleDbConnection = async () => {
  try {
    await connectDb();
    return null; // returns null when the connection is successful
  } catch (error) {
    return createErrorHttpResponse(
      500,
      "An error occurred while attempting to connect to the database."
    );
  }
};
