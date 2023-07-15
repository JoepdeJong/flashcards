"use client";

import { CourseList } from '@/components/ListItem/CourseList';
import { CourseType } from "@flashcards/core/types/CoureType"

export default async function Home() {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const courses = await fetcher(process.env.NEXT_PUBLIC_API_URL + `/courses`) as CourseType[];

  if (!courses.length) return <h2>Loading...</h2>
  
  return (
    <div>
      <CourseList courses={courses!} />
    </div>
  )
}