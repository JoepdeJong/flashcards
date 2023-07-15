import { ApiHandler, usePathParam } from "sst/node/api";

import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { checkAuthenticationToken } from "src/middleware/checkAuthenticationToken";

const dynamoDb = new DynamoDB.DocumentClient();

export const main = ApiHandler(async (_evt) => {
  
  // Check if user is authenticated
  const isAuthenticated = checkAuthenticationToken();

  if (!isAuthenticated) {
    return {
      statusCode: 401,
      body: `Unauthorized`,
    };
  }

  // Get path parameters
  const courseId = usePathParam("courseId");

  // Get all lessons for a course
  const getLessonsParams = {
    TableName: Table.db.tableName,
    FilterExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `COURSE#${courseId}`,
      ":sk": "LESSON#",
    },
    ProjectionExpression: "courseId, lessonId, title, exercises",
  };

  const lessons = await dynamoDb.scan(getLessonsParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(lessons.Items),
  };
});
