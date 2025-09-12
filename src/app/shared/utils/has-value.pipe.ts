import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils/empty.util';

/**
 * Returns true if the passed value is not null or undefined.
 */
@Pipe({ standalone: true, name: 'dsHasValue' })
export class HasValuePipe implements PipeTransform {
  transform(value: any): boolean {
    return hasValue(value);
  }
}
