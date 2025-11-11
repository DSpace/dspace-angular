import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { hasNoValue } from '@dspace/shared/utils/empty.util';

/**
 * Returns true if the passed value is null or undefined.
 */
@Pipe({ standalone: true, name: 'dsHasNoValue' })
export class HasNoValuePipe implements PipeTransform {
  transform(value: any): boolean {
    return hasNoValue(value);
  }
}
