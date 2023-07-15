import styles from "./ListItem.module.scss";
import Link from "next/link";
import { CourseType } from "@flashcards/core/types/CoureType";

export const CourseList = ({ courses }: { courses: CourseType[] }) => {
    return (
        <div className={styles.container}>
            {courses.map((course) => (
                <Link key={course.courseId} href={`/course/${course.courseId}`} className={styles.item}>
                    {course.title}
                </Link>
            ))}
        </div>
    );
}
