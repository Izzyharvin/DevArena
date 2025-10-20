// Purpose: During Q1 (no auth yet), ensure a single "tester" user exists.
// We upsert by email so repeated calls return the same user.
// -------------------------------------------

import { prisma } from "@/lib/prisma";

export async function getTestUser() {
    const email = "tester@local"; // any stable email key works
    const user = await prisma.user.upsert({
        where: { email },
        update: {}, // nothing to update for now
        create: {
            email,
            name: "Anonymous Tester",
            image: null,
        },
        select: { id: true, name: true },
    });
    return user; // { id, name }
}
