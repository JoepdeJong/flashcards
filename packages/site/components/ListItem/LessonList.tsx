import { Course, Lesson } from "@/types/types";

import styles from "./ListItem.module.scss";
import Link from "next/link";

export const LessonList = ({ course, lessons } : { course: Course, lessons: Lesson[] }) => {
    return (
        <div className={styles.container}>
            {lessons.map((lesson) => (
                <Link key={lesson.id} href={`/lesson/${course.id}/${lesson.id}`} className={styles.item}>
                    {lesson.title}
                </Link>
            ))}
        </div>
    );
}
