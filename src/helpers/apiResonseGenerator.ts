/**
 * Inspired by JSend https://github.com/omniti-labs/jsend with simplifications.
 * "Fail" and "Error" are ultimately treated the same way on the frontend, so they've
 * been combined into a simple "fail with message" type response
 */

export const createSuccessResponse = (
  statusCode: number,
  data: object | null
) => {
  return JSON.stringify({
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "success",
      data: data,
    },
  });
};

export const createFailResponse = (statusCode: number, message: string) => {
  return JSON.stringify({
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "fail",
      message: message,
    },
  });
};
