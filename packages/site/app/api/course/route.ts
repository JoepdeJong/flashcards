import { Course } from "@/types/types";
import { getCourses } from "@/utils/dataLoader";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courses = await getCourses() as Course[];

    return new NextResponse(JSON.stringify(courses), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}