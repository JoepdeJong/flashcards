import { ApiHandler, usePathParam } from "sst/node/api";

import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { checkAuthenticationToken } from "src/middleware/checkAuthenticationToken";
import { CourseType } from "@flashcards/core/types/CoureType";
import { LessonType } from "@flashcards/core/types/LessonType";

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
  const courseId = usePathParam("courseId");

  const getCourseParams = {
    TableName: Table.db.tableName,
    FilterExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `COURSE#${courseId}`,
      ":sk": "USER#"
    },
    ProjectionExpression: "courseId, userId, title"
  };
  
  const res = await dynamoDb.scan(getCourseParams).promise();

  if (!res || !res.Items || res.Items.length === 0) {
    return {
      statusCode: 404,
      body: `Course not found`,
    };
  }

  let course = res.Items[0] as CourseType;

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

  if (lessons && lessons.Items) {
    course.lessons = lessons.Items as LessonType[];
  }

  return {
    statusCode: 200,
    body: JSON.stringify(course),
  };



  
});
