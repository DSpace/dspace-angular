import {
  Pipe,
  PipeTransform,
} from '@angular/core';

/**
 * Custom pipe to split a string into an array of substrings based on a specified separator.
 * @param value - The string to be split.
 * @param separator - The separator used to split the string.
 * @returns An array of substrings.
 */
@Pipe({
  name: 'dsSplit',
  standalone: true,
})
export class SplitPipe implements PipeTransform {
  transform(value: string, separator: string): string[] {
    return value.split(separator);
  }

}
