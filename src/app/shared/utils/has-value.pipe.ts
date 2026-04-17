import {
  Pipe,
  PipeTransform,
} from '@angular/core';

import { hasValue } from '../empty.util';

/**
 * Returns true if the passed value is not null or undefined.
 */
@Pipe({ name: 'dsHasValue' })
export class HasValuePipe implements PipeTransform {
  transform(value: any): boolean {
    return hasValue(value);
  }
}
