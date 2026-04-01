/** Deterministic mock rating from 4.0 to 4.9 based on restaurant id */
export function getMockRating(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  const fraction = (Math.abs(hash) % 10) / 10;
  return 4.0 + fraction;
}
