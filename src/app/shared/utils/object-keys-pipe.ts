import {
  Pipe,
  PipeTransform,
} from '@angular/core';

@Pipe({
  name: 'dsObjectKeys',
  standalone: true,
})
/**
 * Pipe for parsing all keys of an object to an array of key-value pairs
 */
export class ObjectKeysPipe implements PipeTransform {

  /**
   * @param value An object
   * @returns {any} Array with all keys the input object
   */
  transform(value): any {
    const keys = [];
    Object.keys(value).forEach((k) => keys.push(k));
    return keys;
  }
}
