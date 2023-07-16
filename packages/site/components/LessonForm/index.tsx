"use client";

import { useState } from "react";

import { ExerciseType, LessonType } from "@flashcards/core/types/LessonType";

import { v4 } from 'uuid';

export const LessonForm = ({ setLesson }: { setLesson: (lesson: LessonType) => void }) => {
    const [courseId, setCourseId] = useState('');
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    // Show a textbox for input. Allow typing CSV in the textbox. Look for columns: front and back, and optional columns: front_hint and back_hint

    const hasFront = value.split('\n')[0].split(',').includes('front');
    const hasBack = value.split('\n')[0].split(',').includes('back');
    

    const checkCSV = () => {
        // Check if CSV is valid
        // Check if CSV has required columns
        
        if (!hasFront || !hasBack) {
            return false;
        }

        // Check if every row has the same number of columns
        let rows = value.split('\n');

        // Trim last row if it's empty
        if (rows[rows.length - 1] === '') {
            rows = rows.slice(0, rows.length - 1);
        }

        const numColumns = rows[0].split(',').length;

        for (let i = 1; i < rows.length; i++) {
            if (rows[i].split(',').length !== numColumns) {
                alert('Row ' + i + ' has a different number of columns than the first row');
                return false;
            }
        }

        return true;
    }

    const constCSVToExerciseType = (csv: string) : ExerciseType[] => {
        // Convert CSV to ExerciseType
        let rows = csv.split('\n');

        // Trim last row if it's empty
        if (rows[rows.length - 1] === '') {
            rows = rows.slice(0, rows.length - 1);
        }

        const numColumns = rows[0].split(',');

        const front_column_index = numColumns.indexOf('front');
        const back_column_index = numColumns.indexOf('back');
        const front_hint_column_index = numColumns.indexOf('front_hint');
        const back_hint_column_index = numColumns.indexOf('back_hint');

        let exercises: ExerciseType[] = [];

        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            let exercise: ExerciseType = {
                exerciseId: v4(),
                front: columns[front_column_index],
                back: columns[back_column_index],
            }

            if (front_hint_column_index !== -1) {
                exercise.front_hint = columns[front_hint_column_index];
            }

            if (back_hint_column_index !== -1) {
                exercise.back_hint = columns[back_hint_column_index];
            }

            exercises.push(exercise);
        }

        return exercises;
    }



        



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!checkCSV()) {
            alert('Invalid CSV');
            return;
        }

        if (courseId === '') {
            alert('CourseId is required');
            return;
        }

        if (title === '') {
            alert('Title is required');
            return;
        }

        const exercises = constCSVToExerciseType(value);

        const lessonId = v4();

        const lesson: LessonType = {
            lessonId,
            courseId,
            title,
            exercises,
        }

        console.log(lesson);
        setLesson(lesson);

    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Lesson</h1>
            <p>
            <label>
                CourseId:
                <input type="text" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
            </label>
            </p>
            <p>
            <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            </p>
            <p>
            <label>
                CSV:
                <textarea value={value} onChange={(e) => setValue(e.target.value)} cols={50} rows={30} />
            </label>
            </p>
            <br />
            <p>Required columns: front back</p>
            <p>Optional columns: front_hint back_hint</p>
            <p>Missing columns: {hasFront ? '' : 'front '} {hasBack ? '' : 'back '}</p>
            <input type="submit" value="Submit"/>
        </form>
    )
}