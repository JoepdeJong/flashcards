import { ApiHandler } from "sst/node/api";

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

  // Get all courses
  const getCoursesParams = {
    TableName: Table.db.tableName,
    FilterExpression: "begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":sk": "course#",
    },
    ProjectionExpression: "courseId, userId, title",
  };

  const courses = await dynamoDb.scan(getCoursesParams).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(courses.Items),
  };
});
