import { ApiHandler, useJsonBody } from "sst/node/api";

import { checkAuthenticationToken } from "src/middleware/checkAuthenticationToken";

import { CourseType } from "@flashcards/core/types/CoureType"

import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

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

  // Get post data from request body
  const courses: CourseType[] = useJsonBody();

  // courses should be an array
  // each item should have an courseId, userId and title

  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    return {
      statusCode: 400,
      body: `Missing required fields`,
    };
  }
  const isValidArray = courses.every(
    (item) => item.courseId && item.userId && item.title
  );

  if (!isValidArray) {
    return {
      statusCode: 400,
      body: `is not a valid array`,
    };
  }

  // subdivide the courses into chunks of 25
  const chunks = [];
  const chunkSize = 25;
  for (let i = 0; i < courses.length; i += chunkSize) {
    chunks.push(courses.slice(i, i + chunkSize));
  }

  // batch write each chunk
  for (const chunk of chunks) {
    await dynamoDb
      .batchWrite({
        RequestItems: {
          [Table.db.tableName]: chunk.map((item) => ({
            PutRequest: {
              Item: {
                PK: `user#${item.userId}`,
                SK: `course#${item.courseId}`,
                ...item,
              },
            },
          })),
        },
      })
      .promise();
  }
  return {
    body: `success`,
    statusCode: 200,
  };
});
