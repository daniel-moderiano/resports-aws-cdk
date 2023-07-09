import { connectDb } from "@/config";
import { createErrorResponse } from "./apiResonseGenerator";
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
    if (error instanceof Error) {
      return createErrorResponse(
        500,
        "An error occurred while attempting to connect to the database."
      );
    } else {
      return createErrorResponse(500, "An unknown error occurred", {
        error: JSON.stringify(error),
      });
    }
  }
};
