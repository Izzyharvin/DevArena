// -------------------------------------------
// Handles code submissions (simulated evaluator for Q1).
// Later this will evolve into real test execution.
// -------------------------------------------

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod"; // for request body validation
import { xpToLevel } from "@/lib/level";

// Validate incoming request body with Zod schema
const Body = z.object({
    userId: z.string().cuid(),       // must be valid CUID (from Prisma)
    challengeId: z.string().cuid(),
    code: z.string().min(1),         // must contain code
});

export async function POST(req: Request) {
    // Parse and validate request JSON
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success)
        return NextResponse.json(parsed.error.format(), { status: 400 });

    const { userId, challengeId, code } = parsed.data;

    // Simulate challenge evaluation (temporary logic)
    const passed = code.length > 20;  // "pass" if code is long enough
    const passedCount = passed ? 5 : 3;
    const totalCount = 5;

    // Use a DB transaction to safely update multiple tables
    const sub = await prisma.$transaction(async (tx) => {
        // Create submission record
        const s = await tx.submission.create({
            data: { userId, challengeId, code, passed, passedCount, totalCount },
        });

        // If user passed → add XP & recalc level
        if (passed) {
            const addXp = 10;
            const u = await tx.user.update({
                where: { id: userId },
                data: { xp: { increment: addXp } },
                select: { xp: true },
            });
            // Recalculate user’s level
            await tx.user.update({
                where: { id: userId },
                data: { level: xpToLevel(u.xp) },
            });
        }

        return s;
    });

    // Return result payload
    return NextResponse.json({
        ok: true,
        submissionId: sub.id,
        passed,
        passedCount,
        totalCount,
    });
}
