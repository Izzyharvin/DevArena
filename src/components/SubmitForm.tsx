"use client";

// Purpose: Client-side form to send code to /api/submit.
// Receives userId + challengeId from the server component.
// -------------------------------------------

import { useState } from "react";

type Props = {
    userId: string;
    challengeId: string;
};

export default function SubmitForm({ userId, challengeId }: Props) {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | {
        ok: boolean;
        passed: boolean;
        passedCount: number;
        totalCount: number;
    }>(null);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // The Q1 evaluator accepts these three fields
                body: JSON.stringify({ userId, challengeId, code }),
            });

            if (!res.ok) {
                // try to extract a message; fall back to generic
                const errJson = (await res.json().catch(() => null)) as { message?: string } | null;
                throw new Error(errJson?.message ?? `HTTP ${res.status}`);
            }

            const data = (await res.json()) as {
                ok: boolean; passed: boolean; passedCount: number; totalCount: number;
            };
            setResult(data);
        } catch (err: unknown) {
            // Narrow unknown to Error safely
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm font-medium">Your solution (Q1: any code)</label>
            <textarea
                className="w-full h-40 rounded border p-2 font-mono text-sm"
                placeholder="// Paste or type your solution here…"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button
                type="submit"
                disabled={loading}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
            >
                {loading ? "Submitting…" : "Submit"}
            </button>

            {error && <p className="text-red-600 text-sm">Error: {error}</p>}

            {result && (
                <div className="rounded border p-3">
                    <p className="font-medium">Result</p>
                    <p>
                        Passed:{" "}
                        <span className={result.passed ? "text-green-600" : "text-red-600"}>
                            {String(result.passed)}
                        </span>
                    </p>
                    <p>Tests: {result.passedCount}/{result.totalCount}</p>
                </div>
            )}
        </form>
    );
}
