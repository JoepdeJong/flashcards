"use client";

import { LessonForm } from '@/components/LessonForm';
import Main from '@/components/Main';
import { LessonType } from '@flashcards/core/types/LessonType';
import { useState } from 'react';

export default function CSVPage({params}: {params: { courseId: string }}){
  const [lesson, setLesson] = useState<LessonType>();

  if (!lesson) return <LessonForm setLesson={setLesson} />
  
  const exercises = lesson.exercises;
  return <Main data={exercises} />
}
