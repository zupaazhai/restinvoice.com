/**
 * Custom Friendly ID (Slug) Generator
 *
 * Generates human-readable slugs in the format: adjective-noun-verb-####
 * Example: happy-cat-runs-3421, bright-moon-shines-7892
 *
 * No external dependencies - uses curated word lists embedded in this file.
 */

// Curated word lists for slug generation
const ADJECTIVES = [
  "happy",
  "bright",
  "swift",
  "calm",
  "bold",
  "cool",
  "wise",
  "kind",
  "warm",
  "quick",
  "neat",
  "rare",
  "fine",
  "pure",
  "rich",
  "lucky",
  "brave",
  "clever",
  "gentle",
  "proud",
  "smart",
  "noble",
  "quiet",
  "wild",
  "fresh",
  "sweet",
  "eager",
  "merry",
  "lively",
  "fancy",
  "jolly",
  "mighty",
  "sharp",
  "sleek",
  "snappy",
  "stable",
  "sturdy",
  "tender",
  "vivid",
  "witty",
  "zesty",
  "agile",
  "crisp",
  "dapper",
  "grand",
  "plucky",
  "spry",
  "zippy",
  "chipper",
  "dashing",
];

const NOUNS = [
  "cat",
  "dog",
  "fox",
  "owl",
  "bee",
  "elk",
  "ray",
  "lion",
  "moon",
  "star",
  "sun",
  "wave",
  "tree",
  "leaf",
  "bird",
  "fish",
  "bear",
  "wolf",
  "deer",
  "seal",
  "hawk",
  "dove",
  "frog",
  "crab",
  "duck",
  "goat",
  "panda",
  "koala",
  "tiger",
  "zebra",
  "eagle",
  "otter",
  "cloud",
  "river",
  "ocean",
  "stone",
  "pearl",
  "gem",
  "rose",
  "wind",
  "flame",
  "spark",
  "light",
  "dawn",
  "dusk",
  "peak",
  "path",
  "brook",
  "meadow",
];

const VERBS = [
  "runs",
  "flies",
  "jumps",
  "swims",
  "climbs",
  "dances",
  "shines",
  "grows",
  "moves",
  "soars",
  "glides",
  "flows",
  "blooms",
  "waves",
  "sings",
  "plays",
  "leaps",
  "hops",
  "spins",
  "twirls",
  "drifts",
  "floats",
  "bounces",
  "races",
  "zooms",
  "skips",
  "slides",
  "rolls",
  "glows",
  "beams",
  "sparkles",
  "gleams",
  "wanders",
  "roams",
  "travels",
  "sails",
  "cruises",
  "strolls",
  "trots",
  "dashes",
  "springs",
  "bounds",
  "vaults",
  "swoops",
  "dives",
  "surges",
  "rushes",
  "speeds",
  "hastens",
  "whisks",
];

/**
 * UUID validation regex pattern
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check if a string is a valid UUID
 */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/**
 * Generate a random friendly slug
 * Format: adjective-noun-verb-####
 */
export function generateSlug(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  const number = Math.floor(1000 + Math.random() * 9000); // 1000-9999

  return `${adjective}-${noun}-${verb}-${number}`;
}

/**
 * Validate slug format
 * Must be lowercase, hyphens only, alphanumeric
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Check if slug is available in database
 */
export async function isSlugAvailable(db: D1Database, slug: string): Promise<boolean> {
  const result = await db
    .prepare("SELECT COUNT(*) as count FROM templates WHERE slug = ?")
    .bind(slug)
    .first<{ count: number }>();

  return result?.count === 0;
}

/**
 * Generate a unique slug (with retry logic)
 * Tries up to maxAttempts times to find a unique slug
 */
export async function generateUniqueSlug(db: D1Database, maxAttempts = 10): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const slug = generateSlug();
    const available = await isSlugAvailable(db, slug);

    if (available) {
      return slug;
    }
  }

  // If we couldn't find a unique slug after maxAttempts,
  // append timestamp to ensure uniqueness
  const slug = generateSlug();
  const timestamp = Date.now().toString(36); // Convert to base36 for shorter string
  return `${slug}-${timestamp}`;
}
