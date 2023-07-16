"use client";

import Link from "next/link"

import { useRouter } from 'next/navigation'

import styles from './Nav.module.scss'

export const Nav = () => {
    // Check if page is course/[courseId]/lesson/[lessonId]
    const router = useRouter()
    
    return (
        <nav className={styles.nav}>
        <ul>
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                {/* <button onClick={() => router.back()}>Back</button> */}
                <a onClick={() => router.back()}>Back</a>
            </li>
        </ul>
        </nav>
    )
}