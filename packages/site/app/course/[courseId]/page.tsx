import { LessonList } from '@/components/ListItem/LessonList';
import { CourseType } from '@flashcards/core/types/CoureType';
import { LessonType } from '@flashcards/core/types/LessonType';

export default async function LessonPage({params}: {params: { courseId: string }}){
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const course = await fetcher(process.env.NEXT_PUBLIC_API_URL + `/courses/${params.courseId}`) as CourseType;

  if (!course.lessons) return <h2>Loading...</h2>
  
  return (
    <div>
        <h1>{course.title}</h1>
        <h2>Lessons</h2>
        <LessonList course={course} lessons={course.lessons as LessonType[]} />
    </div>
  )
}

// // This function gets called at build time
export async function generateStaticParams() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const courses = await fetcher(process.env.NEXT_PUBLIC_API_URL + `/courses`) as CourseType[];

  return courses.map((course) => ({
    courseId: course.courseId
  }))
}