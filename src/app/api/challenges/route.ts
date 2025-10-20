// -------------------------------------------
// Returns a list of all challenges (for home/catalog view).
// -------------------------------------------

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    // Query all challenges, newest first
    const rows = await prisma.challenge.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Send result as JSON
    return NextResponse.json(rows);
}
