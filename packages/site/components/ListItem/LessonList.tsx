import styles from "./ListItem.module.scss";
import Link from "next/link";
import { CourseType } from "@flashcards/core/types/CoureType";
import { LessonType } from "@flashcards/core/types/LessonType";

export const LessonList = ({ course, lessons } : { course: CourseType, lessons: LessonType[] }) => {
    return (
        <div className={styles.container}>
            {lessons.map((lesson) => (
                <Link key={lesson.lessonId} href={`/course/${course.courseId}/lesson/${lesson.lessonId}`} className={styles.item}>
                    {lesson.title}
                </Link>
            ))}
        </div>
    );
}
