import { connectDb } from "@/config";
import { createFailResponse } from "./apiResonseGenerator";
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
    return createFailResponse(
      500,
      "An error occurred while attempting to connect to the database."
    );
  }
};
