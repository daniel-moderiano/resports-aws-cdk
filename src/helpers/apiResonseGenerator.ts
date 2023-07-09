// Inspired by JSend https://github.com/omniti-labs/jsend

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

export const createFailResponse = (statusCode: number, data: object) => {
  return JSON.stringify({
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "fail",
      data: data,
    },
  });
};

export const createErrorResponse = (
  statusCode: number,
  message: string,
  data: object = {}
) => {
  return JSON.stringify({
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "error",
      message: message,
      data,
    },
  });
};
