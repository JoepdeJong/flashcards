import { ApiHandler, useJsonBody, usePathParam } from "sst/node/api";

import { checkAuthenticationToken } from "src/middleware/checkAuthenticationToken";

import { LessonType } from "@flashcards/core/types/LessonType"

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


  const courseId = usePathParam("courseId");

  // Get post data from request body
  const lessons: LessonType[] = useJsonBody();

  // courses should be an array
  // each item should have an courseId, userId and title

  if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
    return {
      statusCode: 400,
      body: `Missing required fields`,
    };
  }

  // TODO: check if coures exists
  const isValidArray = lessons.every(
    (item) => item.lessonId && item.title
  );

  if (!isValidArray) {
    return {
      statusCode: 400,
      body: `Lessons is not a valid array`,
    };
  }

  // Validate exercises
  const isValidExercises = lessons.every(
    (lesson) => lesson.exercises && Array.isArray(lesson.exercises) && lesson.exercises.every(
      (exercise) => exercise.exerciseId && exercise.front && exercise.back
    )
  );

  // TODO: check maximum length

  if (!isValidExercises) {
    return {
      statusCode: 400,
      body: `Exercises is not a valid array`,
    };
  }

  // subdivide the courses into chunks of 25
  const chunks = [];
  const chunkSize = 25;
  for (let i = 0; i < lessons.length; i += chunkSize) {
    chunks.push(lessons.slice(i, i + chunkSize));
  }

  // batch write each chunk
  for (const chunk of chunks) {
    await dynamoDb
      .batchWrite({
        RequestItems: {
          [Table.db.tableName]: chunk.map((item) => ({
            PutRequest: {
              Item: {
                PK: `COURSE#${courseId}`,
                SK: `LESSON#${item.lessonId}`,
                lessonId: item.lessonId,
                courseId: courseId,
                title: item.title,
                exercises: JSON.stringify(item.exercises),
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
