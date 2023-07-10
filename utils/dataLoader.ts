import { CSVLesson, Course, CourseMapping, CourseMappingDefinition, Definition, Exercise, Lesson } from '@/types/types';
import csv from 'csv-parser';
import fs from 'fs';

export const loadDefinitionsFromCSV = async (mapping: CourseMapping, csvLesson: CSVLesson): Promise<Definition[]> => {
    const definitions: Definition[] = [];

    

    const promise = new Promise((resolve, reject) => {
        // Process rows as numbers do not use headers option
        fs.createReadStream(`data/${csvLesson.filename}`)
          .pipe(csv())
          .on('data', (row) => {
            row = Object.assign({}, row);

            const front = mapping.front.map((mappingDefinition: CourseMappingDefinition) => {
                return {
                    word: row[mappingDefinition.word],
                    hint: mappingDefinition.hint ? row[mappingDefinition.hint] : undefined
                }
            });

            const back = mapping.back.map((mappingDefinition: CourseMappingDefinition) => {
                return {
                    word: row[mappingDefinition.word],
                    hint: mappingDefinition.hint ? row[mappingDefinition.hint] : undefined
                }
            });

            const definition = {
                front: front,
                back: back
            };

            // const front_word = { word: row['Translation'] };
            // const back_word_1 = { word: row['Active Past'], hint: row['Transliteration Past'] };
            // const back_word_2 = { word: row['Active Present'], hint: row['Transliteration Present'] };
            // const back = [back_word_1, back_word_2];

            // const front_word = { word: row['English'] };
            // const back_word_1 = { word: row['Arabic'], hint: row['Pronounciation'] };
            // const back = [back_word_1];
    
            // const definition = {
            //   front: [front_word],
            //   back: back
            // };
    
            definitions.push(definition as Definition);
          })
          .on('end', () => {
            resolve(definitions); // Resolve the promise when the reading is done
          })
          .on('error', (error) => {
            reject(error); // Reject the promise if an error occurs
          });
      });
    
      try {
        const result = await promise; // Wait for the promise to resolve
        // You can return the definitions here or use them as needed
      } catch (error) {
        console.error('Error reading CSV:', error);
        // Handle the error as needed
      }

    return definitions;
}

import courseData from "@/data/courses.json";

export const getCourses = async (): Promise<Course[]> => {
    const courses = courseData as Course[];

    return courses;
}

export const getCourseById = async (courseId: string): Promise<Course> => {
    const courses = courseData as Course[];

    const course = courses.find(course => course.id === courseId);

    if (!course) {
        throw new Error(`Course ${courseId} not found.`);
    }

    return course;
}

export const getLessonById = async (courseId: string, lessonId: string): Promise<Lesson> => {
    const course = await getCourseById(courseId);

    if (!course.lessons) {
        throw new Error(`Course ${courseId} has no lessons.`);
    }

    const lessons = course.lessons as  Array<Lesson | CSVLesson>;

    let lesson = lessons.find(lesson => lesson.id === lessonId);
    // .find(lesson => lesson.id === lessonId);

    if (!lesson) {
        throw new Error(`Lesson ${lessonId} not found.`);
    }

    // Map CSV lessons to actual lessons
    if (lesson.hasOwnProperty('filename')) {
        const csvLesson = lesson as CSVLesson;

        const definitions = await loadDefinitionsFromCSV(course.mapping, csvLesson);

        lesson = {
            id: csvLesson.id,
            title: csvLesson.title,
            exercises: definitions.map(definition => {
                return {
                    ...definition,
                    tries: 0,
                    correct: 0,
                    status: 'unlearned',
                } as Exercise;
            })
        } as Lesson;
    }

    return lesson as Lesson;
}