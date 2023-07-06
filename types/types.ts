export interface Exercise extends Definition {
    // id: string
    tries: number,
    correct: number,
    status: 'unlearned' | 'learning' | 'learned'
}

export type Definition = {
    front: Word[],
    back: Word[]
}

export type Word = {
    word: string
    hint?: string
}


export type Course = {
    id: string,
    name: string,
    lessons: Lesson[] | CSVLesson[],
    mapping: CourseMapping
}

export type CourseMapping = {
    front: CourseMappingDefinition[],
    back: CourseMappingDefinition[]
}

export type CourseMappingDefinition = {
    word: string,
    hint?: string
}

export type Lesson = {
    id: string,
    title: string,
    exercises: Exercise[]
}

export type CSVLesson = {
    id: string,
    title: string,
    filename: string
}