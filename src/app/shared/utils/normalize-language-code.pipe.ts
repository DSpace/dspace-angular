import {
  Pipe,
  PipeTransform,
} from '@angular/core';

import { normalizeLanguageCode } from './normalize-language-code-utils';

/**
 * A custom Angular pipe that normalizes language codes by replacing underscores with dashes.
 *
 * This pipe is useful for transforming POSIX-style language codes (e.g., 'en_US') into
 * standard BCP 47 language tags (e.g., 'en-US').
 *
 * Example usage in a template:
 * {{ 'en_US' | dsNormalizeLanguageCode }} -> 'en-US'
 */
@Pipe({
  name: 'dsNormalizeLanguageCode',
  standalone: true,
})
export class NormalizeLanguageCodePipe implements PipeTransform {
  /**
   * Transforms the input string by replacing all underscores with dashes.
   *
   * @param value - The input string to be transformed. Can be null or undefined.
   * @returns The transformed string with underscores replaced by dashes, or the original value if null/undefined.
   */
  transform(value: string | null | undefined): string | null | undefined {
    return normalizeLanguageCode(value);
  }
}
