import { StackContext, Api, Table, Config } from "sst/constructs";

export function Flashcards({ stack, app }: StackContext) {
  const stage = app.stage;

  const API_AUTH_TOKEN = new Config.Secret(stack, "API_AUTH_TOKEN");


  const table = new Table(stack, "db", {
    fields: {
      PK: "string",
      SK: "string"
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
  });

  const api = new Api(stack, "api", {
    cors: {
      allowOrigins: [stage === "prod" ? "https://flashcards.sjoemelsoftware.nl" : "*"],
      allowMethods: ["GET", "POST"],
      allowHeaders: ["Accept", "Content-Type", "Authorization"]
    },
    routes: {
      "GET /courses": "packages/functions/src/courses/list.main",
      "POST /courses": "packages/functions/src/courses/create.main",
      "GET /courses/{courseId}": "packages/functions/src/courses/show.main",
      "GET /courses/{courseId}/lessons": "packages/functions/src/lessons/list.main",
      "POST /courses/{courseId}/lessons": "packages/functions/src/lessons/create.main",
    },
    defaults: {
      function: {
        bind: [table, API_AUTH_TOKEN],
      },
      throttle: {
        rate: 100,
        burst: 200,
      }
    },
  });

  // const site = new NextjsSite(stack, "site", {
  //   environment: {
  //     NEXT_PUBLIC_API_URL: api.url,
  //   },
  // });

  stack.addOutputs({
    ApiEndpoint: api.url,
    // SiteUrl: site.url,s
  });
}
