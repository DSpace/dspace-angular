import {
  Pipe,
  PipeTransform,
} from '@angular/core';

@Pipe({
  name: 'dsCompareValues',
  standalone: true,
})
export class CompareValuesPipe implements PipeTransform {

  /**
   * Returns a string with a checkmark if the received value is equal to the current value,
   * or the current value if they are not equal.
   * @param receivedValue the value received from the registration data
   * @param currentValue the value from the current user
   * @returns the value to be displayed in the template
   */
  transform(receivedValue: string, currentValue: string): string {
    if (receivedValue === currentValue) {
      return '<i class="fa fa-check-circle text-success fa-xl" aria-hidden="true"></i>';
    } else {
      return currentValue;
    }
  }
}
