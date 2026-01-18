/**
 * Generates a secure API key with the format: riv_{env}_{ref}_{secret}
 *
 * @param env Environment prefix (e.g., 'test', 'live')
 * @returns Object containing the full key and its components
 */
export async function generateApiKey(env: string = "test") {
  // Generate public reference (random 8 chars hex)
  const refBytes = new Uint8Array(4);
  crypto.getRandomValues(refBytes);
  const ref = [...refBytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  // Generate private secret (random 32 chars hex / 16 bytes)
  const secretBytes = new Uint8Array(16);
  crypto.getRandomValues(secretBytes);
  const secret = [...secretBytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  // Full key
  const key = `riv_${env}_${ref}_${secret}`;

  return {
    key,
    ref,
    secret,
  };
}
