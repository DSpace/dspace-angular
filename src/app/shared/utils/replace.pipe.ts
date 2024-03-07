import { Pipe, PipeTransform } from '@angular/core';
import { hasValue, isEmpty } from '../empty.util';

/**
 * Pipe to replace a character in the value. The first argument is the character to replace and the second argument
 * is the character to replace with.
 */
@Pipe({
  name: 'dsReplace'
})
export class ReplacePipe implements PipeTransform {

  /**
   * Replace the character in the metadata value.
   *
   * @param value    The metadata value
   * @param args     The character to replace and the new character
   */
  transform(value: string, args: string[]): string {
    if (hasValue(value)) {
      if (isEmpty(args)) {
        return value;
      }

      // Replace the character in the metadata value
      if (args?.length === 2) {
        value = value.replace(args[0], args[1]);
      }
      return value;
    }

    return value;
  }
}
