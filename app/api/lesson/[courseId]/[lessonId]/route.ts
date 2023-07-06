import { getLessonById } from "@/utils/dataLoader";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { courseId: string, lessonId: string } }) {
    const lesson = await getLessonById(context.params.courseId, context.params.lessonId);

    return new NextResponse(JSON.stringify(lesson), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}