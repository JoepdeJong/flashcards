import { CourseList } from '@/components/ListItem/CourseList';
import { Course } from '@/types/types';

export default async function Home() {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const courses = await fetcher(process.env.NEXT_PUBLIC_URL + `/api/course`) as Course[];

  if (!courses.length) return <h2>Loading...</h2>
  
  return (
    <div>
      <CourseList courses={courses!} />
    </div>
  )
}