import { LessonList } from '@/components/ListItem/LessonList';
import { Course, Lesson } from '@/types/types';

export default async function LessonPage({params}: {params: { courseId: string }}){
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const courses = await fetcher(process.env.NEXT_PUBLIC_URL + `/api/course/${params.courseId}`) as Course;

  if (!courses.lessons) return <h2>Loading...</h2>
  
  return (
    <div>
        <h1>{courses.name}</h1>
        <h2>Lessons</h2>
        <LessonList course={courses} lessons={courses.lessons as Lesson[]} />
    </div>
  )
}