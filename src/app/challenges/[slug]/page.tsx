// -------------------------------------------
// src/app/challenges/[slug]/page.tsx
// Purpose: Server component that fetches a single challenge by slug
// and renders a client SubmitForm. Also ensures a test user exists
// (since Q1 has no auth yet).
// -------------------------------------------

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubmitForm from "@/components/SubmitForm";
import { getTestUser } from "@/lib/getTestUser";

type Props = { params: { slug: string } };

export default async function ChallengeDetailPage({ params }: Props) {
    // Fetch the challenge from the DB
    const challenge = await prisma.challenge.findUnique({
        where: { slug: params.slug },
        select: { id: true, title: true, promptMd: true, difficulty: true, points: true },
    });

    if (!challenge) return notFound();

    // Ensure we have a test user (until auth is added)
    const user = await getTestUser();

    return (
        <main className="mx-auto max-w-3xl p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <p className="text-sm text-gray-600">
                    Difficulty: <span className="font-medium">{challenge.difficulty}</span> • {challenge.points} pts
                </p>
            </div>

            <article className="prose max-w-none">
                {/* Minimal rendering of the Markdown prompt (plain text for Q1) */}
                <pre className="whitespace-pre-wrap rounded bg-gray-50 p-4 text-sm">
                    {challenge.promptMd}
                </pre>
            </article>

            {/* Client-side submit form gets userId + challengeId */}
            <section className="mt-4">
                <h2 className="mb-2 text-lg font-semibold">Submit your solution</h2>
                <SubmitForm userId={user.id} challengeId={challenge.id} />
            </section>
        </main>
    );
}
