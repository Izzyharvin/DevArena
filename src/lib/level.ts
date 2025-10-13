// -------------------------------------------
// Purpose: Convert player XP into a level value.
// Used after submissions to calculate progression.
// -------------------------------------------

export function xpToLevel(xp: number) {
    // Each 100 XP increases level by 1
    // Example: 0–99 XP = Level 1, 100–199 XP = Level 2
    return Math.max(1, Math.floor(xp / 100) + 1);
}
