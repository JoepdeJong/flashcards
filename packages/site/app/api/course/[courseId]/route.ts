import { Course } from "@/types/types";
import { getCourseById } from "@/utils/dataLoader";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { courseId: string } }) {
    const course = await getCourseById(context.params.courseId) as Course;

    return new NextResponse(JSON.stringify(course), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}