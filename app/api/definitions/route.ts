import { Definition } from "@/types/definition";
import { loadDefinitionsFromCSV } from "@/utils/dataLoader";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const definitions: Definition[] = await loadDefinitionsFromCSV("data/verbs.csv");

    return new NextResponse(JSON.stringify(definitions), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}