import Main from '@/components/Main';
import { CourseType } from '@flashcards/core/types/CoureType';
import { LessonType } from '@flashcards/core/types/LessonType';

export default async function LessonPage({params}: {params: { courseId: string, lessonId: string }}){
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const lesson = await fetcher(process.env.NEXT_PUBLIC_API_URL + `/courses/${params.courseId}/lessons/${params.lessonId}`) as LessonType;

  if (!lesson.exercises) return <h2>Loading...</h2>
  
  return <Main data={lesson.exercises} />
}

// // This function gets called at build time
export async function generateStaticParams() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const courses = await fetcher(process.env.NEXT_PUBLIC_API_URL + `/courses`) as CourseType[];

  let courseLessons: {courseId: string, lessonId: string}[] = [];

  await Promise.all(courses.map(async (course) => {
    const courseData = await fetcher(process.env.NEXT_PUBLIC_API_URL + `/courses/${course.courseId}`) as CourseType;
    courseData.lessons.forEach((lesson) => {
      courseLessons.push({ courseId: course.courseId, lessonId: lesson.lessonId });
    });
  }));

  return courseLessons;
}