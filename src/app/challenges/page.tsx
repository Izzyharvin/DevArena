import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Explicit item type for this list
type ChallengeListItem = {
    slug: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string[];
    points: number;
};

export default async function ChallengesPage() {
    // Cast result so callbacks get proper types
    const challenges: ChallengeListItem[] = await prisma.challenge.findMany({
        orderBy: [{ createdAt: "desc" }],
        select: { slug: true, title: true, difficulty: true, tags: true, points: true },
    });

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Challenges</h1>

            <ul className="space-y-3">
                {/* ✅ Type both parameters: item and (if used) index */}
                {challenges.map((c: ChallengeListItem, idx: number) => (
                    <li key={c.slug} className="rounded border p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <Link href={`/challenges/${c.slug}`} className="text-lg font-semibold underline">
                                {c.title}
                            </Link>
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs">{c.difficulty}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                            Tags: {c.tags.join(", ")} • {c.points} pts
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-8 text-sm">
                <Link href="/leaderboard" className="underline">View Leaderboard →</Link>
            </div>
        </main>
    );
}
