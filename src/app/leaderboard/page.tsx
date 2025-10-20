// Purpose: Server component to show top users by XP.
// -------------------------------------------

import { prisma } from "@/lib/prisma";

type Leader = {
    name: string | null;
    xp: number;
    level: number;
};

export default async function LeaderboardPage() {
    const leaders: Leader[] = await prisma.user.findMany({
        orderBy: [{ xp: "desc" }],
        select: { name: true, xp: true, level: true },
        take: 50,
    });

    return (
        <main className="mx-auto max-w-2xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Leaderboard</h1>
            <ol className="space-y-2">
                {/* ✅ Type both parameters explicitly */}
                {leaders.map((u: Leader, i: number) => (
                    <li key={i} className="flex items-center gap-4 rounded border p-3">
                        <span className="w-6 text-right">{i + 1}.</span>
                        <span className="flex-1">{u.name ?? "Anonymous"}</span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs">LV {u.level}</span>
                        <span className="text-sm text-gray-700">{u.xp} XP</span>
                    </li>
                ))}
            </ol>
        </main>
    );
}
