import { APIGatewayProxyEventV2, Context } from "aws-lambda";

// Sourced directly from an AWS Gateway Proxy event in the docs
export const mockEvent: APIGatewayProxyEventV2 = {
  version: "2.0",
  routeKey: "$default",
  rawPath: "/my/path",
  rawQueryString: "parameter1=value1&parameter1=value2&parameter2=value",
  cookies: ["cookie1", "cookie2"],
  headers: {
    header1: "value1",
    header2: "value1,value2",
    Authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRiNmtnZjNLQm5LNnUtZkpZbnhsTSJ9.eyJpc3MiOiJodHRwczovL2Rldi1jMHliNWNyNy51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDM0MTMxNTYzNTQ3NjI1MjA3NjkiLCJhdWQiOlsiaHR0cHM6Ly9hdXRoMC1qd3QtYXV0aG9yaXplciIsImh0dHBzOi8vZGV2LWMweWI1Y3I3LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2OTQwNzM1MDIsImV4cCI6MTY5NDE1OTkwMiwiYXpwIjoibUp2YjlhNnJCY1VGRzlVbmtMRHd0OE9EeUNBQ1lGc0kiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.wKmHHii2vfWmPkyu5ZeSipSyevcU_-I3xF3IYgZlo3zvMspwCkXgw3cxRxIZZkZDsihwQR2FEHDL6otNmAs05gy8QpdIZG_POD1svNPvLRXJu51s3Neoq27UYVdqzc4I__oRahzdeJ5JQ6iXxtsd3g0td36b_gD1BY2MdnvFT4RFHjH6CjpVZVSd_vs9UYhVCkbJ_JQxypw6hO2nwn7XPuhDxca5F7PUR6WvjGATrrDkGKoq9vtJY80hyoDZbHcoiml6wXnE8HItejP6UeSCMYDxnletdjd7TXWTsXp19kuFkHoLB81CNKDKySJgSpVHTGNHJuZMOct2tlTeKJTBvA",
  },
  queryStringParameters: {
    parameter1: "value1,value2",
    parameter2: "value",
  },
  requestContext: {
    accountId: "123456789012",
    apiId: "api-id",
    authentication: {
      clientCert: {
        clientCertPem: "CERT_CONTENT",
        subjectDN: "www.example.com",
        issuerDN: "Example issuer",
        serialNumber: "a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1",
        validity: {
          notBefore: "May 28 12:30:02 2019 GMT",
          notAfter: "Aug  5 09:36:04 2021 GMT",
        },
      },
    },
    domainName: "id.execute-api.us-east-1.amazonaws.com",
    domainPrefix: "id",
    http: {
      method: "POST",
      path: "/my/path",
      protocol: "HTTP/1.1",
      sourceIp: "192.0.2.1",
      userAgent: "agent",
    },
    requestId: "id",
    routeKey: "$default",
    stage: "$default",
    time: "12/Mar/2020:19:03:58 +0000",
    timeEpoch: 1583348638390,
  },
  body: "Hello from Lambda",
  pathParameters: {
    parameter1: "value1",
  },
  isBase64Encoded: false,
  stageVariables: {
    stageVariable1: "value1",
    stageVariable2: "value2",
  },
};

export const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: "",
  getRemainingTimeInMillis: () => 0,
  done: jest.fn,
  fail: jest.fn,
  succeed: jest.fn,
};

export const mockCallback = () => {
  return;
};
