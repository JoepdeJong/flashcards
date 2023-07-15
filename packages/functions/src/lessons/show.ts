import { ApiHandler, usePathParams } from "sst/node/api";

import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { checkAuthenticationToken } from "src/middleware/checkAuthenticationToken";
import { ExerciseType, LessonType } from "@flashcards/core/types/LessonType";

const dynamoDb = new DynamoDB.DocumentClient();

export const main = ApiHandler(async (_evt) => {
  
  // // Check if user is authenticated
  // const isAuthenticated = checkAuthenticationToken();

  // if (!isAuthenticated) {
  //   return {
  //     statusCode: 401,
  //     body: `Unauthorized`,
  //   };
  // }

  // Get path parameters
  const {courseId, lessonId} = usePathParams();

  // Get all lessons for a course
  const getLessonsParams = {
    TableName: Table.db.tableName,
    FilterExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `COURSE#${courseId}`,
      ":sk": `LESSON#${lessonId}`,
    },
    ProjectionExpression: "courseId, lessonId, title, exercises",
  };

  const res = await dynamoDb.scan(getLessonsParams).promise();

  if (!res || !res.Items || res.Items.length === 0) {
    return {
      statusCode: 404,
      body: `Lesson not found`,
    };
  }

  let lesson = res.Items[0]
  lesson.exercises = JSON.parse(lesson.exercises) as ExerciseType[];

  return {
    statusCode: 200,
    body: JSON.stringify(lesson),
  };
});
