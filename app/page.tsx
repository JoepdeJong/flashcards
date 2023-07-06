import { Course } from '@/types/types';

export default async function Home() {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const courses = await fetcher(`http://localhost:3000/api/course`) as Course[];

  if (!courses.length) return <h2>Loading...</h2>
  
  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <h2>{course.name}</h2>
          <ul>
            {course.lessons.map((lesson) => (
              <li key={lesson.id}>
                <a href={`/lesson/${course.id}/${lesson.id}`}>{lesson.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}