import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'dsObjectValues'})
/**
 * Pipe for parsing all values of an object to an array of values
 */
export class ObjectValuesPipe implements PipeTransform {

  /**
   * @param value An object
   * @returns {any} Array with all values of the input object
   */
  transform(value, args: string[]): any {
    const values = [];
    Object.values(value).forEach((v) => values.push(v));
    return values;
  }
}
