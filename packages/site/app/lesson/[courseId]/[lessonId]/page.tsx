import Main from '@/components/Main';
import { Lesson } from '@/types/types';

export default async function LessonPage({params}: {params: { courseId: string, lessonId: string }}){
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const lesson = await fetcher(process.env.NEXT_PUBLIC_URL + `/api/lesson/${params.courseId}/${params.lessonId}`) as Lesson;

  if (!lesson.exercises) return <h2>Loading...</h2>
  
  return <Main data={lesson.exercises} />
}