import { Pipe, PipeTransform } from '@angular/core'

/**
 * Pipe to truncate a value in Angular. (Take a substring, starting at 0)
 * Default value: 10
 */
@Pipe({
  name: 'dsCapitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string, args: string[]): string {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

}
