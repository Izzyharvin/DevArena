// -------------------------------------------
// Returns a single challenge by its slug (URL param).
// Example: /api/challenges/two-sum
// -------------------------------------------

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
    // Find challenge by slug (unique field)
    const challenge = await prisma.challenge.findUnique({
        where: { slug: params.slug },
    });

    // Handle 404 if not found
    if (!challenge) return new NextResponse("Not found", { status: 404 });

    // Return the challenge as JSON
    return NextResponse.json(challenge);
}
