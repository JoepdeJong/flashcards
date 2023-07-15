import { Course } from "@/types/types";

import styles from "./ListItem.module.scss";
import Link from "next/link";

export const CourseList = ({ courses }: { courses: Course[] }) => {
    return (
        <div className={styles.container}>
            {courses.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`} className={styles.item}>
                    {course.name}
                </Link>
            ))}
        </div>
    );
}
