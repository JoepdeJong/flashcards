import { LessonType } from "./LessonType";

export type CourseType = {
    userId: string;
    courseId: string;
    title: string;
    lessons: LessonType[];
}