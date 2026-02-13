/**
 * Normalizes a language code by replacing underscores with hyphens.
 *
 * This function is useful for transforming POSIX-style language codes (e.g., 'en_US') into
 * standard BCP 47 language tags (e.g., 'en-US').
 *
 * @param value - The input string to be transformed. Can be null or undefined.
 * @returns The transformed string with underscores replaced by dashes, or the original value if null/undefined.
 */
export function normalizeLanguageCode(value: string | null | undefined): string | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }
  return value.replace(/_/g, '-');
}
