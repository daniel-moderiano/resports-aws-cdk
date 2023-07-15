import { Channel, User } from "@/types";

export const createSuccessHttpResponse = (
  statusCode: number,
  data: Channel[] | User | null
) => {
  return JSON.stringify({
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: {
      data,
    },
  });
};

export const createErrorHttpResponse = (
  statusCode: number,
  errorMessage: string
) => {
  return JSON.stringify({
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: {
      errorMessage,
    },
  });
};
