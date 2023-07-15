export type LessonType = {
    courseId: string;
    lessonId: string;
    title: string;
    exercises: ExerciseType[];
}

export type ExerciseType = {
    exerciseId: string;
    front: string;
    front_hint?: string;
    back: string;
    back_hint?: string;
    status?: 'unlearned' | 'learning' | 'learned';
}

