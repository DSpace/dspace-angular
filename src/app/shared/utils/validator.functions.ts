import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Returns a validator function to check if the control's value is in a given list
 * @param list The list to look in
 */
export function inListValidator(list: string[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const contains = list.indexOf(control.value) > -1;
    return contains ? null : {inList: {value: control.value}}  };
}
