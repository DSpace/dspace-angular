import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsAddChar'
})

/**
 * Pipe for adding specific char to end of the value rendered in the html.
 */
export class CharToEndPipe implements PipeTransform {
  /**
   * @param {string} value String to be updated
   * @param charToEnd
   * @returns {string} Updated value with specific char added to the end
   */
  transform(value: string, charToEnd: string): string {
    if (value) {
      return value + ' ' + charToEnd;
    }
    return value;
  }
}
